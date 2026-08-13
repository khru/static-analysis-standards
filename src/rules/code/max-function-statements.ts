import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import {
  DEFAULT_MAX_FUNCTION_STATEMENTS,
  STATEMENT_TYPES,
} from "../../data/control-flow-catalogs.js";
import { walkNode } from "../../shared/ast.js";

const messages = {
  tooManyStatements:
    "Function has {{count}} statements (maximum {{max}}). Extract cohesive groups into methods (Long Method).",
} as const;

type FunctionLike =
  TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression;

export const maxFunctionStatements: TSESLint.RuleModule<keyof typeof messages, [{ max?: number }]> =
  {
    meta: {
      type: "suggestion",
      docs: {
        description:
          "Reports functions whose statement count exceeds the configured maximum. Refactor suggested: extract cohesive groups into methods (Long Method).",
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
    defaultOptions: [{ max: DEFAULT_MAX_FUNCTION_STATEMENTS }],
    create(context) {
      const max = context.options[0]?.max ?? DEFAULT_MAX_FUNCTION_STATEMENTS;

      const countStatements = (body: TSESTree.BlockStatement): number => {
        let count = 0;
        walkNode(body, (node) => {
          if (node.type === "BlockStatement") {
            return true;
          }
          if (node.type === "FunctionDeclaration") {
            count += 1;
            return false;
          }
          if (node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
            return false;
          }
          if (STATEMENT_TYPES.includes(node.type)) {
            count += 1;
          }
          return true;
        });
        return count;
      };

      const check = (node: FunctionLike): void => {
        if (node.body.type !== "BlockStatement") {
          return;
        }
        const count = countStatements(node.body);
        if (count > max) {
          context.report({ node, messageId: "tooManyStatements", data: { count, max } });
        }
      };

      return {
        FunctionDeclaration: check,
        FunctionExpression: check,
        ArrowFunctionExpression: check,
      };
    },
  };
