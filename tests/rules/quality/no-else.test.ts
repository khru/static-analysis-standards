import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noElse } from "../../../src/rules/quality/no-else.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-else", noElse, {
  valid: [
    {
      name: "accepts an if without an else branch",
      code: 'function sign(value) { if (value < 0) { return "negative"; } return "positive"; }',
      filename: "src/modules/signs/domain/sign.ts",
    },
    {
      name: "accepts a ternary expression",
      code: 'const label = ok ? "yes" : "no";',
      filename: "src/modules/labels/application/label.ts",
    },
    {
      name: "accepts an else branch inside a test file",
      code: 'function probe(value) { if (value) { return "yes"; } else { return "no"; } }',
      filename: "tests/unit/probe.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports an else branch replaceable by an early return",
      code: 'function check(value) { if (value > 0) { return "positive"; } else { return "negative"; } }',
      filename: "src/modules/checks/application/check.ts",
      errors: [{ messageId: "noElse" }],
    },
    {
      name: "reports every else branch of an else-if chain",
      code: 'function classify(value) { if (value > 0) { return "positive"; } else if (value < 0) { return "negative"; } else { return "zero"; } }',
      filename: "src/modules/classify/application/classify.ts",
      errors: [{ messageId: "noElse" }, { messageId: "noElse" }],
    },
    {
      name: "reports only the dangling else that belongs to the inner if",
      code: 'function check(a, b) { if (a) { if (b) { return "both"; } else { return "a-only"; } } return "none"; }',
      filename: "src/modules/checks/application/check.ts",
      errors: [{ messageId: "noElse" }],
    },
  ],
});
