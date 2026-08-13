import type { TSESLint } from "@typescript-eslint/utils";

import { ACCESSOR_KINDS } from "../../data/accessor-kinds.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  accessor:
    "Review candidate: this accessor exposes internal state; prefer intention-revealing commands and queries (Calisthenics: no getters/setters).",
} as const;

const accessorKinds = new Set(ACCESSOR_KINDS);

export const noGettersSetters: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports getter and setter accessors in domain and application classes. Review candidate: prefer intention-revealing commands and queries (Calisthenics: no getters/setters).",
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
        if (accessorKinds.has(node.kind)) {
          context.report({ node, messageId: "accessor" });
        }
      },
    };
  },
};
