import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { CONCRETE_LOW_LEVEL_SEGMENTS } from "../../data/low-level-import-segments.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  concreteLowLevelDependency:
    "Review candidate: domain/application code imports the concrete low-level module '{{source}}'; evaluate depending on the owning port instead (Dependency Inversion evidence).",
} as const;

const concreteLowLevelSegments = new Set(CONCRETE_LOW_LEVEL_SEGMENTS);

function isConcreteLowLevelImport(source: string): boolean {
  const segments = source.split(/[\\/]/);
  return segments.some((segment) => concreteLowLevelSegments.has(segment));
}

export const noConcreteLowLevelDependency: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports domain and application imports of concrete low-level implementation modules (persistence, adapters, clients, gateways, mappers, data sources). Review candidate: evaluate depending on the owning port instead (Dependency Inversion evidence).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }

    function reportSource(source: string, node: TSESTree.Node): void {
      if (isConcreteLowLevelImport(source)) {
        context.report({ node, messageId: "concreteLowLevelDependency", data: { source } });
      }
    }

    return {
      ImportDeclaration: (node) => {
        reportSource(node.source.value, node);
      },
      ImportExpression: (node) => {
        if (node.source.type === "Literal" && typeof node.source.value === "string") {
          reportSource(node.source.value, node);
        }
      },
    };
  },
};
