import type { TSESLint } from "@typescript-eslint/utils";

import { isApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  concreteAdapterDependency:
    "Application depends on the infrastructure adapter '{{source}}'. Depend on the owning port instead.",
} as const;

export const dependOnPortNotAdapter: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports application dependencies on infrastructure adapters. Refactor suggested: depend on the owning port, not the concrete adapter.",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (source.includes("infrastructure")) {
          context.report({ node, messageId: "concreteAdapterDependency", data: { source } });
        }
      },
    };
  },
};
