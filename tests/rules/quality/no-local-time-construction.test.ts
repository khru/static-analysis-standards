import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noLocalTimeConstruction } from "../../../src/rules/quality/no-local-time-construction.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-local-time-construction", noLocalTimeConstruction, {
  valid: [
    {
      name: "accepts constructing a date from a single instant value",
      code: "const created = new Date(reportedAt);",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts constructing a date from a timestamp",
      code: "const created = new Date(epochMs);",
      filename: "src/infrastructure/persistence/incident-repository.ts",
    },
    {
      name: "accepts explicit UTC component construction",
      code: "const epochMs = Date.UTC(2024, 0, 15);",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts bare date construction because the clock rule owns it",
      code: "const now = new Date();",
      filename: "src/infrastructure/http/http-middleware.ts",
    },
    {
      name: "accepts component construction inside a test file",
      code: "const sample = new Date(2024, 0, 15);",
      filename: "test/unit/incident.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports component construction interpreted in local time",
      code: "const sample = new Date(2024, 0, 15);",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "localDateComponents" }],
    },
    {
      name: "reports component construction with time parts",
      code: "const sample = new Date(2024, 0, 15, 10, 30);",
      filename: "src/infrastructure/persistence/incident-repository.ts",
      errors: [{ messageId: "localDateComponents" }],
    },
    {
      name: "reports component construction in application code",
      code: "const deadline = new Date(year, month, day);",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "localDateComponents" }],
    },
  ],
});
