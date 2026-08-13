import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { GENERIC_METHOD_VERBS, GENERIC_NOUNS } from "../../data/naming-catalogs.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";
import { nameSegments } from "../../shared/naming.js";

const messages = {
  genericTypeName:
    "Generic name '{{name}}' hides the domain role. Name it for the domain concept it represents (ubiquitous language).",
  genericMethodName:
    "Generic name '{{name}}' hides the business operation. Name it with an explicit business verb.",
} as const;

const genericNouns = new Set(GENERIC_NOUNS);

const genericMethodVerbs = new Set(GENERIC_METHOD_VERBS);

function hasGenericNoun(name: string): boolean {
  return nameSegments(name).some((segment) => genericNouns.has(segment));
}

export const noGenericNamesInDomain: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports generic placeholder names in domain and application code. Refactor suggested: rename with the ubiquitous language (Uncommunicative Name / Obscured Intent).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }

    const reportTypeName = (node: TSESTree.Node, name: string | undefined): void => {
      if (name === undefined) {
        return;
      }
      if (hasGenericNoun(name)) {
        context.report({ node, messageId: "genericTypeName", data: { name } });
      }
    };

    const reportMethodName = (node: TSESTree.Node, name: string): void => {
      const lowerName = name.toLowerCase();
      if (genericMethodVerbs.has(lowerName) || genericNouns.has(lowerName)) {
        context.report({ node, messageId: "genericMethodName", data: { name } });
      }
    };

    const reportParameterNames = (node: { params: readonly TSESTree.Parameter[] }): void => {
      for (const param of node.params) {
        if (param.type !== "Identifier") continue;
        reportTypeName(param, param.name);
      }
    };

    return {
      ClassDeclaration(node) {
        reportTypeName(node, node.id?.name);
      },
      ClassExpression(node) {
        reportTypeName(node, node.id?.name);
      },
      TSInterfaceDeclaration(node) {
        reportTypeName(node, node.id.name);
      },
      TSTypeAliasDeclaration(node) {
        reportTypeName(node, node.id.name);
      },
      TSEnumDeclaration(node) {
        reportTypeName(node, node.id.name);
      },
      FunctionDeclaration(node) {
        reportTypeName(node, node.id?.name);
        reportParameterNames(node);
      },
      FunctionExpression(node) {
        reportTypeName(node, node.id?.name);
        reportParameterNames(node);
      },
      ArrowFunctionExpression(node) {
        reportParameterNames(node);
      },
      VariableDeclarator(node) {
        if (node.id.type === "Identifier") {
          reportTypeName(node.id, node.id.name);
        }
      },
      MethodDefinition(node) {
        if (node.key.type === "Identifier" && !node.computed) {
          reportMethodName(node, node.key.name);
        }
      },
    };
  },
};
