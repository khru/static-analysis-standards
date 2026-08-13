import type { TSESLint } from "@typescript-eslint/utils";

import { LOCAL_DATE_GETTERS } from "../../data/local-date-methods.js";
import { staticMemberCallName } from "../../shared/ast.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  localDateGetter:
    "Review candidate: '.{{localName}}' reads the local time zone. Prefer '.{{utcName}}' so the instant is explicit.",
} as const;

const gettersByLocalName = new Map(LOCAL_DATE_GETTERS.map((entry) => [entry.localName, entry]));

export const preferUtcDateGetters: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports local time zone Date getters. Review candidate: use the UTC equivalents so instants are explicit.",
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
        const entry = gettersByLocalName.get(methodName);
        if (entry) {
          context.report({
            node: node.callee,
            messageId: "localDateGetter",
            data: { localName: entry.localName, utcName: entry.utcName },
          });
        }
      },
    };
  },
};
