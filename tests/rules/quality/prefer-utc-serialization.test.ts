import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { preferUtcSerialization } from "../../../src/rules/quality/prefer-utc-serialization.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("prefer-utc-serialization", preferUtcSerialization, {
  valid: [
    {
      name: "accepts the UTC instant serialization",
      code: "const iso = reportedAt.toISOString();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts the JSON serialization",
      code: "const payload = JSON.stringify(reportedAt.toJSON());",
      filename: "src/infrastructure/http/incidents-router.ts",
    },
    {
      name: "accepts a local serialization inside a test file",
      code: "const text = reportedAt.toDateString();",
      filename: "test/unit/incident.test.ts",
    },
    {
      name: "accepts an unrelated method with a different name",
      code: "const text = record.toReport();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a plain function call",
      code: "const text = serialize(reportedAt);",
      filename: "src/modules/incidents/domain/incident.ts",
    },
  ],
  invalid: [
    {
      name: "reports the local date serialization",
      code: "const text = reportedAt.toDateString();",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "localSerialization" }],
    },
    {
      name: "reports the local time serialization",
      code: "const text = reportedAt.toTimeString();",
      filename: "src/infrastructure/http/incidents-router.ts",
      errors: [{ messageId: "localSerialization" }],
    },
  ],
});
