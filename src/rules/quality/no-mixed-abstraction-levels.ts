import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import {
  COLLABORATOR_QUERY_INIT_TYPES,
  INLINE_INIT_TYPES,
  LOOP_STATEMENT_TYPES,
} from "../../data/abstraction-level-types.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  mixedAbstractionLevels:
    "Function body mixes abstraction levels: it performs inline computation or manual iteration while also orchestrating collaborators. Keep the direct statements of a body at a single level of abstraction.",
} as const;

function isClassConstructor(node: TSESTree.Node): boolean {
  const parent = node.parent;
  return parent?.type === "MethodDefinition" && parent.kind === "constructor";
}

function unwrapAwait(node: TSESTree.Expression): TSESTree.Expression {
  let current = node;
  while (current.type === "AwaitExpression") {
    current = current.argument;
  }
  return current;
}

type FunctionLikeNode =
  TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression;

export const noMixedAbstractionLevels: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports domain and application function bodies that perform inline computation or manual iteration while also orchestrating collaborators, mixing abstraction levels. Refactor suggested: keep each body at one level of abstraction.",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }

    interface AbstractionLevelState {
      namesCollaboratorResults: boolean;
      issuesCommands: boolean;
      performsInlineComputation: boolean;
    }

    function recordVariableDeclaration(
      statement: TSESTree.VariableDeclaration,
      state: AbstractionLevelState,
    ): void {
      for (const declarator of statement.declarations) {
        if (!declarator.init) continue;
        const init = unwrapAwait(declarator.init);
        if (COLLABORATOR_QUERY_INIT_TYPES.includes(init.type))
          state.namesCollaboratorResults = true;
        if (INLINE_INIT_TYPES.includes(init.type)) state.performsInlineComputation = true;
      }
    }

    function recordExpressionStatement(
      statement: TSESTree.ExpressionStatement,
      state: AbstractionLevelState,
    ): void {
      const expression = unwrapAwait(statement.expression);
      if (expression.type === "CallExpression" || expression.type === "NewExpression") {
        state.issuesCommands = true;
        return;
      }
      if (expression.type === "AssignmentExpression") {
        state.performsInlineComputation = true;
      }
    }

    function recordStatement(statement: TSESTree.Statement, state: AbstractionLevelState): void {
      if (statement.type === "VariableDeclaration") {
        recordVariableDeclaration(statement, state);
        return;
      }
      if (statement.type === "ExpressionStatement") {
        recordExpressionStatement(statement, state);
        return;
      }
      if (LOOP_STATEMENT_TYPES.includes(statement.type)) {
        state.performsInlineComputation = true;
      }
    }

    function analyzeFunction(node: FunctionLikeNode): void {
      if (isClassConstructor(node)) {
        return;
      }
      const body = node.body;
      if (body.type !== "BlockStatement") {
        return;
      }
      const state: AbstractionLevelState = {
        namesCollaboratorResults: false,
        issuesCommands: false,
        performsInlineComputation: false,
      };
      for (const statement of body.body) {
        recordStatement(statement, state);
      }

      const mixesInlineComputationWithOrchestration =
        state.performsInlineComputation && (state.namesCollaboratorResults || state.issuesCommands);
      if (mixesInlineComputationWithOrchestration) {
        context.report({ node, messageId: "mixedAbstractionLevels" });
      }
    }

    return {
      FunctionDeclaration: analyzeFunction,
      FunctionExpression: analyzeFunction,
      ArrowFunctionExpression: analyzeFunction,
    };
  },
};
