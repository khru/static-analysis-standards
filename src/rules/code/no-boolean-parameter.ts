import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

const messages = {
  booleanParameter:
    "Boolean parameter '{{name}}' is a flag (Boolean Blindness). Replace it with an explicit type or split the method.",
} as const;

type FunctionLike =
  TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression;

type Parameter = FunctionLike["params"][number];

export const noBooleanParameter: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports boolean parameters that act as flags. Refactor suggested: remove the flag argument or split the method (Boolean Blindness).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const unwrapParam = (param: Parameter): TSESTree.Node => {
      if (param.type === "AssignmentPattern") {
        return param.left;
      }
      if (param.type === "TSParameterProperty") {
        return param.parameter;
      }
      return param;
    };

    const findBooleanFlag = (param: Parameter): TSESTree.Identifier | null => {
      const target = unwrapParam(param);
      if (target.type !== "Identifier") {
        return null;
      }
      if (target.typeAnnotation?.typeAnnotation.type !== "TSBooleanKeyword") {
        return null;
      }
      return target;
    };

    const check = (node: FunctionLike): void => {
      for (const param of node.params) {
        const flag = findBooleanFlag(param);
        if (flag === null) continue;
        context.report({
          node: flag,
          messageId: "booleanParameter",
          data: { name: flag.name },
        });
      }
    };

    return {
      FunctionDeclaration: check,
      FunctionExpression: check,
      ArrowFunctionExpression: check,
    };
  },
};
