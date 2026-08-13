import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { smellEntry } from "../../data/smell-catalog.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("null-check");

const messages = {
  nullCheck:
    "Review candidate: this defensive null/undefined check may signal missing invariants; evaluate a Null Object or Option model (tdd-refactor: Null Check).",
} as const;

function isNullishComparison(node: TSESTree.Node): boolean {
  if (node.type !== "BinaryExpression") {
    return false;
  }
  const isNullishLiteral = (candidate: TSESTree.Node): boolean =>
    (candidate.type === "Literal" && (candidate.value === null || candidate.value === undefined)) ||
    (candidate.type === "Identifier" && candidate.name === "undefined");
  return isNullishLiteral(node.left) || isNullishLiteral(node.right);
}

function isTypeofUndefinedCheck(node: TSESTree.Node): boolean {
  return (
    node.type === "BinaryExpression" &&
    ((node.left.type === "UnaryExpression" && node.left.operator === "typeof") ||
      (node.right.type === "UnaryExpression" && node.right.operator === "typeof"))
  );
}

function analyzeCondition(
  context: TSESLint.RuleContext<keyof typeof messages, []>,
  node: TSESTree.Node,
): void {
  if (isNullishComparison(node) || isTypeofUndefinedCheck(node)) {
    context.report({ node, messageId: "nullCheck" });
  }
}

export const nullCheck: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports defensive null/undefined checks in domain and application files. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
      IfStatement: (node) => analyzeCondition(context, node.test),
      WhileStatement: (node) => analyzeCondition(context, node.test),
      ConditionalExpression: (node) => analyzeCondition(context, node.test),
    };
  },
};
