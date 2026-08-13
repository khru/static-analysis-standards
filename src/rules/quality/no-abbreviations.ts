import type { TSESLint } from "@typescript-eslint/utils";

import { ABBREVIATIONS } from "../../data/abbreviations.js";
import { ALLOWED_SHORT_NAMES } from "../../data/naming-catalogs.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  shortIdentifier:
    "Review candidate: '{{name}}' is a short identifier that may be an unexplained abbreviation; prefer an intention-revealing name (Calisthenics: no abbreviations).",
} as const;

const allowedShortNames = new Set(ALLOWED_SHORT_NAMES);

const SHORT_IDENTIFIER_PATTERN = /^[a-z][a-z0-9]{0,2}$/;

function isUnexplainedShortIdentifier(name: string): boolean {
  if (!SHORT_IDENTIFIER_PATTERN.test(name)) {
    return false;
  }
  if (allowedShortNames.has(name) || ABBREVIATIONS.has(name)) {
    return false;
  }
  return true;
}

export const noAbbreviations: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports short identifiers that look like unexplained abbreviations outside the agreed abbreviation catalog. Review candidate: prefer an intention-revealing name (Calisthenics: no abbreviations).",
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
      Identifier: (node) => {
        if (isUnexplainedShortIdentifier(node.name)) {
          context.report({ node, messageId: "shortIdentifier", data: { name: node.name } });
        }
      },
    };
  },
};
