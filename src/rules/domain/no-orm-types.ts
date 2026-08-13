import type { TSESLint } from "@typescript-eslint/utils";

import { ORM_PACKAGES } from "../../data/orm-packages.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  ormImport:
    "Domain and application import ORM or persistence types from '{{source}}'. Define domain vocabulary types instead of table types.",
} as const;

export const noOrmTypes: TSESLint.RuleModule<keyof typeof messages, [string[]?]> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports ORM and persistence type imports in domain and application code. Refactor suggested: define domain vocabulary types instead of table types.",
    },
    messages,
    schema: [
      {
        type: "array",
        items: { type: "string" },
        uniqueItems: true,
      },
    ],
  },
  defaultOptions: [[]],
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }
    const ormPackages = context.options[0] ?? ORM_PACKAGES;
    const matchesOrm = (source: string): boolean =>
      ormPackages.some((orm) => source === orm || source.startsWith(`${orm}/`));

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (matchesOrm(source)) {
          context.report({ node, messageId: "ormImport", data: { source } });
        }
      },
    };
  },
};
