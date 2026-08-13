import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { imperativeLoops } from "../../../src/rules/quality/imperative-loops.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("imperative-loops", imperativeLoops, {
  valid: [
    {
      name: "accepts a functional collection operation",
      code: "function names(entries) { return entries.map((entry) => entry.name); }",
      filename: "src/modules/entries/application/entry-listing.ts",
    },
    {
      name: "accepts a forEach call",
      code: "function emitAll(items) { items.forEach((item) => emit(item)); }",
      filename: "src/modules/emitter/application/emitter.ts",
    },
    {
      name: "accepts loops inside a test file",
      code: "for (const item of items) { expect(item).toBeDefined(); }",
      filename: "tests/unit/emitter.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a for-of loop",
      code: "function names(entries) { const out = []; for (const entry of entries) { out.push(entry.name); } return out; }",
      filename: "src/modules/entries/application/entry-listing.ts",
      errors: [{ messageId: "imperativeLoop" }],
    },
    {
      name: "reports a classic for loop",
      code: "function total(items) { let sum = 0; for (let i = 0; i < items.length; i += 1) { sum += items[i]; } return sum; }",
      filename: "src/modules/items/domain/item.ts",
      errors: [{ messageId: "imperativeLoop" }],
    },
    {
      name: "reports a while loop",
      code: "function drain(queue) { while (queue.hasNext()) { emit(queue.next()); } }",
      filename: "src/modules/queue/application/queue-drainer.ts",
      errors: [{ messageId: "imperativeLoop" }],
    },
    {
      name: "reports a for-in loop",
      code: "function keys(record) { for (const key in record) { emit(key); } }",
      filename: "src/modules/records/application/record-keys.ts",
      errors: [{ messageId: "imperativeLoop" }],
    },
    {
      name: "reports a do-while loop",
      code: "function retry(task) { let attempts = 0; do { task.run(); attempts += 1; } while (attempts < 3); }",
      filename: "src/modules/tasks/application/task-retry.ts",
      errors: [{ messageId: "imperativeLoop" }],
    },
  ],
});
