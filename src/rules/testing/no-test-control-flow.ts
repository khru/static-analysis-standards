import type { TSESLint } from "@typescript-eslint/utils";

import { TEST_CASE_CONTROL_FLOW_TYPES } from "../../data/control-flow-catalogs.js";
import { testCaseCallback, walkOwnScope } from "../../shared/ast.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  testControlFlow:
    "Test cases contain no branches or loops. Extract the decision into the system under test or parameterize with it.each/test.each (Conditional Test Logic).",
} as const;

export const noTestControlFlow: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports branches, loops and ternaries inside test cases. Refactor suggested: keep the Arrange-Act-Assert linear or use it.each/test.each (Conditional Test Logic).",
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
          if (TEST_CASE_CONTROL_FLOW_TYPES.includes(child.type)) {
            context.report({ node: child, messageId: "testControlFlow" });
          }
        });
      },
    };
  },
};
