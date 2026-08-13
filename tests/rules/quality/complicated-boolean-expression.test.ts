import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { complicatedBooleanExpression } from "../../../src/rules/quality/complicated-boolean-expression.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("complicated-boolean-expression", complicatedBooleanExpression, {
  valid: [
    {
      name: "accepts a two-operand condition",
      code: "function allow(entry) { if (entry.active && entry.approved) { return true; } return false; }",
      filename: "src/modules/entries/application/entry-gate.ts",
    },
    {
      name: "accepts a single-operand condition",
      code: "function allow(entry) { if (entry.active) { return true; } return false; }",
      filename: "src/modules/entries/application/entry-gate.ts",
    },
    {
      name: "accepts a simple while condition",
      code: "function count(items) { let total = 0; while (total < items.length) { total += 1; } return total; }",
      filename: "src/modules/items/domain/item.ts",
    },
    {
      name: "accepts conditions inside a test file",
      code: "function allow(entry) { if (entry.active && entry.approved && entry.verified) { return true; } return false; }",
      filename: "tests/unit/entry-gate.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a condition combining three operands",
      code: "function allow(entry) { if (entry.active && entry.approved && entry.verified) { return true; } return false; }",
      filename: "src/modules/entries/application/entry-gate.ts",
      errors: [{ messageId: "complicatedBoolean" }],
    },
    {
      name: "reports a while condition combining three operands",
      code: "function drain(items) { while (items.a && items.b && items.c) { consume(items); } }",
      filename: "src/modules/items/application/drainer.ts",
      errors: [{ messageId: "complicatedBoolean" }],
    },
    {
      name: "reports a do-while condition combining three operands",
      code: "function poll(items) { do { advance(items); } while (items.a || items.b || items.c); }",
      filename: "src/modules/items/application/poller.ts",
      errors: [{ messageId: "complicatedBoolean" }],
    },
    {
      name: "reports a ternary combining three operands",
      code: 'const label = (entry) => (entry.a || entry.b || entry.c) ? "mixed" : "clear";',
      filename: "src/modules/entries/domain/entry.ts",
      errors: [{ messageId: "complicatedBoolean" }],
    },
  ],
});
