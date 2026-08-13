import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { SMALL_CLASS_MAX_METHODS } from "../../data/rule-thresholds.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  largeClass:
    "Review candidate: this class exposes {{count}} methods; evaluate responsibility cohesion and consider splitting it (Calisthenics: keep classes small).",
} as const;

function methodCount(node: TSESTree.ClassDeclaration | TSESTree.ClassExpression): number {
  return node.body.body.filter(
    (member): member is TSESTree.MethodDefinition =>
      member.type === "MethodDefinition" && member.kind !== "constructor",
  ).length;
}

export const smallClassCandidate: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports domain and application classes that expose eight or more non-constructor methods. Review candidate: evaluate responsibility cohesion (Calisthenics: keep classes small).",
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
      const count = methodCount(node);
      if (count >= SMALL_CLASS_MAX_METHODS) {
        context.report({ node, messageId: "largeClass", data: { count } });
      }
    }

    return {
      ClassDeclaration: analyzeClass,
      ClassExpression: analyzeClass,
    };
  },
};
