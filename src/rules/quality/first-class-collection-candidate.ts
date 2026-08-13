import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { COLLECTION_REFERENCE_NAMES } from "../../data/collection-types.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  singleRawCollection:
    "Review candidate: this class's only instance field is a raw collection; consider a First Class Collection that owns its invariants (Calisthenics: first-class collections).",
} as const;

const collectionReferenceNames = new Set(COLLECTION_REFERENCE_NAMES);

function isCollectionType(annotation: TSESTree.TSTypeAnnotation | undefined): boolean {
  if (annotation === undefined) {
    return false;
  }
  const type = annotation.typeAnnotation;
  if (type.type === "TSArrayType" || type.type === "TSTupleType") {
    return true;
  }
  return (
    type.type === "TSTypeReference" &&
    type.typeName.type === "Identifier" &&
    collectionReferenceNames.has(type.typeName.name)
  );
}

function hasSingleRawCollectionField(
  node: TSESTree.ClassDeclaration | TSESTree.ClassExpression,
): boolean {
  const fields = node.body.body.filter(
    (member): member is TSESTree.PropertyDefinition => member.type === "PropertyDefinition",
  );
  if (fields.length !== 1) {
    return false;
  }
  return isCollectionType(fields[0]!.typeAnnotation);
}

export const firstClassCollectionCandidate: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports domain and application classes whose only instance field is a raw collection type. Review candidate: consider a First Class Collection that owns its invariants (Calisthenics: first-class collections).",
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
      if (hasSingleRawCollectionField(node)) {
        context.report({ node, messageId: "singleRawCollection" });
      }
    }

    return {
      ClassDeclaration: analyzeClass,
      ClassExpression: analyzeClass,
    };
  },
};
