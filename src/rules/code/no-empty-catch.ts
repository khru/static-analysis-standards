import type { TSESLint } from "@typescript-eslint/utils";

const messages = {
  emptyCatch:
    "Empty catch block swallows errors. Handle the failure, rethrow a typed error, or remove the catch.",
} as const;

export const noEmptyCatch: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports catch blocks that swallow failures without handling them. Refactor suggested: handle the failure or rethrow a typed error.",
    },
    messages,
    schema: [],
  },
  create(context) {
    return {
      CatchClause(node) {
        if (node.body.body.length === 0) {
          context.report({ node, messageId: "emptyCatch" });
        }
      },
    };
  },
};
