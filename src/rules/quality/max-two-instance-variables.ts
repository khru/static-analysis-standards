import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  tooMany:
    "Review candidate: this class holds {{count}} instance variables. Object Calisthenics keeps state small so each object has a focused responsibility; group cohesive state into a value object or split the class.",
} as const;

function instanceVariableCount(node: TSESTree.ClassDeclaration | TSESTree.ClassExpression): number {
  return node.body.body.filter(
    (member): member is TSESTree.PropertyDefinition =>
      member.type === "PropertyDefinition" && !member.static,
  ).length;
}

export const maxTwoInstanceVariables: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports domain and application classes with more than two instance variables. Review candidate: apply the Object Calisthenics state-size constraint when it improves cohesion.",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (!isDomainOrApplicationFile(context.filename) || isTestFile(context.filename)) return {};

    function analyzeClass(node: TSESTree.ClassDeclaration | TSESTree.ClassExpression): void {
      const count = instanceVariableCount(node);
      if (count > 2) context.report({ node, messageId: "tooMany", data: { count } });
    }

    return { ClassDeclaration: analyzeClass, ClassExpression: analyzeClass };
  },
};
