import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { MAX_ONE_INDENTATION_DEPTH } from "../../data/rule-thresholds.js";
import { walkOwnScope } from "../../shared/ast.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  nestedTooDeep:
    "Review candidate: this body nests statements more than one level deep; consider extracting nested blocks into helper functions (Calisthenics: one level of indentation).",
} as const;

function blockDepthAboveBody(node: TSESTree.Node, body: TSESTree.BlockStatement): number {
  const ancestors: TSESTree.Node[] = [];
  let current: TSESTree.Node = node.parent!;
  while (current !== body) {
    ancestors.push(current);
    current = current.parent!;
  }
  return ancestors.filter((ancestor) => ancestor.type === "BlockStatement").length;
}

function deepestStatementNesting(body: TSESTree.BlockStatement): number {
  let deepest = 0;
  walkOwnScope(body, (node) => {
    if (node.type === "BlockStatement") {
      return;
    }
    const depth = blockDepthAboveBody(node, body);
    if (depth > deepest) {
      deepest = depth;
    }
  });
  return deepest;
}

type FunctionLikeNode =
  TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression;

export const maxOneIndentation: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports functions whose statements nest more than one level of indentation. Review candidate: consider extracting nested blocks into helper functions (Calisthenics: one level of indentation).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (isTestFile(filename)) {
      return {};
    }

    function analyzeFunction(node: FunctionLikeNode): void {
      const body = node.body;
      if (body.type !== "BlockStatement") {
        return;
      }
      if (deepestStatementNesting(body) >= MAX_ONE_INDENTATION_DEPTH) {
        context.report({ node, messageId: "nestedTooDeep" });
      }
    }

    return {
      FunctionDeclaration: analyzeFunction,
      FunctionExpression: analyzeFunction,
      ArrowFunctionExpression: analyzeFunction,
    };
  },
};
