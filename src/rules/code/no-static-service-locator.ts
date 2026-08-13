import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import {
  LOCATOR_METHOD_NAMES,
  MUTABLE_INITIALIZER_TYPES,
} from "../../data/service-locator-catalogs.js";
import { walkNode } from "../../shared/ast.js";

const messages = {
  staticMutableState:
    "Static mutable state acts as a service locator (Global Data). Inject dependencies instead.",
  staticSelfReturning:
    "Static method returns a new instance of its own class (service locator). Use an injected factory or an instance method (Inappropriate Static).",
} as const;

const locatorMethods = new Set(LOCATOR_METHOD_NAMES);

export const noStaticServiceLocator: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports static mutable state and static self-returning methods that act as service locators. Refactor suggested: inject dependencies (Global Data / Inappropriate Static).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const classStack: (string | null)[] = [];

    const hasSelfConstruction = (
      method: TSESTree.FunctionExpression,
      className: string,
    ): boolean => {
      let found = false;
      walkNode(method.body, (node) => {
        const returnedConstructor =
          node.type === "ReturnStatement" && node.argument?.type === "NewExpression"
            ? node.argument.callee
            : undefined;
        if (returnedConstructor?.type === "Identifier" && returnedConstructor.name === className) {
          found = true;
          return false;
        }
        if (node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
          return false;
        }
        return true;
      });
      return found;
    };

    return {
      ClassDeclaration(node) {
        classStack.push(node.id?.name ?? null);
      },
      "ClassDeclaration:exit": () => {
        classStack.pop();
      },
      ClassExpression(node) {
        classStack.push(node.id?.name ?? null);
      },
      "ClassExpression:exit": () => {
        classStack.pop();
      },
      PropertyDefinition(node) {
        if (node.static && !node.readonly && node.value === null) {
          context.report({ node, messageId: "staticMutableState" });
          return;
        }
        if (
          node.static &&
          !node.readonly &&
          node.value !== null &&
          MUTABLE_INITIALIZER_TYPES.includes(node.value.type)
        ) {
          context.report({ node, messageId: "staticMutableState" });
        }
      },
      MethodDefinition(node) {
        if (!node.static || node.value.type !== "FunctionExpression") {
          return;
        }
        const className = classStack[classStack.length - 1];
        const methodName = node.key.type === "Identifier" ? node.key.name : "";
        if (
          className &&
          locatorMethods.has(methodName) &&
          hasSelfConstruction(node.value, className)
        ) {
          context.report({ node, messageId: "staticSelfReturning" });
        }
      },
    };
  },
};
