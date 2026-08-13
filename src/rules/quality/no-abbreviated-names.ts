import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { ABBREVIATIONS } from "../../data/abbreviations.js";
import { isTestFile } from "../../shared/file-scope.js";
import { nameSegments } from "../../shared/naming.js";

const messages = {
  abbreviatedName:
    "Name '{{name}}' abbreviates '{{segment}}'. Spell it out as '{{expansion}}' so the name reveals its intent.",
} as const;

function findAbbreviatedSegment(name: string): { segment: string; expansion: string } | undefined {
  for (const segment of nameSegments(name)) {
    const expansion = ABBREVIATIONS.get(segment);
    if (expansion !== undefined) return { segment, expansion };
  }
  return undefined;
}

export const noAbbreviatedNames: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports identifiers built from known abbreviations. Refactor suggested: spell the word out (Uncommunicative Name / Obscured Intent).",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (isTestFile(context.filename)) {
      return {};
    }

    const reportAbbreviation = (node: TSESTree.Node, name: string): void => {
      const match = findAbbreviatedSegment(name);
      if (match) {
        context.report({
          node,
          messageId: "abbreviatedName",
          data: { name, segment: match.segment, expansion: match.expansion },
        });
      }
    };

    const reportParameterNames = (node: { params: readonly TSESTree.Parameter[] }): void => {
      for (const param of node.params) {
        if (param.type !== "Identifier") continue;
        reportAbbreviation(param, param.name);
      }
    };

    return {
      VariableDeclarator(node) {
        if (node.id.type === "Identifier") {
          reportAbbreviation(node.id, node.id.name);
        }
      },
      FunctionDeclaration(node) {
        if (node.id) {
          reportAbbreviation(node.id, node.id.name);
        }
        reportParameterNames(node);
      },
      FunctionExpression(node) {
        if (node.id) {
          reportAbbreviation(node.id, node.id.name);
        }
        reportParameterNames(node);
      },
      ArrowFunctionExpression(node) {
        reportParameterNames(node);
      },
      ClassDeclaration(node) {
        if (node.id) {
          reportAbbreviation(node.id, node.id.name);
        }
      },
      ClassExpression(node) {
        if (node.id) {
          reportAbbreviation(node.id, node.id.name);
        }
      },
      TSInterfaceDeclaration(node) {
        reportAbbreviation(node.id, node.id.name);
      },
      TSTypeAliasDeclaration(node) {
        reportAbbreviation(node.id, node.id.name);
      },
      TSEnumDeclaration(node) {
        reportAbbreviation(node.id, node.id.name);
      },
      MethodDefinition(node) {
        if (node.key.type === "Identifier" && !node.computed) {
          reportAbbreviation(node.key, node.key.name);
        }
      },
      PropertyDefinition(node) {
        if (node.key.type === "Identifier" && !node.computed) {
          reportAbbreviation(node.key, node.key.name);
        }
      },
    };
  },
};
