import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  highCognitiveLoad:
    "Boolean expression has {{score}} cognitive points. Extract named predicates to reduce decision load.",
} as const;

type Options = [{ max?: number }];

const DEFAULT_MAX_COGNITIVE_POINTS = 4;

function cognitivePoints(node: TSESTree.Node): number {
  if (node.type === "LogicalExpression") {
    return 1 + cognitivePoints(node.left) + cognitivePoints(node.right);
  }
  if (node.type === "BinaryExpression") {
    return 1;
  }
  return 0;
}

function reportCondition(
  context: TSESLint.RuleContext<keyof typeof messages, Options>,
  node: TSESTree.Node,
  max: number,
): void {
  const score = cognitivePoints(node);
  if (score > max) {
    context.report({ node, messageId: "highCognitiveLoad", data: { score } });
  }
}

function shouldAnalyzeFile(filename: string): boolean {
  return isDomainOrApplicationFile(filename) && !isTestFile(filename);
}

export const noHighCognitiveBooleanExpression: TSESLint.RuleModule<keyof typeof messages, Options> =
  {
    meta: {
      type: "problem",
      docs: {
        description:
          "Reports boolean expressions whose nested operators and comparisons create excessive cognitive load. Extract named predicates to make policy readable.",
      },
      messages,
      schema: [
        {
          type: "object",
          additionalProperties: false,
          properties: { max: { type: "integer", minimum: 1 } },
        },
      ],
    },
    defaultOptions: [{ max: DEFAULT_MAX_COGNITIVE_POINTS }],
    create(context) {
      const filename = context.filename;
      if (!shouldAnalyzeFile(filename)) {
        return {};
      }
      const max = context.options[0]?.max ?? DEFAULT_MAX_COGNITIVE_POINTS;
      return {
        IfStatement: (node) => reportCondition(context, node.test, max),
        WhileStatement: (node) => reportCondition(context, node.test, max),
        DoWhileStatement: (node) => reportCondition(context, node.test, max),
        ConditionalExpression: (node) => reportCondition(context, node.test, max),
      };
    },
  };
