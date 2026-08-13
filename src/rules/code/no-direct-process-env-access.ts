import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { isConfigurationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  directEnvAccess:
    "Direct process.env access bypasses the configuration module (Global Data). Read environment through the typed configuration loader instead.",
} as const;

export const noDirectProcessEnvAccess: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports direct process.env key reads outside the configuration module. Forwarding the whole environment object to the typed configuration loader is allowed. Refactor suggested: encapsulate environment reads in the typed configuration loader (Global Data).",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (isTestFile(filename) || isConfigurationFile(filename)) {
      return {};
    }
    const isProcessEnv = (node: TSESTree.Node): boolean =>
      node.type === "MemberExpression" &&
      node.object.type === "Identifier" &&
      node.object.name === "process" &&
      node.property.type === "Identifier" &&
      node.property.name === "env";
    return {
      MemberExpression(node) {
        const readsProcessEnvironmentKey =
          node.object.type === "MemberExpression" && isProcessEnv(node.object);
        if (!isProcessEnv(node) && readsProcessEnvironmentKey) {
          context.report({ node, messageId: "directEnvAccess" });
        }
        if (!isProcessEnv(node)) return;
        const parent = node.parent;
        if (parent.type === "MemberExpression" && parent.object === node) {
          return;
        }
        if (
          (parent.type === "CallExpression" || parent.type === "NewExpression") &&
          parent.arguments.includes(node)
        )
          return;
        context.report({ node, messageId: "directEnvAccess" });
      },
    };
  },
};
