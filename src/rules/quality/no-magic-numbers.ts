import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { CONTEXTUAL_EXCEPTIONS } from "../../data/magic-value-exceptions.js";
import { isPureLiteralExpression } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  magicNumber:
    "Number {{value}} is used inline in logic. Extract it into a named constant that explains why this value matters.",
} as const;

type Options = [{ allowlist?: number[] }];

const contextualExceptions = new Set(CONTEXTUAL_EXCEPTIONS);

function nearestVariableDeclarator(node: TSESTree.Node): TSESTree.VariableDeclarator | undefined {
  let current: TSESTree.Node | undefined = node.parent;
  while (current !== undefined && current.type !== "VariableDeclarator")
    current = current.parent ?? undefined;
  return current?.type === "VariableDeclarator" ? current : undefined;
}

function isNamedConstantExtraction(node: TSESTree.Literal): boolean {
  const declarator = nearestVariableDeclarator(node);
  if (!declarator || declarator.id.type !== "Identifier" || !declarator.init) {
    return false;
  }
  if (declarator.parent?.kind !== "const") {
    return false;
  }
  return isPureLiteralExpression(declarator.init);
}

function isInsideClassField(node: TSESTree.Literal): boolean {
  let current: TSESTree.Node | undefined = node.parent;
  while (current !== undefined && current.type !== "PropertyDefinition")
    current = current.parent ?? undefined;
  return current !== undefined;
}

function isTypeOrDefinitionPosition(node: TSESTree.Literal): boolean {
  return node.parent?.type === "TSLiteralType" || node.parent?.type === "TSEnumMember";
}

export const noMagicNumbers: TSESLint.RuleModule<keyof typeof messages, Options> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports inline numeric literals in domain and application logic outside documented contextual exceptions. Refactor suggested: extract the value into a named constant (Magic Number).",
    },
    messages,
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          allowlist: { type: "array", items: { type: "number" } },
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
        if (typeof node.value !== "number") {
          return;
        }
        if (contextualExceptions.has(node.value) || allowlist.has(node.value)) {
          return;
        }
        if (isTypeOrDefinitionPosition(node) || isInsideClassField(node)) {
          return;
        }
        if (isNamedConstantExtraction(node)) {
          return;
        }
        context.report({ node, messageId: "magicNumber", data: { value: String(node.value) } });
      },
    };
  },
};
