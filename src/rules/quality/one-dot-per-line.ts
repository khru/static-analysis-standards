import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import { PIPELINE_OPERATORS } from "../../data/pipeline-operators.js";
import { isTestFile } from "../../shared/file-scope.js";

const messages = {
  oneDotPerLine:
    "Review candidate: chained call '{{chain}}' spans more than one level; consider expressing each step as its own statement (Calisthenics: one dot per line).",
} as const;

const pipelineOperators = new Set(PIPELINE_OPERATORS);

function callChainNames(node: TSESTree.CallExpression): {
  names: string[];
  rootedInThisOrSuper: boolean;
} {
  const names: string[] = [];
  let current: TSESTree.Expression = node;
  while (
    current.type === "CallExpression" &&
    current.callee.type === "MemberExpression" &&
    !current.callee.computed &&
    current.callee.property.type === "Identifier"
  ) {
    names.push(current.callee.property.name);
    current = current.callee.object;
  }
  while (current.type === "MemberExpression") {
    current = current.object;
  }
  return {
    names,
    rootedInThisOrSuper: current.type === "ThisExpression" || current.type === "Super",
  };
}

export const oneDotPerLine: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Reports chained method calls that span more than one level, excluding functional collection pipelines. Review candidate: express each step as its own statement (Calisthenics: one dot per line).",
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
      CallExpression: (node) => {
        if (node.parent.type === "MemberExpression" && node.parent.object === node) {
          return;
        }
        const { names, rootedInThisOrSuper } = callChainNames(node);
        const maximumChainLength = rootedInThisOrSuper ? 3 : 2;
        if (
          names.length >= maximumChainLength &&
          !names.every((name) => pipelineOperators.has(name))
        ) {
          context.report({ node, messageId: "oneDotPerLine", data: { chain: names.join(".") } });
        }
      },
    };
  },
};
