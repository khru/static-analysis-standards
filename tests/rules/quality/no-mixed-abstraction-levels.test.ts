import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noMixedAbstractionLevels } from "../../../src/rules/quality/no-mixed-abstraction-levels.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-mixed-abstraction-levels", noMixedAbstractionLevels, {
  valid: [
    {
      name: "accepts naming a collaborator result and returning it",
      code: "function represents(report) { const current = this.snapshot(); return current.id === report.id; }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a body of inline comparisons",
      code: "function hasInvalidLifecycle(snapshot) { const updatedBeforeCreation = snapshot.updatedAt < snapshot.createdAt; return updatedBeforeCreation; }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts orchestration of named collaborators",
      code: "function publish(event) { validate(event); this.outbox.append(event); }",
      filename: "src/modules/audit/application/record-audit-event.ts",
    },
    {
      name: "accepts awaiting a collaborator and branching on its outcome",
      code: "async function report(command) { const outcome = await this.transaction.execute(command); if (outcome.denied) throw new Denied(); return outcome.incident; }",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "accepts naming collaborator results and issuing commands without inline computation",
      code: "async function completeLogin(url) { const state = this.requireCallbackState(url); const attempt = await this.sessions.consumeLoginAttempt(state); await this.sessions.saveSession(attempt); this.sessionActivity.recordSessionActive(); return state; }",
      filename: "src/modules/identity/application/browser-session-authentication.ts",
    },
    {
      name: "accepts constructing data then persisting it",
      code: "async function beginLogin() { const attempt = { state: this.secrets.createAuthorizationState(), nonce: this.secrets.createNonce() }; await this.sessions.saveLoginAttempt(attempt); return attempt; }",
      filename: "src/modules/identity/application/browser-session-authentication.ts",
    },
    {
      name: "accepts a typed error class constructor that wires super and the name catalog",
      code: 'class InvalidCommunityId extends Error { public constructor() { super("CommunityId cannot be empty"); this.name = "InvalidCommunityId"; } }',
      filename: "src/incidents/domain/invalid-community-id.ts",
    },
    {
      name: "accepts a consistent primitive loop",
      code: "function sum(items) { let total = 0; for (const item of items) { total += item.price; } return total; }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts mixed levels inside a test file",
      code: "function summarize(report) { const ratio = report.denied / report.total; publish(report); return ratio; }",
      filename: "test/unit/summary.test.ts",
    },
    {
      name: "accepts mixed levels outside domain and application code",
      code: "function summarize(report) { const ratio = report.denied / report.total; publish(report); return ratio; }",
      filename: "src/infrastructure/http/metrics.ts",
    },
    {
      name: "accepts a declaration without an initializer and a later assignment",
      code: "function track() { let total; total = 0; return total; }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts constructing a collaborator",
      code: "function boot() { new Configuration(); }",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "accepts an update expression statement",
      code: "function tick() { this.ticks++; }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a concise body arrow function",
      code: "const pick = (entry) => entry.id;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
  ],
  invalid: [
    {
      name: "reports an inline computation beside a collaborator call",
      code: "function summarize(report) { const ratio = report.denied / report.total; publish(report); return ratio; }",
      filename: "src/modules/audit/application/audit-trail.ts",
      errors: [{ messageId: "mixedAbstractionLevels" }],
    },
    {
      name: "reports a collaborator call beside a manual loop",
      code: "function collect(entries) { audit(entries); const names = []; for (const entry of entries) { names.push(entry.name); } return names; }",
      filename: "src/modules/audit/application/audit-event-recorder.ts",
      errors: [{ messageId: "mixedAbstractionLevels" }],
    },
    {
      name: "reports mixed levels inside a method",
      code: "class Reporter { build(entry) { const ratio = this.base + this.delta; this.lines.push(ratio); return ratio; } }",
      filename: "src/modules/audit/application/audit-event-recorder.ts",
      errors: [{ messageId: "mixedAbstractionLevels" }],
    },
    {
      name: "reports a collaborator naming beside inline computation",
      code: "function enrich(entry) { const stamp = this.clock.now(); const label = stamp + '-' + entry.id; return label; }",
      filename: "src/modules/audit/application/audit-event-recorder.ts",
      errors: [{ messageId: "mixedAbstractionLevels" }],
    },
  ],
});
