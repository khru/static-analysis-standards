import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { preferUtcDateSetters } from "../../../src/rules/quality/prefer-utc-date-setters.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("prefer-utc-date-setters", preferUtcDateSetters, {
  valid: [
    {
      name: "accepts the UTC month setter",
      code: "reportedAt.setUTCMonth(0);",
      filename: "src/infrastructure/persistence/incident-repository.ts",
    },
    {
      name: "accepts the UTC year setter",
      code: "reportedAt.setUTCFullYear(2026);",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a local getter",
      code: "const year = reportedAt.getFullYear();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a local setter inside a test file",
      code: "reportedAt.setMonth(0);",
      filename: "test/unit/incident.test.ts",
    },
    {
      name: "accepts a plain function call",
      code: "const stamp = now();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a computed member call",
      code: 'reportedAt["setMonth"](0);',
      filename: "src/modules/incidents/domain/incident.ts",
    },
  ],
  invalid: [
    {
      name: "reports the local month setter",
      code: "reportedAt.setMonth(0);",
      filename: "src/infrastructure/persistence/incident-repository.ts",
      errors: [{ messageId: "localDateSetter" }],
    },
    {
      name: "reports the local year setter",
      code: "reportedAt.setFullYear(2026);",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "localDateSetter" }],
    },
    {
      name: "reports the local hours setter",
      code: "reportedAt.setHours(9, 0);",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "localDateSetter" }],
    },
    {
      name: "reports both setters in a chained write",
      code: "reportedAt.setDate(1).setSeconds(0);",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "localDateSetter" }, { messageId: "localDateSetter" }],
    },
  ],
});
