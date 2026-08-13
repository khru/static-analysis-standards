import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { preferIntlDateFormatting } from "../../../src/rules/quality/prefer-intl-date-formatting.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("prefer-intl-date-formatting", preferIntlDateFormatting, {
  valid: [
    {
      name: "accepts an explicit Intl formatter with a fixed time zone",
      code: 'const formatter = new Intl.DateTimeFormat("es", { timeZone: "UTC" });',
      filename: "src/modules/incidents/application/list-community-incidents.ts",
    },
    {
      name: "accepts the UTC instant serialization",
      code: "const iso = reportedAt.toISOString();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts locale formatting inside a test file",
      code: 'const text = reportedAt.toLocaleDateString("es");',
      filename: "test/unit/incident.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports locale date formatting with a hidden local time zone",
      code: 'const text = reportedAt.toLocaleDateString("es");',
      filename: "src/modules/incidents/application/list-community-incidents.ts",
      errors: [{ messageId: "localeFormatting" }],
    },
    {
      name: "reports locale time formatting",
      code: "const text = reportedAt.toLocaleTimeString();",
      filename: "src/infrastructure/http/incidents-router.ts",
      errors: [{ messageId: "localeFormatting" }],
    },
    {
      name: "reports the generic locale formatting",
      code: "const text = reportedAt.toLocaleString();",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "localeFormatting" }],
    },
  ],
});
