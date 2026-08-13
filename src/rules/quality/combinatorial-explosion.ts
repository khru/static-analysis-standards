import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { MINIMUM_COMBINATORIAL_CONDITIONS } from "../../data/rule-thresholds.js";
import { smellEntry } from "../../data/smell-catalog.js";
import { walkOwnScope } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("combinatorial-explosion");

const messages = {
  combinatorialExplosion:
    "Review candidate: '{{name}}' branches over {{conditions}} conditions; the combinations may become untestable (tdd-refactor: Combinatorial Explosion).",
} as const;

function conditionalCount(body: TSESTree.BlockStatement): number {
  let count = 0;
  walkOwnScope(body, (node) => {
    if (node.type === "IfStatement") {
      count += 1;
    }
  });
  return count;
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
  const conditions = conditionalCount(body);
  if (conditions >= MINIMUM_COMBINATORIAL_CONDITIONS) {
    const name = node.id?.name ?? "function";
    context.report({ node, messageId: "combinatorialExplosion", data: { name, conditions } });
  }
}

export const combinatorialExplosion: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports functions with at least ${MINIMUM_COMBINATORIAL_CONDITIONS} conditional branches. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
