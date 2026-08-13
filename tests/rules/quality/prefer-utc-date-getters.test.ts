import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { preferUtcDateGetters } from "../../../src/rules/quality/prefer-utc-date-getters.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("prefer-utc-date-getters", preferUtcDateGetters, {
  valid: [
    {
      name: "accepts the UTC year getter",
      code: "const year = reportedAt.getUTCFullYear();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts the UTC day getter",
      code: "const day = reportedAt.getUTCDay();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts the instant getter",
      code: "const epochMs = reportedAt.getTime();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a local setter",
      code: "reportedAt.setMonth(0);",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a local getter inside a test file",
      code: "const year = reportedAt.getFullYear();",
      filename: "test/unit/incident.test.ts",
    },
    {
      name: "accepts a plain function call",
      code: "const stamp = now();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
  ],
  invalid: [
    {
      name: "reports the local year getter as a review candidate",
      code: "const year = reportedAt.getFullYear();",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "localDateGetter" }],
    },
    {
      name: "reports the local month getter",
      code: "const month = reportedAt.getMonth();",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "localDateGetter" }],
    },
    {
      name: "reports the local hours getter",
      code: "const hours = reportedAt.getHours();",
      filename: "src/infrastructure/http/incidents-router.ts",
      errors: [{ messageId: "localDateGetter" }],
    },
    {
      name: "reports both getters in a day comparison",
      code: "const sameDay = a.getDay() === b.getDay();",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "localDateGetter" }, { messageId: "localDateGetter" }],
    },
  ],
});
