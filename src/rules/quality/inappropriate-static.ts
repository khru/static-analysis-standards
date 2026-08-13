import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { smellEntry } from "../../data/smell-catalog.js";
import { isNode } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("inappropriate-static");

const messages = {
  inappropriateStatic:
    "Review candidate: method '{{name}}' never touches instance state; evaluate making it static (tdd-refactor: Inappropriate Static).",
} as const;

function childNodesOf(node: TSESTree.Node): TSESTree.Node[] {
  const entries = Object.entries(node);
  const childEntries = entries.filter(([key]) => key !== "parent");
  const values = childEntries.map(([, value]) => value);
  const arrayChildren = values.flatMap((value) =>
    Array.isArray(value) ? value.filter(isNode) : [],
  );
  return arrayChildren.concat(values.filter(isNode));
}

function methodUsesThis(node: TSESTree.Node): boolean {
  if (node.type === "ThisExpression") {
    return true;
  }
  if (node.type === "FunctionExpression" || node.type === "FunctionDeclaration") {
    return false;
  }
  return childNodesOf(node).some((child) => methodUsesThis(child));
}

export const inappropriateStatic: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports instance methods that never reference instance state. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
      MethodDefinition: (node) => {
        if (node.kind !== "method" || node.static || node.key.type !== "Identifier") {
          return;
        }
        const body = node.value.body;
        if (body !== null && !methodUsesThis(body)) {
          context.report({ node, messageId: "inappropriateStatic", data: { name: node.key.name } });
        }
      },
    };
  },
};
