import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";
import { expect, it } from "vitest";

import { maxTwoInstanceVariables } from "../../../src/rules/quality/max-two-instance-variables.js";

const ruleTester = new RuleTester({ languageOptions: { parser: tseslint.parser } });

it("publishes the review-contract metadata", () => {
  expect(maxTwoInstanceVariables.meta).toEqual({
    type: "suggestion",
    docs: {
      description:
        "Reports domain and application classes with more than two instance variables. Review candidate: apply the Object Calisthenics state-size constraint when it improves cohesion.",
    },
    messages: {
      tooMany:
        "Review candidate: this class holds {{count}} instance variables. Object Calisthenics keeps state small so each object has a focused responsibility; group cohesive state into a value object or split the class.",
    },
    schema: [],
  });
});

ruleTester.run("max-two-instance-variables", maxTwoInstanceVariables, {
  valid: [
    {
      name: "accepts two cohesive state fields",
      code: "class Account { balance = 0; owner = ''; }",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts state outside a domain or application file",
      code: "class Account { balance = 0; owner = ''; opened = new Date(); }",
      filename: "src/infrastructure/account.ts",
    },
    {
      name: "accepts many fields in a test",
      code: "class Account { balance = 0; owner = ''; opened = new Date(); }",
      filename: "tests/account.test.ts",
    },
    {
      name: "does not count static fields",
      code: "class Account { static kind = 'account'; balance = 0; owner = ''; }",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "does not count methods as instance variables",
      code: "class Account { balance = 0; owner = ''; describe() { return this.owner; } }",
      filename: "src/modules/accounts/domain/account.ts",
    },
  ],
  invalid: [
    {
      name: "flags three fields as a review candidate",
      code: "class Account { balance = 0; owner = ''; opened = new Date(); describe() { return this.owner; } }",
      filename: "src/modules/accounts/domain/account.ts",
      errors: [{ messageId: "tooMany", data: { count: 3 } }],
    },
    {
      name: "flags a class expression with three fields",
      code: "const account = class { balance = 0; owner = ''; opened = new Date(); };",
      filename: "src/modules/accounts/application/account-service.ts",
      errors: [{ messageId: "tooMany", data: { count: 3 } }],
    },
  ],
});
