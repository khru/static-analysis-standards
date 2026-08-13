import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noMixedEffectCategories } from "../../../src/rules/quality/no-mixed-effect-categories.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-mixed-effect-categories", noMixedEffectCategories, {
  valid: [
    {
      name: "accepts a pure query",
      code: "function total(items) { return items.length; }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a pure command",
      code: "function record(entry) { this.entries.push(entry); }",
      filename: "src/modules/audit/application/audit-trail.ts",
    },
    {
      name: "accepts a mutation with a bare return",
      code: "function add(entry) { this.entries.push(entry); return; }",
      filename: "src/modules/audit/application/audit-trail.ts",
    },
    {
      name: "accepts a query whose mutation lives in a nested function",
      code: "function publisher(item) { return () => { queue.push(item); }; }",
      filename: "src/modules/audit/application/record-audit-event.ts",
    },
    {
      name: "accepts a value return beside non mutating calls",
      code: "function snapshot() { return this.state.copy(); }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts mixed effects inside a test file",
      code: "function takeFirst() { this.queue.shift(); return 1; }",
      filename: "test/unit/trail.test.ts",
    },
    {
      name: "accepts mixed effects outside domain and application code",
      code: "function takeFirst() { this.queue.shift(); return 1; }",
      filename: "src/infrastructure/persistence/incident-repository.ts",
    },
  ],
  invalid: [
    {
      name: "reports a mutating call beside a value return",
      code: "function takeFirst() { const head = this.queue.shift(); return head; }",
      filename: "src/modules/audit/application/audit-trail.ts",
      errors: [{ messageId: "mixedEffectCategories" }],
    },
    {
      name: "reports a collection add beside a value return",
      code: "function register(member) { this.members.add(member); return member; }",
      filename: "src/modules/identity/application/community-membership-directory.ts",
      errors: [{ messageId: "mixedEffectCategories" }],
    },
    {
      name: "reports a member assignment beside a value return",
      code: "function update(snapshot) { this.state = snapshot; return snapshot; }",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "mixedEffectCategories" }],
    },
    {
      name: "reports mixed effects inside a method",
      code: "class Trail { record(entry) { this.entries.push(entry); return entry; } }",
      filename: "src/modules/audit/application/audit-trail.ts",
      errors: [{ messageId: "mixedEffectCategories" }],
    },
  ],
});
