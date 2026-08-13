import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { fatInterfaceCandidate } from "../../../src/rules/quality/fat-interface-candidate.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

const tenMembers = `interface Report {
  one: string;
  two: string;
  three: string;
  four: string;
  five: string;
  six: string;
  seven: string;
  eight: string;
  nine: string;
  ten: string;
}`;

const twelveMembers = `interface Report {
  one: string;
  two: string;
  three: string;
  four: string;
  five: string;
  six: string;
  seven: string;
  eight: string;
  nine: string;
  ten: string;
  eleven: string;
  twelve: string;
}`;

ruleTester.run("fat-interface-candidate", fatInterfaceCandidate, {
  valid: [
    {
      name: "accepts a small interface",
      code: "interface Report { title: string; lines: string[]; }",
      filename: "src/modules/reports/domain/report.ts",
    },
    {
      name: "accepts an interface with exactly ten members",
      code: tenMembers,
      filename: "src/modules/reports/domain/report.ts",
    },
    {
      name: "accepts a wide interface outside domain and application code",
      code: twelveMembers,
      filename: "src/infrastructure/mappers/report-mapper.ts",
    },
    {
      name: "accepts a wide interface inside a test file",
      code: twelveMembers,
      filename: "tests/unit/report.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports an interface exposing more than ten members",
      code: twelveMembers,
      filename: "src/modules/reports/domain/report.ts",
      errors: [{ messageId: "fatInterfaceCandidate", data: { count: 12 } }],
    },
  ],
});
