import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { SINGLE_CHARACTER_ALLOWLIST, VAGUE_NAMES } from "../../data/naming-catalogs.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  uncommunicativeName:
    "Name '{{name}}' does not reveal its purpose. Rename it to describe what it holds or does.",
} as const;

const singleCharacterAllowlist = new Set(SINGLE_CHARACTER_ALLOWLIST);

const vagueNames = new Set(VAGUE_NAMES);

function isUncommunicative(name: string): boolean {
  if (name.length === 1) {
    return !singleCharacterAllowlist.has(name);
  }
  return vagueNames.has(name.toLowerCase());
}

export const noUncommunicativeNames: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports uncommunicative names in production code. Refactor suggested: rename with an intention-revealing name (Uncommunicative Name).",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (isTestFile(context.filename)) {
      return {};
    }

    const reportUncommunicative = (node: TSESTree.Node, name: string): void => {
      if (isUncommunicative(name)) {
        context.report({ node, messageId: "uncommunicativeName", data: { name } });
      }
    };

    const reportImportAlias = (node: TSESTree.Node, name: string): void => {
      if (name.length === 1 && !singleCharacterAllowlist.has(name)) {
        context.report({ node, messageId: "uncommunicativeName", data: { name } });
      }
    };

    const reportParameterNames = (node: { params: readonly TSESTree.Parameter[] }): void => {
      for (const param of node.params) {
        if (param.type !== "Identifier") continue;
        reportUncommunicative(param, param.name);
      }
    };

    return {
      VariableDeclarator(node) {
        if (node.id.type === "Identifier") {
          reportUncommunicative(node.id, node.id.name);
        }
      },
      FunctionDeclaration(node) {
        reportUncommunicative(node, node.id!.name);
        reportParameterNames(node);
      },
      FunctionExpression(node) {
        if (node.id) {
          reportUncommunicative(node.id, node.id.name);
        }
        reportParameterNames(node);
      },
      ArrowFunctionExpression(node) {
        reportParameterNames(node);
      },
      ClassDeclaration(node) {
        reportUncommunicative(node, node.id!.name);
      },
      ClassExpression(node) {
        if (node.id) {
          reportUncommunicative(node.id, node.id.name);
        }
      },
      TSInterfaceDeclaration(node) {
        reportUncommunicative(node, node.id.name);
      },
      TSTypeAliasDeclaration(node) {
        reportUncommunicative(node, node.id.name);
      },
      TSEnumDeclaration(node) {
        reportUncommunicative(node, node.id.name);
      },
      MethodDefinition(node) {
        if (node.key.type === "Identifier" && !node.computed) {
          reportUncommunicative(node.key, node.key.name);
        }
      },
      PropertyDefinition(node) {
        if (node.key.type === "Identifier" && !node.computed) {
          reportUncommunicative(node.key, node.key.name);
        }
      },
      ImportSpecifier(node) {
        if (node.imported.type === "Identifier" && node.imported.name === node.local.name) {
          return;
        }
        reportImportAlias(node.local, node.local.name);
      },
      ImportDefaultSpecifier(node) {
        reportImportAlias(node.local, node.local.name);
      },
      ImportNamespaceSpecifier(node) {
        reportImportAlias(node.local, node.local.name);
      },
    };
  },
};
