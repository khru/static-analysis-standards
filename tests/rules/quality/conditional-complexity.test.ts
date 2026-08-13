import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { conditionalComplexity } from "../../../src/rules/quality/conditional-complexity.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("conditional-complexity", conditionalComplexity, {
  valid: [
    {
      name: "accepts a function with a few branches",
      code: 'function decide(value) { if (value > 0) { return "pos"; } if (value < 0) { return "neg"; } return "zero"; }',
      filename: "src/modules/values/domain/value.ts",
    },
    {
      name: "accepts a function whose decision points stay below the threshold",
      code: "function score(entry) { let total = 0; if (entry.a) { total += 1; } if (entry.b) { total += 1; } if (entry.c && entry.d) { total += 2; } return total; }",
      filename: "src/modules/entries/application/scorer.ts",
    },
    {
      name: "accepts an arrow function with an expression body",
      code: "const score = (entry) => entry.a ? 1 : 0;",
      filename: "src/modules/entries/domain/entry.ts",
    },
    {
      name: "accepts a complex function inside a test file",
      code: "function score(entry) { let total = 0; if (entry.a) { total += 1; } if (entry.b) { total += 1; } if (entry.c) { total += 1; } if (entry.d) { total += 1; } if (entry.e) { total += 1; } return total; }",
      filename: "tests/unit/scorer.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a function with at least six decision points",
      code: "function score(entry) { let total = 0; if (entry.a) { total += 1; } if (entry.b) { total += 1; } if (entry.c) { total += 1; } if (entry.d) { total += 1; } if (entry.e) { total += 1; } return total; }",
      filename: "src/modules/entries/application/scorer.ts",
      errors: [{ messageId: "conditionalComplexity" }],
    },
    {
      name: "reports an anonymous function expression with at least six decision points",
      code: "const score = function (entry) { let total = 0; if (entry.a) { total += 1; } if (entry.b) { total += 1; } if (entry.c) { total += 1; } if (entry.d) { total += 1; } if (entry.e) { total += 1; } return total; };",
      filename: "src/modules/entries/application/scorer.ts",
      errors: [{ messageId: "conditionalComplexity" }],
    },
    {
      name: "reports an arrow function combining logical operators",
      code: "const score = (entry) => { let total = 0; if (entry.a) { total += 1; } if (entry.b) { total += 1; } if (entry.c) { total += 1; } if (entry.d) { total += 1; } if (entry.a || entry.b) { total += 2; } return total; };",
      filename: "src/modules/entries/application/scorer.ts",
      errors: [{ messageId: "conditionalComplexity" }],
    },
  ],
});
