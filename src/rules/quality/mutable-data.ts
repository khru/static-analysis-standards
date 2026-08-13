import type { TSESLint } from "@typescript-eslint/utils";

import { smellEntry } from "../../data/smell-catalog.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("mutable-data");

const messages = {
  mutableData:
    "Review candidate: '{{name}}' is declared mutable; prefer immutable data (const) unless reassignment is the point (tdd-refactor: Mutable Data).",
} as const;

export const mutableData: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports let declarations in domain and application files. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
      VariableDeclaration: (node) => {
        if (node.kind !== "let") return;
        for (const declarator of node.declarations) {
          if (declarator.id.type !== "Identifier") continue;
          context.report({
            node: declarator,
            messageId: "mutableData",
            data: { name: declarator.id.name },
          });
        }
      },
    };
  },
};
