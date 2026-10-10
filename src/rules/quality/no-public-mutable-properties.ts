import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  exposed:
    "Review candidate: public mutable property '{{name}}' exposes object state. Prefer a readonly/value-object boundary or an intention-revealing operation that preserves the invariant.",
} as const;

export const noPublicMutableProperties: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports public mutable instance properties in domain and application classes. Review candidate: encapsulate state behind an invariant-preserving operation (Indecent Exposure).",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (!isDomainOrApplicationFile(context.filename) || isTestFile(context.filename)) return {};

    return {
      PropertyDefinition(node: TSESTree.PropertyDefinition) {
        if (
          node.static ||
          node.readonly ||
          node.accessibility === "private" ||
          node.accessibility === "protected" ||
          node.key.type !== "Identifier"
        ) {
          return;
        }
        context.report({ node: node.key, messageId: "exposed", data: { name: node.key.name } });
      },
    };
  },
};
