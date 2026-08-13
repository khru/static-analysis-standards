import type { TSESLint } from "@typescript-eslint/utils";

import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  noElse:
    "Review candidate: this else branch may be replaceable with a guard clause or an early return (Calisthenics: no else).",
} as const;

export const noElse: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports else branches that a guard clause or an early return could replace. Review candidate (Calisthenics: no else).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (isTestFile(filename)) {
      return {};
    }
    return {
      IfStatement: (node) => {
        if (node.alternate) {
          context.report({ node: node.alternate, messageId: "noElse" });
        }
      },
    };
  },
};
