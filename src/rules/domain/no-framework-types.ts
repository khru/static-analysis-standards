import type { TSESLint } from "@typescript-eslint/utils";

import { FRAMEWORKS } from "../../data/frameworks.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  frameworkImport:
    "Domain and application import the '{{source}}' framework. Keep domain and application framework-independent.",
} as const;

export const noFrameworkTypes: TSESLint.RuleModule<keyof typeof messages, [string[]?]> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports framework and infrastructure SDK imports in domain and application code. Refactor suggested: keep domain and application framework-independent.",
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
    const frameworks = context.options[0] ?? FRAMEWORKS;
    const matchesFramework = (source: string): boolean =>
      frameworks.some((framework) => source === framework || source.startsWith(`${framework}/`));

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (matchesFramework(source)) {
          context.report({ node, messageId: "frameworkImport", data: { source } });
        }
      },
    };
  },
};
