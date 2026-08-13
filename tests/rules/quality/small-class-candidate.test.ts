import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { smallClassCandidate } from "../../../src/rules/quality/small-class-candidate.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

const sevenMethods = `class Report {
  constructor() {}
  generate() {}
  render() {}
  export() {}
  print() {}
  archive() {}
  delete() {}
  duplicate() {}
}`;

const eightMethods = `class Report {
  generate() {}
  render() {}
  export() {}
  print() {}
  archive() {}
  delete() {}
  duplicate() {}
  restore() {}
}`;

ruleTester.run("small-class-candidate", smallClassCandidate, {
  valid: [
    {
      name: "accepts a small class",
      code: "class Account { deposit() {} withdraw() {} }",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a class with seven methods beside its constructor",
      code: sevenMethods,
      filename: "src/modules/reports/domain/report.ts",
    },
    {
      name: "accepts a wide class outside domain and application code",
      code: eightMethods,
      filename: "src/infrastructure/mappers/report-mapper.ts",
    },
    {
      name: "accepts a wide class inside a test file",
      code: eightMethods,
      filename: "tests/unit/report.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a class exposing eight methods",
      code: eightMethods,
      filename: "src/modules/reports/domain/report.ts",
      errors: [{ messageId: "largeClass", data: { count: 8 } }],
    },
    {
      name: "reports a class expression exposing eight methods",
      code: `const report = class {
  generate() {}
  render() {}
  export() {}
  print() {}
  archive() {}
  delete() {}
  duplicate() {}
  restore() {}
};`,
      filename: "src/modules/reports/application/report-service.ts",
      errors: [{ messageId: "largeClass", data: { count: 8 } }],
    },
  ],
});
