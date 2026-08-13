import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { longParameterList } from "../../../src/rules/quality/long-parameter-list.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("long-parameter-list", longParameterList, {
  valid: [
    {
      name: "accepts a function with four parameters",
      code: "function transfer(from, to, amount, currency) { return amount; }",
      filename: "src/modules/transfers/application/transfer.ts",
    },
    {
      name: "accepts a method with a bounded parameter list",
      code: "class Ledger { book(debit, credit, amount) { return amount; } }",
      filename: "src/modules/ledger/domain/ledger.ts",
    },
    {
      name: "accepts a computed-key method with a bounded parameter list",
      code: 'class Ledger { ["book"](debit, credit, amount) { return amount; } }',
      filename: "src/modules/ledger/domain/ledger.ts",
    },
    {
      name: "accepts a long parameter list inside a test file",
      code: "function transfer(from, to, amount, currency, memo) { return amount; }",
      filename: "tests/unit/transfer.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a function with five parameters",
      code: "function transfer(from, to, amount, currency, memo) { return amount; }",
      filename: "src/modules/transfers/application/transfer.ts",
      errors: [{ messageId: "longParameterList" }],
    },
    {
      name: "reports a computed-key method with five parameters",
      code: 'class Ledger { ["book"](debit, credit, amount, currency, memo) { return amount; } }',
      filename: "src/modules/ledger/domain/ledger.ts",
      errors: [{ messageId: "longParameterList" }],
    },
    {
      name: "reports a named function expression with five parameters",
      code: "const run = function execute(from, to, amount, currency, memo) { return amount; };",
      filename: "src/modules/transfers/application/transfer.ts",
      errors: [{ messageId: "longParameterList" }],
    },
    {
      name: "reports an anonymous arrow function with five parameters",
      code: "const run = (a, b, c, d, e) => a + b + c + d + e;",
      filename: "src/modules/transfers/application/transfer.ts",
      errors: [{ messageId: "longParameterList" }],
    },
    {
      name: "reports a method with more than four parameters",
      code: "class Ledger { book(debit, credit, amount, currency, memo) { return amount; } }",
      filename: "src/modules/ledger/domain/ledger.ts",
      errors: [{ messageId: "longParameterList" }],
    },
  ],
});
