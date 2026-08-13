import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { temporaryField } from "../../../src/rules/quality/temporary-field.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("temporary-field", temporaryField, {
  valid: [
    {
      name: "accepts a field read by more than one method",
      code: "class Counter { total = 0; increment() { this.total += 1; return this.total; } read() { return this.total; } }",
      filename: "src/modules/counters/domain/counter.ts",
    },
    {
      name: "accepts a field in a class with a single method",
      code: "class Report { tempValue = null; render() { return this.tempValue; } }",
      filename: "src/modules/reports/domain/report.ts",
    },
    {
      name: "accepts a field with a computed key",
      code: 'class Counter { ["total"] = 0; increment() { this["total"] += 1; return this["total"]; } read() { return this["total"]; } }',
      filename: "src/modules/counters/domain/counter.ts",
    },
    {
      name: "accepts a field read by one method inside a test file",
      code: "class Report { tempValue = null; render() { return this.tempValue; } reset() { return 0; } }",
      filename: "tests/unit/report.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a field read by exactly one method of a multi-method class",
      code: "class Report { tempValue = null; render() { return this.tempValue; } reset() { return 0; } }",
      filename: "src/modules/reports/domain/report.ts",
      errors: [{ messageId: "temporaryField" }],
    },
    {
      name: "reports a field read by one implemented method when an overload signature exists",
      code: "class Report { tempValue = null; render(): string; render() { return this.tempValue; } reset() { return 0; } }",
      filename: "src/modules/reports/domain/report.ts",
      errors: [{ messageId: "temporaryField" }],
    },
  ],
});
