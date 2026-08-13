import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { maxOneIndentation } from "../../../src/rules/quality/max-one-indentation.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("max-one-indentation", maxOneIndentation, {
  valid: [
    {
      name: "accepts a function whose statements stay at the body level",
      code: "function total(items) { const count = items.length; return count; }",
      filename: "src/modules/reports/domain/report.ts",
    },
    {
      name: "accepts a single level of nested control flow",
      code: "function emitAll(items) { for (const item of items) { emit(item); } }",
      filename: "src/modules/audit/application/audit-trail.ts",
    },
    {
      name: "accepts a single if at one level",
      code: 'function handle(request) { if (request.ok) { return "ok"; } return "nope"; }',
      filename: "src/modules/requests/application/request-handler.ts",
    },
    {
      name: "accepts a switch at the body level",
      code: 'function kind(code) { switch (code) { case 1: return "one"; default: return "other"; } }',
      filename: "src/modules/codes/domain/code-kind.ts",
    },
    {
      name: "accepts a concise arrow body",
      code: "const pick = (items) => items[0] ?? null;",
      filename: "src/modules/items/application/item-picker.ts",
    },
    {
      name: "accepts a class method at one level",
      code: "class Queue { drain(item) { while (item) { emit(item); } } }",
      filename: "src/modules/queue/domain/queue.ts",
    },
    {
      name: "accepts deep nesting inside a test file",
      code: "function probe(items) { for (const item of items) { if (item.active) { probe(item); } } }",
      filename: "tests/unit/probe.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a statement nested two blocks deep",
      code: "function run(items) { for (const item of items) { if (item.active) { emit(item); } } }",
      filename: "src/modules/emitter/application/emitter.ts",
      errors: [{ messageId: "nestedTooDeep" }],
    },
    {
      name: "reports nested control flow inside a try block",
      code: "function retry(task) { try { while (task.pending) { task.step(); } } catch (error) { handle(error); } }",
      filename: "src/modules/tasks/application/task-retry.ts",
      errors: [{ messageId: "nestedTooDeep" }],
    },
    {
      name: "reports nested blocks inside an arrow function",
      code: "const process = (rows) => { for (const row of rows) { if (row.ready) { collect(row); } } };",
      filename: "src/modules/rows/application/row-processor.ts",
      errors: [{ messageId: "nestedTooDeep" }],
    },
  ],
});
