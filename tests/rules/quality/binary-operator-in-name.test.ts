import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { binaryOperatorInName } from "../../../src/rules/quality/binary-operator-in-name.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("binary-operator-in-name", binaryOperatorInName, {
  valid: [
    {
      name: "accepts a function name without an operator word",
      code: "function calculateTotal(entries) { return entries.length; }",
      filename: "src/modules/entries/domain/entry.ts",
    },
    {
      name: "accepts a method name without an operator word",
      code: "class OrderService { render() { return this.payload; } }",
      filename: "src/modules/orders/application/order-service.ts",
    },
    {
      name: "accepts a class name without an operator word",
      code: "class OrderService { deliver() { return true; } }",
      filename: "src/modules/orders/domain/order.ts",
    },
    {
      name: "accepts a name that merely contains a substring of an operator word",
      code: "function notifyReviewers(entry) { return entry.id; }",
      filename: "src/modules/reviews/application/review-notifier.ts",
    },
    {
      name: "accepts names inside a test file",
      code: "function canProceedOrWait(entry) { return entry.ready; }",
      filename: "tests/unit/entry-gate.test.ts",
    },
    {
      name: "accepts an anonymous default-exported function",
      code: "export default function () { return true; }",
      filename: "src/modules/entries/domain/entry.ts",
    },
    {
      name: "accepts an anonymous default-exported class",
      code: "export default class { deliver() { return true; } }",
      filename: "src/modules/entries/domain/entry.ts",
    },
    {
      name: "accepts a method with a computed key",
      code: 'class Lookup { ["findInIndex"](entry) { return entry.id; } }',
      filename: "src/modules/lookups/domain/lookup.ts",
    },
  ],
  invalid: [
    {
      name: "reports a function name embedding the operator word or",
      code: "function canProceedOrWait(entry) { return entry.ready; }",
      filename: "src/modules/entries/application/entry-gate.ts",
      errors: [{ messageId: "binaryOperatorInName" }],
    },
    {
      name: "reports a named function expression embedding the operator word or",
      code: "const gate = function canProceedOrWait(entry) { return entry.ready; };",
      filename: "src/modules/entries/application/entry-gate.ts",
      errors: [{ messageId: "binaryOperatorInName" }],
    },
    {
      name: "reports a method name embedding the operator word in",
      code: "class Lookup { findInIndex(entry) { return entry.id; } }",
      filename: "src/modules/lookups/domain/lookup.ts",
      errors: [{ messageId: "binaryOperatorInName" }],
    },
    {
      name: "reports a class name embedding the operator word between",
      code: "class BetweenDatesFilter { matches(date) { return true; } }",
      filename: "src/modules/filters/domain/date-filter.ts",
      errors: [{ messageId: "binaryOperatorInName" }],
    },
  ],
});
