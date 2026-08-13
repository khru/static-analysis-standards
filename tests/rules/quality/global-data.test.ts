import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { globalData } from "../../../src/rules/quality/global-data.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("global-data", globalData, {
  valid: [
    {
      name: "accepts module-level const data",
      code: "const MAX_RETRIES = 3; export { MAX_RETRIES };",
      filename: "src/modules/retries/domain/retry-policy.ts",
    },
    {
      name: "accepts a function-scoped mutable variable",
      code: "function retry(task) { let attempts = 0; attempts += 1; return attempts; }",
      filename: "src/modules/tasks/application/task-retry.ts",
    },
    {
      name: "accepts a destructured top-level declaration",
      code: "let [first] = items; export { first };",
      filename: "src/modules/items/domain/item.ts",
    },
    {
      name: "accepts module-level mutable state inside a test file",
      code: "let retries = 0; export { retries };",
      filename: "tests/unit/retry-policy.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports module-level mutable state",
      code: "let retries = 0; export { retries };",
      filename: "src/modules/retries/domain/retry-policy.ts",
      errors: [{ messageId: "globalData" }],
    },
    {
      name: "reports a var declaration at module scope",
      code: "var counter = 0; export { counter };",
      filename: "src/modules/counters/domain/counter.ts",
      errors: [{ messageId: "globalData" }],
    },
  ],
});
