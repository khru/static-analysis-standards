import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { BINARY_OPERATOR_WORDS } from "../../data/binary-operator-words.js";
import { smellEntry } from "../../data/smell-catalog.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("binary-operator-in-name");

const messages = {
  binaryOperatorInName:
    "Review candidate: '{{name}}' embeds the operator word '{{operator}}'; prefer a name that states the intent (tdd-refactor: Binary Operator in Name).",
} as const;

const binaryOperatorWords = new Set(BINARY_OPERATOR_WORDS);

function containsOperatorWord(name: string): string | undefined {
  const segments = name.split(/(?=[A-Z])|_|\d/);
  const words = segments.map((word) => word.toLowerCase()).filter((word) => word.length > 0);
  return words.find((word) => binaryOperatorWords.has(word));
}

function analyzeName(
  context: TSESLint.RuleContext<keyof typeof messages, []>,
  node: TSESTree.Node,
  name: string,
): void {
  const operator = containsOperatorWord(name);
  if (operator !== undefined) {
    context.report({ node, messageId: "binaryOperatorInName", data: { name, operator } });
  }
}

export const binaryOperatorInName: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports names that embed a binary operator word (and, or, not, in, between). Review candidate (tdd-refactor: ${catalogEntry.title}).`,
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }
    return {
      FunctionDeclaration: (node) => {
        if (node.id !== null) {
          analyzeName(context, node, node.id.name);
        }
      },
      FunctionExpression: (node) => {
        if (node.id !== null) {
          analyzeName(context, node, node.id.name);
        }
      },
      MethodDefinition: (node) => {
        if (node.key.type === "Identifier") {
          analyzeName(context, node, node.key.name);
        }
      },
      ClassDeclaration: (node) => {
        if (node.id !== null) {
          analyzeName(context, node, node.id.name);
        }
      },
    };
  },
};
