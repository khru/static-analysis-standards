import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noAmbientClock } from "../../../src/rules/domain/no-ambient-clock.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-ambient-clock", noAmbientClock, {
  valid: [
    {
      name: "constructs a date from an injected clock value",
      code: "const created = new Date(reportedAt);",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "reads time through the injected clock",
      code: "return this.clock.now();",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "bare date in infrastructure is out of domain scope",
      code: "const now = new Date();",
      filename: "src/infrastructure/http/http-middleware.ts",
    },
  ],
  invalid: [
    {
      name: "reports bare new Date in domain",
      code: "const now = new Date();",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "ambientClock" }],
    },
    {
      name: "reports Date.now in application",
      code: "const now = Date.now();",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "ambientClock" }],
    },
  ],
});
