import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { MINIMUM_TEMPORARY_FIELD_CLASS_METHODS } from "../../data/rule-thresholds.js";
import { smellEntry } from "../../data/smell-catalog.js";
import { walkOwnScope } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("temporary-field");

const messages = {
  temporaryField:
    "Review candidate: field '{{name}}' is only read by one method of the class; evaluate whether it is a temporary field (tdd-refactor: Temporary Field).",
} as const;

function fieldName(node: TSESTree.PropertyDefinition): string | undefined {
  return node.key.type === "Identifier" ? node.key.name : undefined;
}

function methodReferencesField(
  method: TSESTree.FunctionExpression | TSESTree.TSEmptyBodyFunctionExpression,
  name: string,
): boolean {
  const body = method.body;
  if (body === null) {
    return false;
  }
  let referenced = false;
  walkOwnScope(body, (inner) => {
    if (referenced) {
      return;
    }
    if (
      inner.type === "MemberExpression" &&
      !inner.computed &&
      inner.object.type === "ThisExpression" &&
      inner.property.type === "Identifier" &&
      inner.property.name === name
    ) {
      referenced = true;
    }
  });
  return referenced;
}

export const temporaryField: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports an instance field read by a single method while the class exposes at least ${MINIMUM_TEMPORARY_FIELD_CLASS_METHODS} methods. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }
    return {
      ClassDeclaration: analyzeClass,
      ClassExpression: analyzeClass,
    };

    function analyzeClass(node: TSESTree.ClassDeclaration | TSESTree.ClassExpression): void {
      const fields = node.body.body.filter(
        (member): member is TSESTree.PropertyDefinition =>
          member.type === "PropertyDefinition" && !member.static,
      );
      const methods = node.body.body.filter(
        (member): member is TSESTree.MethodDefinition =>
          member.type === "MethodDefinition" && !member.static && member.kind === "method",
      );
      if (fields.length === 0 || methods.length < MINIMUM_TEMPORARY_FIELD_CLASS_METHODS) {
        return;
      }
      for (const field of fields) {
        const name = fieldName(field);
        if (name === undefined) continue;
        const referencingMethods = methods.filter((method) =>
          methodReferencesField(method.value, name),
        ).length;
        if (referencingMethods !== 1) continue;
        context.report({ node: field, messageId: "temporaryField", data: { name } });
      }
    }
  },
};
