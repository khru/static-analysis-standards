import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { complicatedRegexExpression } from "../../../src/rules/quality/complicated-regex-expression.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("complicated-regex-expression", complicatedRegexExpression, {
  valid: [
    {
      name: "accepts a short simple pattern",
      code: "function isSlug(value) { return /^[a-z]+$/.test(value); }",
      filename: "src/modules/entries/domain/entry.ts",
    },
    {
      name: "accepts a pattern with few groups",
      code: "function matches(value) { return /^(a|b)$/.test(value); }",
      filename: "src/modules/entries/domain/entry.ts",
    },
    {
      name: "accepts non-regex literals",
      code: 'function read(value) { const pattern = "^[a-z]+$"; return value.match(pattern); }',
      filename: "src/modules/entries/domain/entry.ts",
    },
    {
      name: "accepts a long pattern inside a test file",
      code: "function matches(value) { return /^[a-z0-9]{2,64}(-[a-z0-9]{2,64})*$/.test(value); }",
      filename: "tests/unit/entry-matcher.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a pattern with three groups or alternatives",
      code: "function matches(value) { return /^(a|b|c)+$/.test(value); }",
      filename: "src/modules/entries/application/entry-matcher.ts",
      errors: [{ messageId: "complicatedRegex" }],
    },
    {
      name: "reports a long pattern",
      code: "function matches(value) { return /^[a-z0-9]{2,64}(-[a-z0-9]{2,64})*$/.test(value); }",
      filename: "src/modules/entries/application/entry-matcher.ts",
      errors: [{ messageId: "complicatedRegex" }],
    },
  ],
});
