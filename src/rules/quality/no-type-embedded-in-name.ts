import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  typeEmbedded:
    "Name '{{name}}' embeds the primitive type '{{type}}'. The type annotation already carries that information; rename it to express the domain concept instead.",
} as const;

type EmbeddedType = "string" | "number" | "boolean" | "array" | "map" | "set";

const suffixes: readonly { suffix: string; type: EmbeddedType }[] = [
  { suffix: "String", type: "string" },
  { suffix: "Number", type: "number" },
  { suffix: "Boolean", type: "boolean" },
  { suffix: "Array", type: "array" },
  { suffix: "List", type: "array" },
  { suffix: "Map", type: "map" },
  { suffix: "Set", type: "set" },
];

function annotatedType(node: TSESTree.TSTypeAnnotation): EmbeddedType | undefined {
  const annotation = node.typeAnnotation;
  if (annotation.type === "TSStringKeyword") return "string";
  if (annotation.type === "TSNumberKeyword") return "number";
  if (annotation.type === "TSBooleanKeyword") return "boolean";
  if (annotation.type === "TSArrayType") return "array";
  if (annotation.type === "TSTypeReference" && annotation.typeName.type === "Identifier") {
    if (annotation.typeName.name === "Map") return "map";
    if (annotation.typeName.name === "Set") return "set";
    if (annotation.typeName.name === "Array" || annotation.typeName.name === "ReadonlyArray") {
      return "array";
    }
  }
  return undefined;
}

function embeddedType(name: string, type: EmbeddedType): string | undefined {
  const suffix = suffixes.find(
    (candidate) => candidate.type === type && name.endsWith(candidate.suffix),
  );
  return suffix?.suffix;
}

export const noTypeEmbeddedInName: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports primitive and collection type words repeated in annotated names. Refactor suggested: name the domain concept rather than its representation (Type Embedded in Name / Obscured Intent).",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (isTestFile(context.filename)) return {};

    const reportIfEmbedded = (node: TSESTree.Identifier, annotation: TSESTree.TSTypeAnnotation) => {
      const type = annotatedType(annotation);
      if (type === undefined || embeddedType(node.name, type) === undefined) return;
      context.report({ node, messageId: "typeEmbedded", data: { name: node.name, type } });
    };

    return {
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (node.id.type === "Identifier" && node.id.typeAnnotation) {
          reportIfEmbedded(node.id, node.id.typeAnnotation);
        }
      },
      FunctionDeclaration(node: TSESTree.FunctionDeclaration) {
        for (const parameter of node.params) {
          if (parameter.type === "Identifier" && parameter.typeAnnotation) {
            reportIfEmbedded(parameter, parameter.typeAnnotation);
          }
        }
      },
      FunctionExpression(node: TSESTree.FunctionExpression) {
        for (const parameter of node.params) {
          if (parameter.type === "Identifier" && parameter.typeAnnotation) {
            reportIfEmbedded(parameter, parameter.typeAnnotation);
          }
        }
      },
      ArrowFunctionExpression(node: TSESTree.ArrowFunctionExpression) {
        for (const parameter of node.params) {
          if (parameter.type === "Identifier" && parameter.typeAnnotation) {
            reportIfEmbedded(parameter, parameter.typeAnnotation);
          }
        }
      },
      PropertyDefinition(node: TSESTree.PropertyDefinition) {
        if (node.key.type === "Identifier" && node.typeAnnotation) {
          reportIfEmbedded(node.key, node.typeAnnotation);
        }
      },
    };
  },
};
