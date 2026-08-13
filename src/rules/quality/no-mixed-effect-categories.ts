import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { MUTATING_METHOD_NAMES } from "../../data/mutation-methods.js";
import { staticMemberCallName, walkOwnScope } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  mixedEffectCategories:
    "Function mixes a query (returns a value) with a command (mutates state). Split it into a pure query and a pure command.",
} as const;

const mutatingMethods = new Set(MUTATING_METHOD_NAMES);

function isMutation(node: TSESTree.Node): boolean {
  if (node.type === "AssignmentExpression" && node.left.type === "MemberExpression") {
    return true;
  }
  if (node.type === "CallExpression") {
    const methodName = staticMemberCallName(node);
    return methodName !== undefined && mutatingMethods.has(methodName);
  }
  return false;
}

function isQuery(node: TSESTree.Node): boolean {
  return node.type === "ReturnStatement" && node.argument !== null;
}

type FunctionLikeNode =
  TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression;

export const noMixedEffectCategories: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports domain and application functions that mix a query (value return) with a command (mutation). Refactor suggested: split each effect category into its own function (Command Query Separation).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }

    function analyzeFunction(node: FunctionLikeNode): void {
      const body = node.body;
      let hasMutation = false;
      let hasQuery = false;
      walkOwnScope(body, (child) => {
        if (isMutation(child)) {
          hasMutation = true;
        }
        if (isQuery(child)) {
          hasQuery = true;
        }
      });
      if (hasMutation && hasQuery) {
        context.report({ node, messageId: "mixedEffectCategories" });
      }
    }

    return {
      FunctionDeclaration: analyzeFunction,
      FunctionExpression: analyzeFunction,
      ArrowFunctionExpression: analyzeFunction,
    };
  },
};
