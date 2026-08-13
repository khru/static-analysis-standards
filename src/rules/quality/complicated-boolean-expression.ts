import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { MINIMUM_COMPLICATED_BOOLEAN_OPERANDS } from "../../data/rule-thresholds.js";
import { smellEntry } from "../../data/smell-catalog.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("complicated-boolean-expression");

const messages = {
  complicatedBoolean:
    "Review candidate: this boolean expression combines {{count}} operands; extract a named predicate (tdd-refactor: Complicated Boolean Expression).",
} as const;

function booleanOperandCount(node: TSESTree.Node): number {
  if (node.type === "BinaryExpression" || node.type === "LogicalExpression") {
    return booleanOperandCount(node.left) + booleanOperandCount(node.right);
  }
  return 1;
}

function analyzeCondition(
  context: TSESLint.RuleContext<keyof typeof messages, []>,
  node: TSESTree.Node,
): void {
  const count = booleanOperandCount(node);
  if (count >= MINIMUM_COMPLICATED_BOOLEAN_OPERANDS) {
    context.report({ node, messageId: "complicatedBoolean", data: { count } });
  }
}

export const complicatedBooleanExpression: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports boolean conditions combining at least ${MINIMUM_COMPLICATED_BOOLEAN_OPERANDS} operands. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
      DoWhileStatement: (node) => analyzeCondition(context, node.test),
      ConditionalExpression: (node) => analyzeCondition(context, node.test),
    };
  },
};
