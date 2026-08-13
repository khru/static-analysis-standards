import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noStringlyTypedDispatch } from "../../../src/rules/quality/no-stringly-typed-dispatch.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-stringly-typed-dispatch", noStringlyTypedDispatch, {
  valid: [
    {
      name: "accepts a switch over named discriminant members",
      code: "switch (outcome) { case Outcome.Created: break; case Outcome.Existing: break; }",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "accepts a switch with a single string case",
      code: 'switch (kind) { case "created": break; }',
      filename: "src/modules/incidents/application/incident-repository.ts",
    },
    {
      name: "accepts a single string comparison",
      code: 'const active = kind === "active";',
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an if chain comparing different operands",
      code: 'if (a === "x") {} else if (b === "y") {}',
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an if chain over numbers",
      code: "if (n === 1) {} else if (n === 2) {}",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an if chain against named constants",
      code: "if (kind === ACTIVE) {} else if (kind === DENIED) {}",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an if chain whose comparisons are empty strings",
      code: 'if (state === "") {} else if (next === "") {}',
      filename: "src/modules/identity/application/browser-session-authentication.ts",
    },
    {
      name: "accepts a string dispatch inside a test file",
      code: 'switch (kind) { case "a": break; case "b": break; }',
      filename: "test/unit/dispatch.test.ts",
    },
    {
      name: "accepts a block form else branch because only direct else-if chains are dispatch",
      code: 'if (kind === "a") {} else { if (kind === "b") {} }',
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an if chain that is not an equality comparison",
      code: "if (kind) {} else if (other) {}",
      filename: "src/modules/incidents/domain/incident.ts",
    },
  ],
  invalid: [
    {
      name: "reports a switch keyed on string literals",
      code: 'switch (kind) { case "created": break; case "existing": break; }',
      filename: "src/modules/incidents/application/incident-repository.ts",
      errors: [{ messageId: "stringSwitchDispatch" }],
    },
    {
      name: "reports a string switch that also has a default branch",
      code: 'switch (kind) { case "a": break; case "b": break; default: break; }',
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "stringSwitchDispatch" }],
    },
    {
      name: "reports an else-if chain keyed on string literals",
      code: 'if (kind === "active") {} else if (kind === "denied") {}',
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "stringIfChainDispatch" }],
    },
    {
      name: "reports a long else-if chain keyed on string literals",
      code: 'if (kind === "a") {} else if (kind === "b") {} else if (kind === "c") {}',
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "stringIfChainDispatch" }],
    },
    {
      name: "reports an else-if chain that mixes negated and direct comparisons",
      code: 'if (kind !== "active") {} else if (kind === "denied") {}',
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "stringIfChainDispatch" }],
    },
    {
      name: "reports an else-if chain with the string literal on the left",
      code: 'if ("active" === kind) {} else if ("denied" === kind) {}',
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "stringIfChainDispatch" }],
    },
    {
      name: "reports an else-if chain keyed on loose not-equal comparisons",
      code: 'if (kind != "active") {} else if (kind != "denied") {}',
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "stringIfChainDispatch" }],
    },
  ],
});
