import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  ambientRandomness:
    "Domain and application must not draw ambient randomness. Inject an identifier or random-source port instead.",
} as const;

export const noAmbientRandomness: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports ambient randomness in domain and application code. Refactor suggested: inject an identifier or random-source port (Hidden Dependencies).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }

    const isAmbientRandomness = (callee: TSESTree.CallExpression["callee"]): boolean => {
      if (callee.type === "Identifier") {
        return callee.name === "randomUUID";
      }
      if (callee.type !== "MemberExpression") {
        return false;
      }
      if (callee.object.type !== "Identifier" || callee.property.type !== "Identifier") {
        return false;
      }
      if (callee.object.name === "Math") {
        return callee.property.name === "random";
      }
      if (callee.object.name === "crypto") {
        return callee.property.name === "randomUUID" || callee.property.name === "getRandomValues";
      }
      return false;
    };

    return {
      CallExpression(node) {
        if (isAmbientRandomness(node.callee)) {
          context.report({ node, messageId: "ambientRandomness" });
        }
      },
    };
  },
};
