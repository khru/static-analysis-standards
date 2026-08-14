import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noTestControlFlow } from "../../../src/rules/testing/no-test-control-flow.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-test-control-flow", noTestControlFlow, {
  valid: [
    {
      name: "keeps a test case linear",
      code: 'it("returns the incident", () => { const result = sut.run(); expect(result).toBe(1); });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "keeps an it.each case linear",
      code: 'it.each([1, 2, 3])("handles the value %s", (value) => { expect(value).toBeGreaterThan(0); });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "keeps a function-expression test case linear",
      code: 'test("returns the incident", function () { expect(sut.run()).toBe(1); });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "allows control flow in a lifecycle hook",
      code: "beforeEach(() => { for (const row of rows) { seed(row); } });",
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "allows control flow in a module-level helper",
      code: 'function helper() { for (let i = 0; i < 3; i += 1) { run(i); } }\nit("uses the helper", () => { helper(); });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "ignores a test call without a callback",
      code: 'it("is not yet written");',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "ignores control flow in non-test function calls",
      code: "someFunction(() => { if (ready) { run(); } });",
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "ignores a dynamically selected test method",
      code: 'it[method]("...", () => { if (ready) { run(); } });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "ignores a non-test method on the it object",
      code: 'test.todo("...", () => { if (ready) { run(); } });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "ignores a call produced by a non-test function",
      code: 'generate()("...", () => { if (ready) { run(); } });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "ignores production code",
      code: "export function run() { if (ready) { execute(); } }",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "does not inspect a test-like call in production code",
      code: 'it("runs", () => { if (ready) { run(); } });',
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "ignores nested test generation",
      code: 'describe.each([1, 2])("number %s", (number) => { it("works", () => { expect(number).toBe(number); }); });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "allows decision logic inside a collection-transformation predicate",
      code: 'it("observes violations", () => { const violations = dependencies.filter((dependency) => { if (dependency.startsWith("#")) { return true; } return false; }); expect(violations).toEqual([]); });',
      filename: "test/architecture/modular-monolith.test.ts",
    },
    {
      name: "allows a ternary inside a collection-transformation predicate",
      code: 'it("names rows", () => { const names = rows.map((row) => (row.active ? row.name : "inactive")); expect(names).toEqual(["a"]); });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports an if inside a test case",
      code: 'it("returns a value", () => { if (ready) { expect(result).toBe(1); } });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testControlFlow" }],
    },
    {
      name: "reports a for-of loop inside a test case",
      code: 'it("checks every row", () => { for (const item of items) { expect(item).toBe(1); } });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testControlFlow" }],
    },
    {
      name: "reports a ternary inside a test case",
      code: 'it("picks a value", () => { const pick = condition ? a : b; expect(pick).toBe(a); });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testControlFlow" }],
    },
    {
      name: "reports a while loop inside a test case",
      code: 'it("retries", () => { while (retrying) { attempt(); } });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testControlFlow" }],
    },
    {
      name: "reports an if inside an it.each case",
      code: 'it.each([1, 2])("runs %s", (value) => { if (value > 1) { expect(value).toBe(2); } });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testControlFlow" }],
    },
    {
      name: "reports a switch inside a test case",
      code: 'test("dispatches", function () { switch (kind) { case 1: break; } });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testControlFlow" }],
    },
    {
      name: "reports control flow inside a nested test case once",
      code: 'it("outer", () => { it("inner", () => { if (x) { run(); } }); });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testControlFlow" }],
    },
    {
      name: "reports control flow at any non-function depth inside a test case",
      code: 'it("runs", () => { if (ready) { while (retrying) { run(); } } });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testControlFlow" }, { messageId: "testControlFlow" }],
    },
    {
      name: "reports an arrow expression body with a ternary",
      code: 'it("picks a value", () => (condition ? a : b));',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testControlFlow" }],
    },
    {
      name: "reports an if and loop in the same test callback",
      code: 'it("runs", () => { if (ready) { for (const item of items) { run(item); } } });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testControlFlow" }, { messageId: "testControlFlow" }],
    },
  ],
});

describe("no-test-control-flow metadata", () => {
  it("should expose its linear test contract", () => {
    expect(noTestControlFlow.meta.docs?.description).toContain("linear");
  });
});
