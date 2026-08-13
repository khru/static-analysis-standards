import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { statusVariable } from "../../../src/rules/quality/status-variable.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("status-variable", statusVariable, {
  valid: [
    {
      name: "accepts a variable initialized with a status value that never changes",
      code: 'function label(state) { const status = "pending"; return status; }',
      filename: "src/modules/orders/domain/order.ts",
    },
    {
      name: "accepts a reassigned variable that is not a status",
      code: "function accumulate(items) { let total = 0; for (const item of items) { total += item; } return total; }",
      filename: "src/modules/items/application/item-total.ts",
    },
    {
      name: "accepts a top-level status variable outside any function",
      code: 'let status = "pending";',
      filename: "src/modules/orders/domain/order.ts",
    },
    {
      name: "accepts a status variable inside a function with an expression body",
      code: 'const build = () => class { static { let status = "pending"; status = "active"; } };',
      filename: "src/modules/orders/application/order-update.ts",
    },
    {
      name: "accepts a reassigned status variable inside a test file",
      code: 'function update(state) { let status = "pending"; if (state.ok) { status = "done"; } return status; }',
      filename: "tests/unit/order-update.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a status variable reassigned to another status",
      code: 'function update(state) { let status = "pending"; if (state.ok) { status = "done"; } return status; }',
      filename: "src/modules/orders/application/order-update.ts",
      errors: [{ messageId: "statusVariable" }],
    },
  ],
});
