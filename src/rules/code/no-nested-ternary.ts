import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

const messages = {
  nestedTernary:
    "Nested ternary obscures intent (Conditional Complexity). Extract the condition into a method or use guard clauses.",
} as const;

export const noNestedTernary: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports nested ternary expressions. Refactor suggested: extract the condition or use guard clauses (Conditional Complexity).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const hasNestedBranch = (node: TSESTree.ConditionalExpression): boolean =>
      node.consequent.type === "ConditionalExpression" ||
      node.alternate.type === "ConditionalExpression";

    return {
      ConditionalExpression(node) {
        if (hasNestedBranch(node)) {
          context.report({ node, messageId: "nestedTernary" });
        }
      },
    };
  },
};
