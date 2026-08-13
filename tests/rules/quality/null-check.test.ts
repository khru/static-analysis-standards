import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { nullCheck } from "../../../src/rules/quality/null-check.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("null-check", nullCheck, {
  valid: [
    {
      name: "accepts a comparison that is not a null check",
      code: 'function read(value) { if (value > 0) { return "positive"; } return "other"; }',
      filename: "src/modules/values/domain/value.ts",
    },
    {
      name: "accepts a truthiness test",
      code: 'function read(value) { if (value) { return "set"; } return "empty"; }',
      filename: "src/modules/values/domain/value.ts",
    },
    {
      name: "accepts a while condition that is not a null check",
      code: "function count(items) { let total = 0; while (total < items.length) { total += 1; } return total; }",
      filename: "src/modules/items/domain/item.ts",
    },
    {
      name: "accepts a conditional expression that is not a null check",
      code: 'const label = (count) => count < 3 ? "low" : "high";',
      filename: "src/modules/counts/domain/count.ts",
    },
    {
      name: "accepts null checks inside a test file",
      code: 'function read(value) { if (value === null) { return "none"; } return value; }',
      filename: "tests/unit/value.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports an equality check against null",
      code: 'function read(value) { if (value === null) { return "none"; } return value; }',
      filename: "src/modules/values/domain/value.ts",
      errors: [{ messageId: "nullCheck" }],
    },
    {
      name: "reports an equality check against undefined",
      code: 'function read(value) { if (value === undefined) { return "none"; } return value; }',
      filename: "src/modules/values/domain/value.ts",
      errors: [{ messageId: "nullCheck" }],
    },
    {
      name: "reports a typeof undefined guard on the right operand",
      code: 'function read(value) { if ("undefined" === typeof value) { return "none"; } return value; }',
      filename: "src/modules/values/domain/value.ts",
      errors: [{ messageId: "nullCheck" }],
    },
    {
      name: "reports a while loop guarded by a null check",
      code: "function drain(items) { let item = items.next(); while (item !== null) { consume(item); item = items.next(); } }",
      filename: "src/modules/items/application/drainer.ts",
      errors: [{ messageId: "nullCheck" }],
    },
    {
      name: "reports a conditional expression testing null",
      code: 'const label = (value) => value === null ? "missing" : "present";',
      filename: "src/modules/values/domain/value.ts",
      errors: [{ messageId: "nullCheck" }],
    },
    {
      name: "reports a typeof undefined guard",
      code: 'function read(value) { if (typeof value === "undefined") { return "none"; } return value; }',
      filename: "src/modules/values/domain/value.ts",
      errors: [{ messageId: "nullCheck" }],
    },
  ],
});
