import type { TSESLint } from "@typescript-eslint/utils";

import { smellEntry } from "../../data/smell-catalog.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("imperative-loops");

const messages = {
  imperativeLoop:
    "Review candidate: this imperative loop can likely be expressed with a functional collection operation (map, filter or reduce); tdd-refactor: Imperative Loops.",
} as const;

export const imperativeLoops: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports imperative loops in domain and application files. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
      ForStatement: (node) => context.report({ node, messageId: "imperativeLoop" }),
      ForInStatement: (node) => context.report({ node, messageId: "imperativeLoop" }),
      ForOfStatement: (node) => context.report({ node, messageId: "imperativeLoop" }),
      WhileStatement: (node) => context.report({ node, messageId: "imperativeLoop" }),
      DoWhileStatement: (node) => context.report({ node, messageId: "imperativeLoop" }),
    };
  },
};
