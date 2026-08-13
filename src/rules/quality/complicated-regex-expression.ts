import type { TSESLint } from "@typescript-eslint/utils";

import {
  MINIMUM_COMPLICATED_REGEX_GROUPS,
  MINIMUM_COMPLICATED_REGEX_LENGTH,
} from "../../data/rule-thresholds.js";
import { smellEntry } from "../../data/smell-catalog.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("complicated-regex-expression");

const messages = {
  complicatedRegex:
    "Review candidate: this regular expression is {{groups}} groups and {{length}} characters; consider a readable named pattern (tdd-refactor: Complicated Regex Expression).",
} as const;

export const complicatedRegexExpression: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports regular expressions with a long pattern or many groups. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
      Literal: (node) => {
        if (!(node.value instanceof RegExp)) {
          return;
        }
        const pattern = node.value.source;
        const groups = (pattern.match(/\(|\|/g) ?? []).length;
        if (
          pattern.length >= MINIMUM_COMPLICATED_REGEX_LENGTH ||
          groups >= MINIMUM_COMPLICATED_REGEX_GROUPS
        ) {
          context.report({
            node,
            messageId: "complicatedRegex",
            data: { groups, length: pattern.length },
          });
        }
      },
    };
  },
};
