import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { inappropriateStatic } from "../../../src/rules/quality/inappropriate-static.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("inappropriate-static", inappropriateStatic, {
  valid: [
    {
      name: "accepts a method that reads instance state",
      code: "class Counter { total = 0; add(amount) { this.total += amount; return this.total; } }",
      filename: "src/modules/counters/domain/counter.ts",
    },
    {
      name: "accepts a static method",
      code: "class Calculator { static add(a, b) { return a + b; } }",
      filename: "src/modules/calculator/application/calculator.ts",
    },
    {
      name: "accepts an arrow function that closes over instance state",
      code: "class Counter { total = 0; snapshot = () => this.total; }",
      filename: "src/modules/counters/domain/counter.ts",
    },
    {
      name: "accepts a method that uses this and contains a nested function",
      code: 'class Adapter { label = "x"; build(parts) { function join(p) { return p; } return join(parts) + this.label; } }',
      filename: "src/modules/adapters/application/adapter.ts",
    },
    {
      name: "accepts a getter",
      code: "class Window { width = 10; get area() { return this.width * 2; } }",
      filename: "src/modules/windows/domain/window.ts",
    },
    {
      name: "accepts a method with a computed key",
      code: 'class Calculator { ["add"](a, b) { return a + b; } }',
      filename: "src/modules/calculator/application/calculator.ts",
    },
    {
      name: "accepts a method that never touches instance state inside a test file",
      code: "class Calculator { add(a, b) { return a + b; } }",
      filename: "tests/unit/calculator.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a method that never touches instance state",
      code: "class Calculator { add(a, b) { return a + b; } }",
      filename: "src/modules/calculator/application/calculator.ts",
      errors: [{ messageId: "inappropriateStatic" }],
    },
  ],
});
