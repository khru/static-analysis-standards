import type { TSESLint } from "@typescript-eslint/utils";

import { isAmbientDateConstruction } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  ambientClock:
    "Domain and application must not construct ambient dates. Use the injected Clock instead.",
} as const;

export const noAmbientClock: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports ambient date construction in domain and application code. Refactor suggested: inject the Clock and receive the current date (Hidden Dependencies).",
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
      NewExpression(node) {
        if (isAmbientDateConstruction(node)) {
          context.report({ node, messageId: "ambientClock" });
        }
      },
      CallExpression(node) {
        if (isAmbientDateConstruction(node)) {
          context.report({ node, messageId: "ambientClock" });
        }
      },
    };
  },
};
