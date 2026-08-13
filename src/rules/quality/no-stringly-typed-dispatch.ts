import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { MINIMUM_STRING_DISPATCH_COMPARISONS } from "../../data/rule-thresholds.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  stringSwitchDispatch:
    "This switch dispatches on raw string literals. Dispatch through a typed discriminant and a data-driven table instead.",
  stringIfChainDispatch:
    "This if chain dispatches on raw string literals. Dispatch through a typed discriminant and a data-driven table instead.",
} as const;

function nonEmptyStringLiteral(node: TSESTree.Expression): node is TSESTree.StringLiteral {
  return node.type === "Literal" && typeof node.value === "string" && node.value !== "";
}

function isEqualityComparison(
  node: TSESTree.Expression,
): node is TSESTree.SymmetricBinaryExpression {
  return (
    node.type === "BinaryExpression" &&
    (node.operator === "===" ||
      node.operator === "==" ||
      node.operator === "!==" ||
      node.operator === "!=")
  );
}

function stringComparison(node: TSESTree.Expression): TSESTree.Expression | undefined {
  if (!isEqualityComparison(node)) {
    return undefined;
  }
  if (nonEmptyStringLiteral(node.right)) {
    return node.left;
  }
  if (nonEmptyStringLiteral(node.left)) {
    return node.right;
  }
  return undefined;
}

function countStringCaseTests(node: TSESTree.SwitchStatement): number {
  return node.cases.filter((branch) => branch.test !== null && nonEmptyStringLiteral(branch.test))
    .length;
}

export const noStringlyTypedDispatch: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports control flow keyed on raw string literals. Refactor suggested: dispatch through a typed discriminant and a data-driven table (Stringly Typed).",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (isTestFile(context.filename)) {
      return {};
    }

    const reportStringIfChain = (head: TSESTree.IfStatement): void => {
      const comparisonCounts = new Map<string, number>();
      let current: TSESTree.IfStatement | undefined = head;
      while (current) {
        const operand = stringComparison(current.test);
        if (operand !== undefined) recordComparison(operand);
        current = current.alternate?.type === "IfStatement" ? current.alternate : undefined;
      }
      const exceedsDispatchThreshold = [...comparisonCounts.values()].some(
        (count) => count >= MINIMUM_STRING_DISPATCH_COMPARISONS,
      );
      if (exceedsDispatchThreshold)
        context.report({ node: head, messageId: "stringIfChainDispatch" });

      function recordComparison(operand: TSESTree.Expression): void {
        const operandText = context.sourceCode.getText(operand);
        comparisonCounts.set(operandText, (comparisonCounts.get(operandText) ?? 0) + 1);
      }
    };

    return {
      SwitchStatement(node) {
        if (countStringCaseTests(node) >= MINIMUM_STRING_DISPATCH_COMPARISONS) {
          context.report({ node: node.discriminant, messageId: "stringSwitchDispatch" });
        }
      },
      IfStatement(node) {
        if (node.parent?.type === "IfStatement" && node.parent.alternate === node) {
          return;
        }
        reportStringIfChain(node);
      },
    };
  },
};
