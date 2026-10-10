import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noPublicMutableProperties } from "../../../src/rules/quality/no-public-mutable-properties.js";

const ruleTester = new RuleTester({ languageOptions: { parser: tseslint.parser } });

ruleTester.run("no-public-mutable-properties", noPublicMutableProperties, {
  valid: [
    {
      name: "accepts readonly public state",
      code: "class Account { readonly owner = ''; }",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts private and protected mutable state",
      code: "class Account { private balance = 0; protected owner = ''; }",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a static field because this rule protects instance boundaries",
      code: "class Account { static registry = new Map(); }",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts infrastructure state",
      code: "class Account { balance = 0; }",
      filename: "src/infrastructure/account.ts",
    },
    {
      name: "accepts mutable state in tests",
      code: "class Account { balance = 0; }",
      filename: "tests/account.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports an implicit public mutable property",
      code: "class Account { balance = 0; }",
      filename: "src/modules/accounts/domain/account.ts",
      errors: [{ messageId: "exposed", data: { name: "balance" } }],
    },
    {
      name: "reports an explicitly public mutable property",
      code: "class Account { public owner = ''; }",
      filename: "src/modules/accounts/application/account-service.ts",
      errors: [{ messageId: "exposed", data: { name: "owner" } }],
    },
  ],
});
