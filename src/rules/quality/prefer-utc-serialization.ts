import type { TSESLint } from "@typescript-eslint/utils";

import { LOCAL_SERIALIZATION_METHODS } from "../../data/local-date-methods.js";
import { staticMemberCallName } from "../../shared/ast.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  localSerialization:
    "'.{{localName}}' serializes in the local time zone. Use '.{{replacement}}' so the serialized instant is always UTC.",
} as const;

const methodsByLocalName = new Map(
  LOCAL_SERIALIZATION_METHODS.map((entry) => [entry.localName, entry]),
);

export const preferUtcSerialization: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports local time zone date serialization. Refactor suggested: serialize with toISOString so the instant is always UTC.",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (isTestFile(context.filename)) {
      return {};
    }
    return {
      CallExpression(node) {
        const methodName = staticMemberCallName(node);
        if (methodName === undefined) {
          return;
        }
        const entry = methodsByLocalName.get(methodName);
        if (entry) {
          context.report({
            node: node.callee,
            messageId: "localSerialization",
            data: { localName: entry.localName, replacement: entry.replacement },
          });
        }
      },
    };
  },
};
