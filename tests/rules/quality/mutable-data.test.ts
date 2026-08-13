import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { mutableData } from "../../../src/rules/quality/mutable-data.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("mutable-data", mutableData, {
  valid: [
    {
      name: "accepts immutable const declarations",
      code: "function track(entry) { const attempts = 0; return attempts; }",
      filename: "src/modules/tracking/application/tracker.ts",
    },
    {
      name: "accepts let declarations inside a test file",
      code: "let counter = 0; counter += 1;",
      filename: "tests/unit/tracker.test.ts",
    },
    {
      name: "accepts a destructured let declaration",
      code: "function first(items) { let [head] = items; return head; }",
      filename: "src/modules/items/application/item-head.ts",
    },
  ],
  invalid: [
    {
      name: "reports a reassignable local variable",
      code: "function track(entry) { let attempts = 0; attempts += 1; return attempts; }",
      filename: "src/modules/tracking/application/tracker.ts",
      errors: [{ messageId: "mutableData" }],
    },
  ],
});
