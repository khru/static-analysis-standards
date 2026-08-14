import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noDateConstructionOutsideClock } from "../../../src/rules/code/no-date-construction-outside-clock.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-date-construction-outside-clock", noDateConstructionOutsideClock, {
  valid: [
    {
      name: "constructs a date from an injected value",
      code: "const created = new Date(reportedAt);",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "reads time inside the clock file",
      code: "return new Date();",
      filename: "src/shared/clock.ts",
    },
    {
      name: "reads time in a test file",
      code: "const now = new Date();",
      filename: "test/unit/clock.test.ts",
    },
    {
      name: "reads time inside a clock adapter",
      code: "return Date.now();",
      filename: "src/infrastructure/configuration/system-clock.ts",
    },
    {
      name: "constructs a dated value from an argument in infrastructure",
      code: "const created = new Date(reportedAt);",
      filename: "src/infrastructure/persistence/incident-repository.ts",
    },
    {
      name: "calls a method on a date value in infrastructure",
      code: "const iso = reportedAt.toISOString();",
      filename: "src/infrastructure/persistence/incident-repository.ts",
    },
  ],
  invalid: [
    {
      name: "reports bare new Date outside the clock",
      code: "const now = new Date();",
      filename: "src/infrastructure/http/http-middleware.ts",
      errors: [{ messageId: "ambientDate" }],
    },
    {
      name: "reports Date.now outside the clock",
      code: "return Date.now();",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "ambientDate" }],
    },
  ],
});

describe("no-date-construction-outside-clock metadata", () => {
  it("should expose its public diagnostic description", () => {
    expect(noDateConstructionOutsideClock.meta.docs?.description).toContain("date");
  });
});
