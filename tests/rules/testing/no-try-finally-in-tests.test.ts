import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noTryFinallyInTests } from "../../../src/rules/testing/no-try-finally-in-tests.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-try-finally-in-tests", noTryFinallyInTests, {
  valid: [
    {
      name: "keeps a test case without any try statement",
      code: 'it("returns the incident", () => { const result = sut.run(); expect(result).toBe(1); });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "allows try and catch without a finally block",
      code: 'it("surfaces the error", () => { try { sut.run(); } catch (error) { expect(error).toBeDefined(); } });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "allows try and finally in a module-level driver helper",
      code: 'async function withClient(operation) { const client = await pool.connect(); try { return await operation(client); } finally { client.release(); } }\nit("runs", async () => { await withClient(run); });',
      filename: "test/integration/postgresql-community-isolation.test.ts",
    },
    {
      name: "allows try and finally in a lifecycle hook",
      code: "afterAll(() => { try { dispose(); } finally { reset(); } });",
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "ignores a test call without a callback",
      code: 'it("is not yet written");',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "ignores production code",
      code: "export function run() { try { execute(); } finally { cleanUp(); } }",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "ignores control flow in non-test function calls",
      code: "someFunction(() => { try { run(); } finally { reset(); } });",
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "allows try/finally inside a collection-transformation predicate",
      code: 'it("filters rows", () => { const kept = rows.filter((row) => { try { return keep(row); } finally { markSeen(row); } }); expect(kept).toEqual([]); });',
      filename: "test/unit/incidents/report-incident.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports try and finally inside a test case",
      code: 'it("runs the cleanup", () => { try { doThing(); } finally { resetState(); } });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testTryFinally" }],
    },
    {
      name: "reports try, catch and finally inside a test case",
      code: 'test("runs the cleanup", function () { try { doThing(); } catch (error) { handle(error); } finally { resetState(); } });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testTryFinally" }],
    },
    {
      name: "reports try and finally inside an it.each case",
      code: 'it.each([1, 2])("runs %s", (value) => { try { run(value); } finally { reset(); } });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testTryFinally" }],
    },
    {
      name: "reports a nested finally inside a nested test case once",
      code: 'it("outer", () => { it("inner", () => { try { run(); } finally { reset(); } }); });',
      filename: "test/unit/incidents/report-incident.test.ts",
      errors: [{ messageId: "testTryFinally" }],
    },
  ],
});
