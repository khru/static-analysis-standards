import type { TSESLint } from "@typescript-eslint/utils";

import { LOCAL_DATE_SETTERS } from "../../data/local-date-methods.js";
import { staticMemberCallName } from "../../shared/ast.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  localDateSetter:
    "'.{{localName}}' writes the local time zone. Use '.{{utcName}}' so the write is explicit.",
} as const;

const settersByLocalName = new Map(LOCAL_DATE_SETTERS.map((entry) => [entry.localName, entry]));

export const preferUtcDateSetters: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports local time zone Date setters. Refactor suggested: use the UTC equivalents so writes are explicit.",
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
        const entry = settersByLocalName.get(methodName);
        if (entry) {
          context.report({
            node: node.callee,
            messageId: "localDateSetter",
            data: { localName: entry.localName, utcName: entry.utcName },
          });
        }
      },
    };
  },
};
