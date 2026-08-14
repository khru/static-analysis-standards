import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noAmbientRandomness } from "../../../src/rules/domain/no-ambient-randomness.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-ambient-randomness", noAmbientRandomness, {
  valid: [
    {
      name: "uses an injected identifier generator",
      code: "return this.identifiers.generateIncidentId();",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "randomness in infrastructure is out of domain scope",
      code: "const id = crypto.randomUUID();",
      filename: "src/infrastructure/security/random-token.ts",
    },
    {
      name: "uses a non-random Math method",
      code: "const rounded = Math.round(value);",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "calls the result of an injected generator",
      code: "const id = generateId()();",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "calls a method on an injected object",
      code: "const id = identifiers.next();",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "does not report a different crypto method",
      code: "const id = crypto.randomFillSync(buffer);",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "does not report a random method on another object",
      code: "const id = generator.randomUUID();",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
  ],
  invalid: [
    {
      name: "reports Math.random in domain",
      code: "const pick = Math.random();",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "ambientRandomness" }],
    },
    {
      name: "reports crypto.randomUUID in application",
      code: "const id = crypto.randomUUID();",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "ambientRandomness" }],
    },
    {
      name: "reports a bare randomUUID call in application",
      code: "const id = randomUUID();",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "ambientRandomness" }],
    },
    {
      name: "reports crypto.getRandomValues in application",
      code: "const bytes = crypto.getRandomValues(new Uint8Array(16));",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "ambientRandomness" }],
    },
  ],
});

describe("no-ambient-randomness metadata", () => {
  it("should expose its diagnostic description", () => {
    expect(noAmbientRandomness.meta.docs?.description).toContain("randomness");
  });
});
