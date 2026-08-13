import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noMagicNumbers } from "../../../src/rules/quality/no-magic-numbers.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-magic-numbers", noMagicNumbers, {
  valid: [
    {
      name: "accepts zero one and minus one as contextual exceptions",
      code: "const empty = 0; const single = 1; const delta = -1;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a pure literal constant expression",
      code: "const LOGIN_ATTEMPT_LIFETIME_MS = 5 * 60 * 1000;",
      filename: "src/modules/identity/application/browser-session-authentication.ts",
    },
    {
      name: "accepts an enum member initializer",
      code: "enum Schema { Version = 2 }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a type position literal",
      code: "interface Snapshot { readonly version: 2; }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a number inside a test file",
      code: "expect(count).toBe(42);",
      filename: "test/unit/incident.test.ts",
    },
    {
      name: "accepts a number outside domain and application code",
      code: "const port = 3000;",
      filename: "src/infrastructure/http/server.ts",
    },
    {
      name: "accepts a class property initialized with a literal",
      code: "class RetryPolicy { retries = 3; }",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "accepts an object value of one",
      code: "const snapshot = { version: 1 };",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an allowlisted number",
      code: "const valid = value.length === 36;",
      options: [{ allowlist: [36] }],
      filename: "src/modules/incidents/domain/incident-id.ts",
    },
    {
      name: "accepts a negated pure literal constant",
      code: "const NEGATIVE_OFFSET = -5;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a non-numeric literal",
      code: "const untouched = state !== null;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
  ],
  invalid: [
    {
      name: "reports a number in a comparison",
      code: "const exhausted = retries > 3;",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "magicNumber" }],
    },
    {
      name: "reports a number call argument but not the zero beside it",
      code: "const page = list.slice(0, 10);",
      filename: "src/modules/incidents/application/list-community-incidents.ts",
      errors: [{ messageId: "magicNumber" }],
    },
    {
      name: "reports a returned number",
      code: "return 42;",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "magicNumber" }],
    },
    {
      name: "reports a number inside a named expression that is not pure",
      code: "const total = price * 21;",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "magicNumber" }],
    },
    {
      name: "reports a number in a default parameter",
      code: "function publish(retries = 5) {}",
      filename: "src/modules/audit/application/record-audit-event.ts",
      errors: [{ messageId: "magicNumber" }],
    },
    {
      name: "reports a negated number in logic",
      code: "const below = delta === -5;",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "magicNumber" }],
    },
    {
      name: "reports a number inside an object literal in logic",
      code: "return { retries: 3 };",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "magicNumber" }],
    },
    {
      name: "reports a number in a mutable declaration",
      code: "let retries = 5;",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "magicNumber" }],
    },
    {
      name: "reports a number in a destructured default",
      code: "const { limit = 5 } = config;",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "magicNumber" }],
    },
  ],
});
