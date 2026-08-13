import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { STATUS_VARIABLE_MIN_ASSIGNMENTS } from "../../data/rule-thresholds.js";
import { smellEntry } from "../../data/smell-catalog.js";
import { walkOwnScope } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("status-variable");

const messages = {
  statusVariable:
    "Review candidate: '{{name}}' changes between status values; evaluate an explicit status/state model (tdd-refactor: Status Variable).",
} as const;

type FunctionLikeNode =
  TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression;

function isFunctionLike(node: TSESTree.Node): node is FunctionLikeNode {
  return (
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression"
  );
}

function enclosingFunction(node: TSESTree.Node): FunctionLikeNode | undefined {
  let current: TSESTree.Node | null | undefined = node.parent;
  while (current != null && !isFunctionLike(current)) {
    current = current.parent;
  }
  return current ?? undefined;
}

function stringLiteralAssignments(body: TSESTree.BlockStatement, name: string): number {
  let count = 0;
  walkOwnScope(body, (node) => {
    if (
      node.type === "AssignmentExpression" &&
      node.left.type === "Identifier" &&
      node.left.name === name &&
      node.right.type === "Literal" &&
      typeof node.right.value === "string"
    ) {
      count += 1;
    }
  });
  return count;
}

function functionBody(node: FunctionLikeNode): TSESTree.BlockStatement | undefined {
  return node.body.type === "BlockStatement" ? node.body : undefined;
}

export const statusVariable: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports a local variable initialized with a status value that is reassigned within the same function. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
      VariableDeclarator: (node) => {
        if (
          node.id.type !== "Identifier" ||
          node.init?.type !== "Literal" ||
          typeof node.init.value !== "string"
        ) {
          return;
        }
        const scope = enclosingFunction(node);
        if (scope === undefined) {
          return;
        }
        const body = functionBody(scope);
        if (body === undefined) {
          return;
        }
        const reassignments = stringLiteralAssignments(body, node.id.name);
        if (1 + reassignments >= STATUS_VARIABLE_MIN_ASSIGNMENTS) {
          context.report({
            node,
            messageId: "statusVariable",
            data: { name: node.id.name },
          });
        }
      },
    };
  },
};
