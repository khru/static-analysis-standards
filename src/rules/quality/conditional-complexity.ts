import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { MINIMUM_CONDITIONAL_COMPLEXITY } from "../../data/rule-thresholds.js";
import { smellEntry } from "../../data/smell-catalog.js";
import { walkOwnScope } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("conditional-complexity");

const messages = {
  conditionalComplexity:
    "Review candidate: '{{name}}' has {{complexity}} decision points; consider splitting the function (tdd-refactor: Conditional Complexity).",
} as const;

const decisionPointTypes = new Set([
  "IfStatement",
  "ConditionalExpression",
  "ForStatement",
  "ForInStatement",
  "ForOfStatement",
  "WhileStatement",
  "DoWhileStatement",
  "SwitchCase",
  "CatchClause",
]);

function isDecisionPoint(node: TSESTree.Node): boolean {
  if (node.type === "LogicalExpression") {
    return node.operator === "&&" || node.operator === "||";
  }
  return decisionPointTypes.has(node.type);
}

function cyclomaticComplexity(body: TSESTree.BlockStatement): number {
  let complexity = 1;
  walkOwnScope(body, (node) => {
    if (isDecisionPoint(node)) {
      complexity += 1;
    }
  });
  return complexity;
}

function analyzeFunction(
  context: TSESLint.RuleContext<keyof typeof messages, []>,
  node:
    TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
): void {
  const body = node.body;
  if (body.type !== "BlockStatement") {
    return;
  }
  const complexity = cyclomaticComplexity(body);
  if (complexity >= MINIMUM_CONDITIONAL_COMPLEXITY) {
    const name = node.id?.name ?? "function";
    context.report({ node, messageId: "conditionalComplexity", data: { name, complexity } });
  }
}

export const conditionalComplexity: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports functions with at least ${MINIMUM_CONDITIONAL_COMPLEXITY} decision points. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
      FunctionDeclaration: (node) => analyzeFunction(context, node),
      FunctionExpression: (node) => analyzeFunction(context, node),
      ArrowFunctionExpression: (node) => analyzeFunction(context, node),
    };
  },
};
