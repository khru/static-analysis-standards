import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import {
  MINIMUM_DISCONNECTED_PROPERTY_SETS,
  MINIMUM_DISCONNECTED_TOUCHED_PROPERTIES,
} from "../../data/rule-thresholds.js";
import { walkOwnScope } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  disconnectedMethodClusters:
    "Review candidate: the methods of this class reference pairwise-disjoint instance-state clusters; evaluate whether the class hides more than one responsibility (Single Responsibility evidence).",
} as const;

function instanceStateTouched(method: TSESTree.MethodDefinition): Set<string> {
  const properties = new Set<string>();
  const body = method.value.body;
  if (body === null) {
    return properties;
  }
  walkOwnScope(body, (node) => {
    if (
      node.type === "MemberExpression" &&
      node.object.type === "ThisExpression" &&
      !node.computed &&
      node.property.type === "Identifier"
    ) {
      properties.add(node.property.name);
    }
  });
  return properties;
}

function sharesProperty(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
  return [...left].some((property) => right.has(property));
}

function areAllPairwiseDisjoint(propertySets: readonly Set<string>[]): boolean {
  return propertySets.every((current, index) =>
    propertySets.slice(index + 1).every((other) => !sharesProperty(current, other)),
  );
}

function hasDisconnectedMethodClusters(
  node: TSESTree.ClassDeclaration | TSESTree.ClassExpression,
): boolean {
  const propertySets = node.body.body
    .filter(
      (member): member is TSESTree.MethodDefinition =>
        member.type === "MethodDefinition" && member.key.type === "Identifier",
    )
    .map(instanceStateTouched)
    .filter((properties) => properties.size > 0);
  const touchedProperties = new Set(propertySets.flatMap((properties) => [...properties]));
  return (
    propertySets.length >= MINIMUM_DISCONNECTED_PROPERTY_SETS &&
    touchedProperties.size >= MINIMUM_DISCONNECTED_TOUCHED_PROPERTIES &&
    areAllPairwiseDisjoint(propertySets)
  );
}

export const disconnectedMethodClusters: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports domain and application classes whose methods reference pairwise-disjoint instance-state clusters. Review candidate: evaluate whether the class hides more than one responsibility (Single Responsibility evidence).",
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
      if (hasDisconnectedMethodClusters(node)) {
        context.report({ node, messageId: "disconnectedMethodClusters" });
      }
    }

    return {
      ClassDeclaration: analyzeClass,
      ClassExpression: analyzeClass,
    };
  },
};
