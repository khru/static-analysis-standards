import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { dataClump } from "../../../src/rules/quality/data-clump.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("data-clump", dataClump, {
  valid: [
    {
      name: "accepts a parameter group appearing once",
      code: "function lookup(start, end, label) { return label; }",
      filename: "src/modules/ranges/domain/range.ts",
    },
    {
      name: "accepts different parameter groups across functions",
      code: "function lookup(start, end, label) { return label; } function slice(from, size) { return from + size; }",
      filename: "src/modules/ranges/domain/range.ts",
    },
    {
      name: "accepts a repeated pair below the minimum group size",
      code: "function first(a, b) { return a; } function second(a, b) { return b; }",
      filename: "src/modules/pairs/domain/pair.ts",
    },
    {
      name: "accepts destructured parameters that are not a named group",
      code: "function lookup({ start, end }, label) { return label; } function slice({ start, end }, label) { return label; }",
      filename: "src/modules/ranges/domain/range.ts",
    },
    {
      name: "accepts repeated parameter groups inside a test file",
      code: "function lookup(start, end, label) { return label; } function slice(start, end, label) { return label; }",
      filename: "tests/unit/range.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a parameter group repeated across two functions",
      code: "function lookup(start, end, label) { return label; } function slice(start, end, label) { return label; }",
      filename: "src/modules/ranges/domain/range.ts",
      errors: [{ messageId: "dataClump" }],
    },
    {
      name: "reports a parameter group repeated across two arrow functions",
      code: "const lookup = (start, end, label) => label; const slice = (start, end, label) => label;",
      filename: "src/modules/ranges/domain/range.ts",
      errors: [{ messageId: "dataClump" }],
    },
  ],
});
