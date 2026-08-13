import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noGettersSetters } from "../../../src/rules/quality/no-getters-setters.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-getters-setters", noGettersSetters, {
  valid: [
    {
      name: "accepts a class with commands and queries only",
      code: "class Account { balance() { return this.total; } }",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts an accessor outside domain and application code",
      code: "class Repository { get items() { return this.list; } }",
      filename: "src/infrastructure/repositories/item-repository.ts",
    },
    {
      name: "accepts an accessor inside a test file",
      code: "class Fixture { get value() { return this.stored; } }",
      filename: "tests/unit/fixture.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a getter in domain code",
      code: "class Account { get balance() { return this.total; } }",
      filename: "src/modules/accounts/domain/account.ts",
      errors: [{ messageId: "accessor" }],
    },
    {
      name: "reports a setter in application code",
      code: "class Account { set name(value) { this.label = value; } }",
      filename: "src/modules/accounts/application/account-service.ts",
      errors: [{ messageId: "accessor" }],
    },
  ],
});
