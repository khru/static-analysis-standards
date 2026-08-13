import type { TSESLint } from "@typescript-eslint/utils";

import { MINIMUM_COMPONENT_ARGUMENTS } from "../../data/rule-thresholds.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  localDateComponents:
    "Constructing a Date from components interprets them in the local time zone. Build the instant with Date.UTC or receive the value from the injected Clock.",
} as const;

export const noLocalTimeConstruction: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports Date construction from local components. Refactor suggested: use Date.UTC or the injected Clock (Hidden Dependencies).",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (isTestFile(context.filename)) {
      return {};
    }
    return {
      NewExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "Date" &&
          node.arguments.length >= MINIMUM_COMPONENT_ARGUMENTS
        ) {
          context.report({ node, messageId: "localDateComponents" });
        }
      },
    };
  },
};
