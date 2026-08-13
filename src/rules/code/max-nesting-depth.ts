import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import {
  DEFAULT_MAX_NESTING_DEPTH,
  NESTING_CONTROL_FLOW_TYPES,
} from "../../data/control-flow-catalogs.js";

const messages = {
  tooDeep:
    "Control flow is nested at depth {{depth}} (maximum {{max}}). Use guard clauses to flatten (Conditional Complexity).",
} as const;

export const maxNestingDepth: TSESLint.RuleModule<keyof typeof messages, [{ max?: number }]> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports control flow nested deeper than the configured maximum. Refactor suggested: use guard clauses or extract conditionals (Conditional Complexity).",
    },
    messages,
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: { max: { type: "integer", minimum: 1 } },
      },
    ],
  },
  defaultOptions: [{ max: DEFAULT_MAX_NESTING_DEPTH }],
  create(context) {
    const max = context.options[0]?.max ?? DEFAULT_MAX_NESTING_DEPTH;
    const frames: { depth: number }[] = [];

    const enterControl = (node: TSESTree.Node): void => {
      const frame = frames[frames.length - 1];
      if (!frame) {
        return;
      }
      frame.depth += 1;
      if (frame.depth > max) {
        context.report({ node, messageId: "tooDeep", data: { depth: frame.depth, max } });
      }
    };
    const exitControl = (): void => {
      const frame = frames[frames.length - 1];
      if (frame) {
        frame.depth -= 1;
      }
    };
    const enterFunction = (): void => {
      frames.push({ depth: 0 });
    };
    const exitFunction = (): void => {
      frames.pop();
    };

    const controlListeners: TSESLint.RuleListener = {};
    for (const type of NESTING_CONTROL_FLOW_TYPES) {
      controlListeners[type] = enterControl;
      controlListeners[`${type}:exit`] = exitControl;
    }

    return {
      FunctionDeclaration: enterFunction,
      "FunctionDeclaration:exit": exitFunction,
      FunctionExpression: enterFunction,
      "FunctionExpression:exit": exitFunction,
      ArrowFunctionExpression: enterFunction,
      "ArrowFunctionExpression:exit": exitFunction,
      ...controlListeners,
    };
  },
};
