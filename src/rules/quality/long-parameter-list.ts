import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { LONG_PARAMETER_LIST_MAX } from "../../data/rule-thresholds.js";
import { smellEntry } from "../../data/smell-catalog.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("long-parameter-list");

const messages = {
  longParameterList:
    "Review candidate: '{{name}}' takes {{count}} parameters; consider a parameter object that groups the recurring data (tdd-refactor: Long Parameter List).",
} as const;

type FunctionLikeNode =
  TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression;

function functionName(node: FunctionLikeNode | TSESTree.MethodDefinition): string {
  if (node.type === "MethodDefinition") {
    return node.key.type === "Identifier" ? node.key.name : "method";
  }
  return node.id?.name ?? "function";
}

function parametersOf(
  node: FunctionLikeNode | TSESTree.MethodDefinition,
): readonly TSESTree.Parameter[] {
  return node.type === "MethodDefinition" ? node.value.params : node.params;
}

function analyzeFunction(
  context: TSESLint.RuleContext<keyof typeof messages, []>,
  node: FunctionLikeNode | TSESTree.MethodDefinition,
): void {
  const params = parametersOf(node);
  if (params.length > LONG_PARAMETER_LIST_MAX) {
    context.report({
      node,
      messageId: "longParameterList",
      data: { name: functionName(node), count: params.length },
    });
  }
}

export const longParameterList: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports functions and methods with more than ${LONG_PARAMETER_LIST_MAX} parameters. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
      FunctionExpression: (node) => {
        if (node.parent?.type === "MethodDefinition") {
          return;
        }
        analyzeFunction(context, node);
      },
      ArrowFunctionExpression: (node) => analyzeFunction(context, node),
      MethodDefinition: (node) => analyzeFunction(context, node),
    };
  },
};
