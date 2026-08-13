import type { TSESLint } from "@typescript-eslint/utils";

import { isAmbientDateConstruction } from "../../shared/ast.js";
import { isClockFile, isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  ambientDate:
    "Bare date construction reads ambient time (Hidden Dependencies). Receive the value from the injected Clock instead.",
} as const;

export const noDateConstructionOutsideClock: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports bare date construction that reads ambient time outside the Clock. Refactor suggested: receive the value from the injected Clock (Hidden Dependencies).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (isTestFile(filename) || isClockFile(filename) || isDomainOrApplicationFile(filename)) {
      return {};
    }
    return {
      NewExpression(node) {
        if (isAmbientDateConstruction(node)) {
          context.report({ node, messageId: "ambientDate" });
        }
      },
      CallExpression(node) {
        if (isAmbientDateConstruction(node)) {
          context.report({ node, messageId: "ambientDate" });
        }
      },
    };
  },
};
