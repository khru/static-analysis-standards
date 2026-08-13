import type { TSESLint } from "@typescript-eslint/utils";

import { testCaseCallback, walkOwnScope } from "../../shared/ast.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  testTryFinally:
    "Test cases must not use try/finally to repair shared state. Move cleanup into a driver, fixture or lifecycle hook with guaranteed per-test isolation.",
} as const;

export const noTryFinallyInTests: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports try/finally blocks inside test cases. Refactor suggested: move resource cleanup into a driver, fixture or lifecycle hook with guaranteed per-test isolation.",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (!isTestFile(context.filename)) {
      return {};
    }

    return {
      CallExpression(node) {
        const callback = testCaseCallback(node);
        if (callback === undefined) {
          return;
        }
        walkOwnScope(callback.body, (child) => {
          if (child.type === "TryStatement" && child.finalizer !== null) {
            context.report({ node: child, messageId: "testTryFinally" });
          }
        });
      },
    };
  },
};
