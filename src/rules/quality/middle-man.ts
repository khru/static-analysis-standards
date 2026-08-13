import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { smellEntry } from "../../data/smell-catalog.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("middle-man");

const messages = {
  middleMan:
    "Review candidate: method '{{name}}' only forwards to another object; consider calling the delegate directly (tdd-refactor: Middle Man).",
} as const;

function isSingleReturnDelegation(body: TSESTree.BlockStatement | null): boolean {
  if (body === null || body.body.length !== 1) {
    return false;
  }
  const statement = body.body[0];
  if (statement?.type !== "ReturnStatement" || statement.argument === null) {
    return false;
  }
  return (
    statement.argument.type === "CallExpression" &&
    statement.argument.callee.type === "MemberExpression" &&
    !statement.argument.callee.computed &&
    statement.argument.callee.property.type === "Identifier"
  );
}

export const middleMan: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports methods whose only behavior is forwarding a call to another object. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
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
        if (node.kind !== "method" || node.static || node.key.type !== "Identifier") {
          return;
        }
        if (isSingleReturnDelegation(node.value.body)) {
          context.report({ node, messageId: "middleMan", data: { name: node.key.name } });
        }
      },
    };
  },
};
