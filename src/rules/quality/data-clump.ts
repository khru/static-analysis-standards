import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

import {
  MINIMUM_DATA_CLUMP_OCCURRENCES,
  MINIMUM_DATA_CLUMP_PARAMETERS,
} from "../../data/rule-thresholds.js";
import { smellEntry } from "../../data/smell-catalog.js";
import { walkNode } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("data-clump");

const messages = {
  dataClump:
    "Review candidate: '{{name}}' repeats the parameter group '{{params}}'; extract a value object for the recurring data (tdd-refactor: Data Clump).",
} as const;

type FunctionLikeNode =
  TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression;

function parameterNames(node: FunctionLikeNode): string[] {
  return node.params
    .map((param) => (param.type === "Identifier" ? param.name : undefined))
    .filter((name): name is string => name !== undefined);
}

function nodeName(node: FunctionLikeNode): string {
  return node.type === "FunctionDeclaration" ? node.id!.name : "function";
}

export const dataClump: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports a parameter group repeated across at least ${MINIMUM_DATA_CLUMP_OCCURRENCES} functions in the same file. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }
    const occurrences = new Map<string, number>();
    function analyzeOccurrence(node: TSESTree.Node): void {
      if (
        node.type !== "FunctionDeclaration" &&
        node.type !== "FunctionExpression" &&
        node.type !== "ArrowFunctionExpression"
      )
        return;
      const names = parameterNames(node).sort();
      if (names.length < MINIMUM_DATA_CLUMP_PARAMETERS) return;
      const key = names.join("|");
      const count = (occurrences.get(key) ?? 0) + 1;
      occurrences.set(key, count);
      if (count < MINIMUM_DATA_CLUMP_OCCURRENCES) return;
      context.report({
        node,
        messageId: "dataClump",
        data: { name: nodeName(node), params: names.join(", ") },
      });
    }
    return {
      "Program:exit": (program) => {
        walkNode(program, (node) => {
          analyzeOccurrence(node);
          return true;
        });
      },
    };
  },
};
