import type { TSESLint } from "@typescript-eslint/utils";

import { smellEntry } from "../../data/smell-catalog.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("global-data");

const messages = {
  globalData:
    "Review candidate: '{{name}}' is module-level mutable state; prefer passing dependencies explicitly (tdd-refactor: Global Data).",
} as const;

export const globalData: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports mutable top-level declarations in domain and application files. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
        if (node.parent?.type !== "Program") {
          return;
        }
        if (node.kind !== "let" && node.kind !== "var") return;
        for (const declarator of node.declarations) {
          if (declarator.id.type !== "Identifier") continue;
          context.report({
            node: declarator,
            messageId: "globalData",
            data: { name: declarator.id.name },
          });
        }
      },
    };
  },
};
