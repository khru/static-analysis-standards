import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { DEPRECATED_GLOBAL_FUNCTIONS, DEPRECATED_METHODS } from "../../data/deprecated-apis.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  deprecatedGlobal:
    "'{{name}}' is deprecated. Use '{{replacement}}' instead so the code relies on supported behavior.",
  deprecatedMethod:
    "'.{{name}}' is deprecated. Use '.{{replacement}}' instead so the code relies on supported behavior.",
} as const;

const globalsByName = new Map(DEPRECATED_GLOBAL_FUNCTIONS.map((entry) => [entry.name, entry]));
const methodsByName = new Map(DEPRECATED_METHODS.map((entry) => [entry.name, entry]));

export const noDeprecatedApiUsage: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports calls to APIs recorded as deprecated in the owning catalogs. Refactor suggested: use the catalog replacement.",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (isTestFile(context.filename)) {
      return {};
    }
    function reportDeprecatedCall(node: TSESTree.CallExpression): void {
      const callee = node.callee;
      if (callee.type === "Identifier") {
        const entry = globalsByName.get(callee.name);
        if (entry)
          context.report({
            node: callee,
            messageId: "deprecatedGlobal",
            data: { name: entry.name, replacement: entry.replacement },
          });
        return;
      }
      if (
        callee.type !== "MemberExpression" ||
        callee.computed ||
        callee.property.type !== "Identifier"
      )
        return;
      const entry = methodsByName.get(callee.property.name);
      if (entry)
        context.report({
          node: callee.property,
          messageId: "deprecatedMethod",
          data: { name: entry.name, replacement: entry.replacement },
        });
    }
    return { CallExpression: reportDeprecatedCall };
  },
};
