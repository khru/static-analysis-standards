import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { combinatorialExplosion } from "../../../src/rules/quality/combinatorial-explosion.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("combinatorial-explosion", combinatorialExplosion, {
  valid: [
    {
      name: "accepts a function with three conditional branches",
      code: 'function classify(entry) { if (entry.a) { return "a"; } if (entry.b) { return "b"; } if (entry.c) { return "c"; } return "other"; }',
      filename: "src/modules/entries/application/classifier.ts",
    },
    {
      name: "accepts a switch with several cases",
      code: 'function label(code) { switch (code) { case 1: return "one"; case 2: return "two"; case 3: return "three"; case 4: return "four"; default: return "other"; } }',
      filename: "src/modules/codes/domain/code-label.ts",
    },
    {
      name: "accepts an arrow function with an expression body",
      code: "const process = (value) => value * 2;",
      filename: "src/modules/values/application/processor.ts",
    },
    {
      name: "accepts branching functions inside a test file",
      code: 'function classify(entry) { if (entry.a) { return "a"; } if (entry.b) { return "b"; } if (entry.c) { return "c"; } if (entry.d) { return "d"; } return "other"; }',
      filename: "tests/unit/classifier.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a function branching over four conditions",
      code: 'function classify(entry) { if (entry.a) { return "a"; } if (entry.b) { return "b"; } if (entry.c) { return "c"; } if (entry.d) { return "d"; } return "other"; }',
      filename: "src/modules/entries/application/classifier.ts",
      errors: [{ messageId: "combinatorialExplosion" }],
    },
    {
      name: "reports an anonymous function expression branching over four conditions",
      code: "const classify = function (entry) { if (entry.a) { return 1; } if (entry.b) { return 2; } if (entry.c) { return 3; } if (entry.d) { return 4; } return 0; };",
      filename: "src/modules/entries/application/classifier.ts",
      errors: [{ messageId: "combinatorialExplosion" }],
    },
    {
      name: "reports an arrow function branching over four conditions",
      code: "const classify = (entry) => { if (entry.a) { return 1; } if (entry.b) { return 2; } if (entry.c) { return 3; } if (entry.d) { return 4; } return 0; };",
      filename: "src/modules/entries/application/classifier.ts",
      errors: [{ messageId: "combinatorialExplosion" }],
    },
  ],
});
