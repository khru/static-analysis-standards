import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { preferDataDrivenDispatch } from "../../../src/rules/quality/prefer-data-driven-dispatch.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("prefer-data-driven-dispatch", preferDataDrivenDispatch, {
  valid: [
    {
      name: "accepts a switch whose cases perform side effects",
      code: 'switch (kind) { case "a": publish(); break; case "b": record(); break; }',
      filename: "src/modules/incidents/application/incident-repository.ts",
    },
    {
      name: "accepts a switch with multi statement cases",
      code: 'switch (kind) { case "a": log(); return handlerA; }',
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a switch with a single case",
      code: 'switch (kind) { case "a": return handlerA; }',
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an empty switch",
      code: "switch (kind) {}",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a mapping switch inside a test file",
      code: 'switch (kind) { case "a": return 1; case "b": return 2; }',
      filename: "test/unit/dispatch.test.ts",
    },
    {
      name: "accepts a switch whose default branch is not a single return",
      code: 'switch (kind) { case "a": return 1; default: break; }',
      filename: "src/modules/incidents/domain/incident.ts",
    },
  ],
  invalid: [
    {
      name: "reports a switch that maps every case to a return",
      code: 'switch (kind) { case "a": return handlerA; case "b": return handlerB; }',
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "mappingSwitch" }],
    },
    {
      name: "reports a mapping switch whose cases return calls",
      code: 'switch (kind) { case "a": return handleA(); case "b": return handleB(); }',
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "mappingSwitch" }],
    },
    {
      name: "reports a mapping switch with a single return default",
      code: 'switch (kind) { case "a": return 1; default: return 0; }',
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "mappingSwitch" }],
    },
  ],
});
