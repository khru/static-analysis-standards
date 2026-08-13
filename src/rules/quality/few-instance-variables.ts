import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { FEW_INSTANCE_VARIABLES_MAX } from "../../data/rule-thresholds.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  manyInstanceVariables:
    "Review candidate: this class holds {{count}} instance variables; evaluate grouping related state into value objects (Calisthenics: few instance variables).",
} as const;

function instanceVariableCount(node: TSESTree.ClassDeclaration | TSESTree.ClassExpression): number {
  return node.body.body.filter(
    (member): member is TSESTree.PropertyDefinition =>
      member.type === "PropertyDefinition" && !member.static,
  ).length;
}

export const fewInstanceVariables: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports domain and application classes that hold more than five instance variables. Review candidate: evaluate grouping related state into value objects (Calisthenics: few instance variables).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }

    function analyzeClass(node: TSESTree.ClassDeclaration | TSESTree.ClassExpression): void {
      const count = instanceVariableCount(node);
      if (count > FEW_INSTANCE_VARIABLES_MAX) {
        context.report({ node, messageId: "manyInstanceVariables", data: { count } });
      }
    }

    return {
      ClassDeclaration: analyzeClass,
      ClassExpression: analyzeClass,
    };
  },
};
