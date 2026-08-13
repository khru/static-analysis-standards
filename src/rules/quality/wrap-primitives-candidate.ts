import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { PRIMITIVE_TYPE_KEYWORDS } from "../../data/primitive-type-keywords.js";
import { VALUE_PACKAGES } from "../../data/value-packages.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  primitiveProperty:
    "Review candidate: '{{name}}' is typed as a raw primitive; consider a typed value object built with an approved validation catalog ({{catalog}}).",
} as const;

const primitiveTypeKeywords = new Set(PRIMITIVE_TYPE_KEYWORDS);

function isPrimitiveTyped(annotation: TSESTree.TSTypeAnnotation | undefined): boolean {
  return annotation !== undefined && primitiveTypeKeywords.has(annotation.typeAnnotation.type);
}

export const wrapPrimitivesCandidate: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports class properties and interface members typed as raw primitives in domain and application code. Review candidate: consider a typed value object (Calisthenics: wrap primitives).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }
    const catalog = VALUE_PACKAGES.join(", ");

    function report(node: TSESTree.PropertyDefinition | TSESTree.TSPropertySignature): void {
      if (isPrimitiveTyped(node.typeAnnotation)) {
        const name = node.key.type === "Identifier" ? node.key.name : node.key.type;
        context.report({ node, messageId: "primitiveProperty", data: { name, catalog } });
      }
    }

    return {
      PropertyDefinition: report,
      TSPropertySignature: report,
    };
  },
};
