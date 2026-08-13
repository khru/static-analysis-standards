import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { MINIMUM_CALLBACK_HELL_DEPTH } from "../../data/rule-thresholds.js";
import { smellEntry } from "../../data/smell-catalog.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("callback-hell");

const messages = {
  callbackHell:
    "Review candidate: this function is nested {{depth}} callbacks deep; consider composing the steps (tdd-refactor: Callback Hell).",
} as const;

export const callbackHell: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports function expressions nested at least ${MINIMUM_CALLBACK_HELL_DEPTH} callback levels deep. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }
    let depth = 0;
    return {
      ArrowFunctionExpression: (node) => enter(context, node),
      FunctionExpression: (node) => enter(context, node),
      "ArrowFunctionExpression:exit": () => {
        depth -= 1;
      },
      "FunctionExpression:exit": () => {
        depth -= 1;
      },
    };

    function enter(
      context: TSESLint.RuleContext<keyof typeof messages, []>,
      node: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
    ): void {
      if (depth >= MINIMUM_CALLBACK_HELL_DEPTH) {
        context.report({
          node,
          messageId: "callbackHell",
          data: { depth: depth + 1 },
        });
      }
      depth += 1;
    }
  },
};
