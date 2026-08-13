import type { TSESLint } from "@typescript-eslint/utils";

import { LOCALE_FORMATTING_METHODS } from "../../data/local-date-methods.js";
import { staticMemberCallName } from "../../shared/ast.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  localeFormatting:
    "Review candidate: '.{{localName}}' formats with a hidden local time zone. Promote Intl.DateTimeFormat with an explicit timeZone such as 'UTC'.",
} as const;

const localeFormattingMethods = new Set(LOCALE_FORMATTING_METHODS);

export const preferIntlDateFormatting: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports raw locale date formatting with a hidden local time zone. Promotion review candidate: use Intl.DateTimeFormat with an explicit timeZone.",
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
        if (methodName !== undefined && localeFormattingMethods.has(methodName)) {
          context.report({
            node: node.callee,
            messageId: "localeFormatting",
            data: { localName: methodName },
          });
        }
      },
    };
  },
};
