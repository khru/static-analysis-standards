import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noMagicStrings } from "../../../src/rules/quality/no-magic-strings.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-magic-strings", noMagicStrings, {
  valid: [
    {
      name: "accepts a string extracted into a named constant",
      code: 'const DISCRIMINANT = "incident-created";',
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an object literal value as data",
      code: 'const snapshot = { status: "reported" };',
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a quoted object property key",
      code: 'const headers = { "x-request-id": requestId };',
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "accepts an array of strings as a data list",
      code: 'const outcomes = ["denied", "succeeded"];',
      filename: "src/modules/audit/domain/audit-outcome.ts",
    },
    {
      name: "accepts a type position literal",
      code: 'type Status = "reported";',
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an interface literal member",
      code: 'interface Snapshot { readonly status: "reported"; }',
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an enum member initializer",
      code: 'enum Outcome { Created = "created" }',
      filename: "src/modules/incidents/application/incident-repository.ts",
    },
    {
      name: "accepts an import specifier",
      code: 'import { Incident } from "./incident.js";',
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "accepts the empty string",
      code: 'const untouched = state === "";',
      filename: "src/modules/identity/application/browser-session-authentication.ts",
    },
    {
      name: "accepts a string inside a test file",
      code: 'const got = render("magic");',
      filename: "test/unit/incident.test.ts",
    },
    {
      name: "accepts a string outside domain and application code",
      code: 'const path = "/v1/incidents";',
      filename: "src/infrastructure/http/incidents-router.ts",
    },
    {
      name: "accepts a string inside a class property initializer",
      code: 'class AuditOutcome { public static readonly denied = new AuditOutcome("denied"); }',
      filename: "src/modules/audit/domain/audit-outcome.ts",
    },
    {
      name: "accepts a template literal",
      code: "const label = `incident-${id}`;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an allowlisted string",
      code: 'const state = params.get("state");',
      options: [{ allowlist: ["state"] }],
      filename: "src/modules/identity/application/browser-session-authentication.ts",
    },
    {
      name: "accepts a numeric literal",
      code: "const retries = 5;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts the name of a typed error class",
      code: 'class InvalidCommunityId extends Error { public constructor() { this.name = "InvalidCommunityId"; } }',
      filename: "src/incidents/domain/invalid-community-id.ts",
    },
    {
      name: "accepts the name of a typed error class through a nested scope",
      code: 'class InvalidCommunityId extends Error { public constructor() { const assignName = () => { this.name = "InvalidCommunityId"; }; assignName(); } }',
      filename: "src/incidents/domain/invalid-community-id.ts",
    },
    {
      name: "accepts a Symbol description argument",
      code: 'export const InvalidIncidentIdCode: unique symbol = Symbol("InvalidIncidentId");',
      filename: "src/modules/incidents/domain/invalid-incident-id.ts",
    },
  ],
  invalid: [
    {
      name: "reports a string comparison in domain logic",
      code: 'const active = status === "active";',
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "magicString" }],
    },
    {
      name: "reports a string call argument in application logic",
      code: 'const state = callbackUrl.searchParams.get("state");',
      filename: "src/modules/identity/application/browser-session-authentication.ts",
      errors: [{ messageId: "magicString" }],
    },
    {
      name: "reports a returned string",
      code: 'return "denied";',
      filename: "src/modules/audit/domain/audit-outcome.ts",
      errors: [{ messageId: "magicString" }],
    },
    {
      name: "reports a string assignment",
      code: 'outcome = "failed";',
      filename: "src/modules/audit/application/record-audit-event.ts",
      errors: [{ messageId: "magicString" }],
    },
    {
      name: "reports both branches of a conditional expression",
      code: 'const label = ok ? "yes" : "no";',
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "magicString" }, { messageId: "magicString" }],
    },
    {
      name: "reports a string concatenation operand",
      code: 'const key = "incident-" + id;',
      filename: "src/modules/incidents/domain/incident-id.ts",
      errors: [{ messageId: "magicString" }],
    },
    {
      name: "reports a default parameter value",
      code: 'function publish(kind = "event") {}',
      filename: "src/modules/audit/application/record-audit-event.ts",
      errors: [{ messageId: "magicString" }],
    },
    {
      name: "reports a switch case test",
      code: 'switch (kind) { case "created": break; }',
      filename: "src/modules/incidents/application/incident-repository.ts",
      errors: [{ messageId: "magicString" }],
    },
    {
      name: "reports a string used as a destructuring source",
      code: 'const { length } = "incident";',
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "magicString" }],
    },
    {
      name: "reports the message literal of a typed error class",
      code: 'class InvalidCommunityId extends Error { public constructor() { super("CommunityId cannot be empty"); } }',
      filename: "src/incidents/domain/invalid-community-id.ts",
      errors: [{ messageId: "magicString" }],
    },
    {
      name: "reports a logic string inside a typed error class outside the catalog positions",
      code: 'class InvalidCommunityId extends Error { public constructor() { if (kind === "active") { this.name = "InvalidCommunityId"; } } }',
      filename: "src/incidents/domain/invalid-community-id.ts",
      errors: [{ messageId: "magicString" }],
    },
    {
      name: "reports a name assignment outside a typed error class",
      code: 'class Community { public constructor() { this.name = "Community"; } }',
      filename: "src/incidents/domain/community.ts",
      errors: [{ messageId: "magicString" }],
    },
  ],
});
