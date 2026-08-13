import type { TSESLint } from "@typescript-eslint/utils";

import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  genericError:
    "Generic 'Error' hides the failure vocabulary. Throw a typed error from the owning context's catalog instead.",
} as const;

export const noGenericError: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports generic 'Error' construction outside test files. Refactor suggested: throw a typed error from the owning context's error catalog.",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (isTestFile(context.filename)) {
      return {};
    }
    const isGenericError = (callee: { type: string; name?: string } | null): boolean =>
      callee?.type === "Identifier" && callee.name === "Error";

    return {
      NewExpression(node) {
        if (isGenericError(node.callee)) {
          context.report({ node, messageId: "genericError" });
        }
      },
      CallExpression(node) {
        if (isGenericError(node.callee)) {
          context.report({ node, messageId: "genericError" });
        }
      },
    };
  },
};
