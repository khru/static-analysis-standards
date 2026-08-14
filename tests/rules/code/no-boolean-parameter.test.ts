import { RuleTester } from "@typescript-eslint/rule-tester";

import { noBooleanParameter } from "../../../src/rules/code/no-boolean-parameter.js";

const ruleTester = new RuleTester();

ruleTester.run("no-boolean-parameter", noBooleanParameter, {
  valid: [
    {
      name: "boolean return type is not a flag parameter",
      code: "items.filter((item) => item.active);",
    },
    {
      name: "boolean field is not a parameter",
      code: "class Flag { private active = true; }",
    },
    {
      name: "boolean in an object type is not a parameter",
      code: "type Options = { quiet: boolean };",
    },
    {
      name: "non-boolean parameter is allowed",
      code: "function send(user: string, retries: number) {}",
    },
    {
      name: "a destructured parameter is not a flag",
      code: "function send({ user }: { user: string }) {}",
    },
  ],
  invalid: [
    {
      name: "reports a boolean flag on a function declaration",
      code: "function send(user: string, urgent: boolean) {}",
      errors: [{ messageId: "booleanParameter", data: { name: "urgent" } }],
    },
    {
      name: "reports a boolean flag on a method",
      code: "class Mailer { send(user: string, urgent: boolean) {} }",
      errors: [{ messageId: "booleanParameter", data: { name: "urgent" } }],
    },
    {
      name: "reports a boolean flag on a constructor parameter property",
      code: "class Flag { constructor(private readonly force: boolean) {} }",
      errors: [{ messageId: "booleanParameter", data: { name: "force" } }],
    },
    {
      name: "reports a boolean flag with a default value",
      code: "function send(user: string, urgent: boolean = false) {}",
      errors: [{ messageId: "booleanParameter", data: { name: "urgent" } }],
    },
  ],
});

describe("no-boolean-parameter metadata", () => {
  it("should expose its public diagnostic description", () => {
    expect(noBooleanParameter.meta.docs?.description).toContain("boolean");
  });
});
