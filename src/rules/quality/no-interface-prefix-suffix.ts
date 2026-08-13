import type { TSESLint } from "@typescript-eslint/utils";

import { MINIMUM_PREFIXED_NAME_LENGTH } from "../../data/rule-thresholds.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  interfacePrefix:
    "Interface '{{name}}' uses a Hungarian I prefix. Name it for the concept it describes; the interface declaration already says it is an interface.",
  interfaceSuffix:
    "Interface '{{name}}' repeats its kind as a suffix. Name it for the concept it describes; the interface declaration already says it is an interface.",
} as const;

const HUNGARIAN_PREFIX = /^I[A-Z]/;
const KIND_SUFFIX = /Interface$/;

export const noInterfacePrefixSuffix: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports interface names with an I prefix or an Interface suffix. Refactor suggested: name the concept, not the kind (Obscured Intent).",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (isTestFile(context.filename)) {
      return {};
    }
    return {
      TSInterfaceDeclaration(node) {
        const name = node.id.name;
        if (KIND_SUFFIX.test(name)) {
          context.report({ node: node.id, messageId: "interfaceSuffix", data: { name } });
          return;
        }
        if (HUNGARIAN_PREFIX.test(name) && name.length >= MINIMUM_PREFIXED_NAME_LENGTH) {
          context.report({ node: node.id, messageId: "interfacePrefix", data: { name } });
        }
      },
    };
  },
};
