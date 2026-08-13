import type { TSESLint } from "@typescript-eslint/utils";

import { MINIMUM_WHAT_COMMENT_WORDS } from "../../data/rule-thresholds.js";
import { smellEntry } from "../../data/smell-catalog.js";
import { walkNode } from "../../shared/ast.js";
import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const catalogEntry = smellEntry("what-comment");

const messages = {
  whatComment:
    "Review candidate: this comment only restates the code; replace it with a why comment or remove it (tdd-refactor: What Comment).",
} as const;

function significantWords(text: string): string[] {
  const words = text.split(/[^a-zA-Z]+/);
  const significant = words.filter((word) => word.length >= 4);
  return significant.map((word) => word.toLowerCase());
}

function commentRestatesCode(comment: string, code: string): boolean {
  const commentWords = significantWords(comment);
  if (commentWords.length === 0 || commentWords.length > 8) {
    return false;
  }
  const codeWords = new Set(significantWords(code));
  return commentWords.every((word) => codeWords.has(word));
}

export const whatComment: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Reports comments that only restate the code they annotate. Review candidate (tdd-refactor: ${catalogEntry.title}).`,
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }
    const sourceCode = context.sourceCode;
    const reportedRanges = new Set<string>();
    return {
      "Program:exit": (program) => {
        walkNode(program, (node) => {
          for (const comment of sourceCode.getCommentsBefore(node)) {
            if (reportedRanges.has(comment.range.join("-"))) continue;
            const commentText = sourceCode.getText(comment);
            const codeText = sourceCode.getText(node);
            if (commentText.length < MINIMUM_WHAT_COMMENT_WORDS) continue;
            if (!commentRestatesCode(commentText, codeText)) continue;
            reportedRanges.add(comment.range.join("-"));
            context.report({ node: comment, messageId: "whatComment" });
          }
          return true;
        });
      },
    };
  },
};
