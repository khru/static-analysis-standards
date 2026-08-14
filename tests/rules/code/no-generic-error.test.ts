import { RuleTester } from "@typescript-eslint/rule-tester";

import { noGenericError } from "../../../src/rules/code/no-generic-error.js";

const ruleTester = new RuleTester();

ruleTester.run("no-generic-error", noGenericError, {
  valid: [
    {
      name: "throws a typed error",
      code: "throw new IncidentIdentifierConflict();",
    },
    {
      name: "constructs a typed error as a value",
      code: "const error = new InsufficientFundsError(1, 2);",
    },
    {
      name: "declares a subclass of Error",
      code: "class DomainError extends Error {}",
    },
    {
      name: "calls a plain function",
      code: "notify('ready');",
    },
    {
      name: "allows generic errors thrown by test stubs and fixtures",
      code: "throw new Error('boom');",
      filename: "test/unit/problem-details-factory.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports throw new Error",
      code: "throw new Error('boom');",
      errors: [{ messageId: "genericError" }],
    },
    {
      name: "reports new Error as a value",
      code: "const error = new Error('boom');",
      errors: [{ messageId: "genericError" }],
    },
    {
      name: "reports a bare Error call",
      code: "throw Error('boom');",
      errors: [{ messageId: "genericError" }],
    },
  ],
});

describe("no-generic-error metadata", () => {
  it("should expose its public diagnostic description", () => {
    expect(noGenericError.meta.docs?.description).toContain("generic");
  });
});
