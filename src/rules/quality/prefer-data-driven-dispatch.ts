import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  mappingSwitch:
    "This switch only maps cases to returned values. Replace it with a data-driven lookup table keyed by a typed discriminant.",
} as const;

function isSingleReturn(branch: TSESTree.SwitchCase): boolean {
  return branch.consequent.length === 1 && branch.consequent[0]?.type === "ReturnStatement";
}

export const preferDataDrivenDispatch: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports switches that purely map cases to returned values. Refactor suggested: use a data-driven lookup table keyed by a typed discriminant.",
    },
    messages,
    schema: [],
  },
  create(context) {
    if (isTestFile(context.filename)) {
      return {};
    }
    return {
      SwitchStatement(node) {
        if (node.cases.length < 2) {
          return;
        }
        if (node.cases.every(isSingleReturn)) {
          context.report({ node, messageId: "mappingSwitch" });
        }
      },
    };
  },
};
