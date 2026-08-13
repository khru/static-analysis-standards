import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { FEATURE_ENVY_MIN_FOREIGN_REFERENCES } from "../../data/rule-thresholds.js";
import { walkOwnScope } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  featureEnvyCandidate:
    "Review candidate: this method reads more members of its collaborators than of its own state; evaluate moving the logic onto the object that owns the data (Feature Envy evidence).",
} as const;

function parameterNames(method: TSESTree.MethodDefinition): Set<string> {
  const identifiers = method.value.params.filter(
    (parameter): parameter is TSESTree.Identifier => parameter.type === "Identifier",
  );
  return new Set(identifiers.map((parameter) => parameter.name));
}

function ownVersusForeignAccesses(
  body: TSESTree.BlockStatement,
  parameters: ReadonlySet<string>,
): { own: Set<string>; foreign: Set<string> } {
  const own = new Set<string>();
  const foreign = new Set<string>();
  walkOwnScope(body, (node) => {
    if (node.type !== "MemberExpression" || node.computed || node.property.type !== "Identifier") {
      return;
    }
    if (node.object.type === "ThisExpression") {
      own.add(node.property.name);
      return;
    }
    if (node.object.type === "Identifier" && parameters.has(node.object.name)) {
      foreign.add(`${node.object.name}.${node.property.name}`);
    }
  });
  return { own, foreign };
}

export const featureEnvyCandidate: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports domain and application methods that read more members of their collaborators than of their own state. Review candidate: evaluate moving the logic onto the object that owns the data (Feature Envy evidence).",
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
      MethodDefinition: (node) => {
        if (node.key.type !== "Identifier") {
          return;
        }
        const body = node.value.body;
        if (body === null) {
          return;
        }
        const parameters = parameterNames(node);
        const { own, foreign } = ownVersusForeignAccesses(body, parameters);
        if (foreign.size >= FEATURE_ENVY_MIN_FOREIGN_REFERENCES && own.size === 0) {
          context.report({ node, messageId: "featureEnvyCandidate" });
        }
      },
    };
  },
};
