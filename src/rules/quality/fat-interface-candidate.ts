import type { TSESLint } from "@typescript-eslint/utils";

import { FAT_INTERFACE_MAX_MEMBERS } from "../../data/rule-thresholds.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  fatInterfaceCandidate:
    "Review candidate: this interface exposes {{count}} members; evaluate interface-segregation cohesion (Interface Segregation evidence).",
} as const;

export const fatInterfaceCandidate: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports domain and application interfaces that expose more than ten members. Review candidate: evaluate interface-segregation cohesion (Interface Segregation evidence).",
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
      TSInterfaceDeclaration: (node) => {
        const count = node.body.body.length;
        if (count > FAT_INTERFACE_MAX_MEMBERS) {
          context.report({ node, messageId: "fatInterfaceCandidate", data: { count } });
        }
      },
    };
  },
};
