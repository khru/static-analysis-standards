import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  magicString:
    "String literal {{value}} is used inline in logic. Extract it into a named constant, catalog or typed discriminant so the meaning is explicit.",
} as const;

type Options = [{ allowlist?: string[] }];

function isNamedConstantExtraction(node: TSESTree.Literal): boolean {
  const declarator = node.parent;
  if (declarator?.type !== "VariableDeclarator" || declarator.init !== node) {
    return false;
  }
  if (declarator.id.type !== "Identifier") {
    return false;
  }
  return declarator.parent?.type === "VariableDeclaration" && declarator.parent.kind === "const";
}

function isDataPosition(node: TSESTree.Literal): boolean {
  const parent = node.parent;
  return (
    parent?.type === "Property" ||
    parent?.type === "ArrayExpression" ||
    parent?.type === "PropertyDefinition"
  );
}

function isTypeOrDefinitionPosition(node: TSESTree.Literal): boolean {
  return (
    node.parent?.type === "TSLiteralType" ||
    node.parent?.type === "TSEnumMember" ||
    node.parent?.type === "ImportDeclaration" ||
    node.parent?.type === "ExportNamedDeclaration" ||
    node.parent?.type === "ExportAllDeclaration" ||
    node.parent?.type === "ImportExpression"
  );
}

function isInsideClassField(node: TSESTree.Literal): boolean {
  let current: TSESTree.Node | undefined = node.parent;
  while (current !== undefined && current.type !== "PropertyDefinition") {
    current = current.parent ?? undefined;
  }
  return current !== undefined;
}

function isErrorSubclass(node: TSESTree.Node): boolean {
  return (
    (node.type === "ClassDeclaration" || node.type === "ClassExpression") &&
    node.superClass?.type === "Identifier" &&
    node.superClass.name === "Error"
  );
}

function isErrorNameAssignment(node: TSESTree.Literal): boolean {
  const parent = node.parent;
  if (
    parent?.type !== "AssignmentExpression" ||
    parent.right !== node ||
    parent.left.type !== "MemberExpression" ||
    parent.left.property.type !== "Identifier" ||
    parent.left.property.name !== "name"
  ) {
    return false;
  }
  let current: TSESTree.Node | undefined = parent.parent;
  while (current !== undefined && !isErrorSubclass(current)) {
    current = current.parent ?? undefined;
  }
  return current !== undefined;
}

function isSymbolDescription(node: TSESTree.Literal): boolean {
  const parent = node.parent;
  return (
    parent?.type === "CallExpression" &&
    parent.callee.type === "Identifier" &&
    parent.callee.name === "Symbol"
  );
}

export const noMagicStrings: TSESLint.RuleModule<keyof typeof messages, Options> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports inline string literals used by domain and application logic outside data and named positions. Refactor suggested: extract the value into a named constant, catalog or typed discriminant (Magic String).",
    },
    messages,
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          allowlist: { type: "array", items: { type: "string" } },
        },
      },
    ],
  },
  defaultOptions: [{ allowlist: [] }],
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }
    const allowlist = new Set(context.options[0]?.allowlist ?? []);

    return {
      Literal(node) {
        if (typeof node.value !== "string") {
          return;
        }
        if (node.value === "" || allowlist.has(node.value)) {
          return;
        }
        if (isTypeOrDefinitionPosition(node) || isDataPosition(node) || isInsideClassField(node)) {
          return;
        }
        if (
          isNamedConstantExtraction(node) ||
          isSymbolDescription(node) ||
          isErrorNameAssignment(node)
        ) {
          return;
        }
        context.report({ node, messageId: "magicString", data: { value: `"${node.value}"` } });
      },
    };
  },
};
