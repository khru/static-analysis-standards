import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { walkOwnScope } from "../../shared/ast.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  getterWithoutValue:
    "Method '{{name}}' is named like a getter but does not return a value. Rename it to describe an action or return the value its name promises.",
  setterWithValue:
    "Method '{{name}}' is named like a setter but returns a value. Return only for fluent chaining or rename it to describe the value-producing operation.",
} as const;

const getterName = /^(get|is|has|can|should)[A-Z]/;
const setterName = /^(set|update|add|remove)[A-Z]/;

function methodName(node: TSESTree.MethodDefinition): string | undefined {
  return node.key.type === "Identifier" && !node.computed ? node.key.name : undefined;
}

function returnsValue(node: TSESTree.FunctionExpression): boolean {
  let result = false;
  walkOwnScope(node.body, (child) => {
    if (child.type === "ReturnStatement" && child.argument !== null) result = true;
  });
  return result;
}

function hasReturn(node: TSESTree.FunctionExpression): boolean {
  let result = false;
  walkOwnScope(node.body, (child) => {
    if (child.type === "ReturnStatement") result = true;
  });
  return result;
}

export const noFallaciousMethodName: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports methods whose getter/setter naming contract disagrees with their return behavior. Refactor suggested: align the name with the observable responsibility (Fallacious Method Name).",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (isTestFile(context.filename)) return {};

    return {
      MethodDefinition(node: TSESTree.MethodDefinition) {
        const name = methodName(node);
        if (name === undefined || node.value.type !== "FunctionExpression") return;

        if (getterName.test(name) && !hasReturn(node.value)) {
          context.report({ node: node.key, messageId: "getterWithoutValue", data: { name } });
          return;
        }

        if (setterName.test(name) && returnsValue(node.value)) {
          const onlyFluentReturn = (() => {
            let valueReturn = false;
            walkOwnScope(node.value.body, (child) => {
              if (
                child.type === "ReturnStatement" &&
                child.argument !== null &&
                !(child.argument.type === "ThisExpression")
              ) {
                valueReturn = true;
              }
            });
            return !valueReturn;
          })();
          if (!onlyFluentReturn) {
            context.report({ node: node.key, messageId: "setterWithValue", data: { name } });
          }
        }
      },
    };
  },
};
