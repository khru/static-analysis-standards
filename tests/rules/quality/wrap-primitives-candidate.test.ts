import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { wrapPrimitivesCandidate } from "../../../src/rules/quality/wrap-primitives-candidate.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("wrap-primitives-candidate", wrapPrimitivesCandidate, {
  valid: [
    {
      name: "accepts a property typed with a value object type",
      code: "class Money { amount: MoneyAmount; }",
      filename: "src/modules/money/domain/money.ts",
    },
    {
      name: "accepts a property without a type annotation",
      code: "class Account { balance; }",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a primitive-typed constructor parameter",
      code: "class Money { constructor(amount: number) {} }",
      filename: "src/modules/money/domain/money.ts",
    },
    {
      name: "accepts a primitive-typed property outside domain and application code",
      code: "class Config { env: string; }",
      filename: "src/infrastructure/config/config.ts",
    },
    {
      name: "accepts a primitive-typed property inside a test file",
      code: "class Fixture { label: string; }",
      filename: "tests/unit/fixture.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a string-typed class property",
      code: "class Account { status: string; }",
      filename: "src/modules/accounts/domain/account.ts",
      errors: [{ messageId: "primitiveProperty" }],
    },
    {
      name: "reports a number-typed interface member",
      code: "interface LineItem { quantity: number; }",
      filename: "src/modules/orders/domain/line-item.ts",
      errors: [{ messageId: "primitiveProperty" }],
    },
    {
      name: "reports a boolean-typed class property",
      code: "class Feature { enabled: boolean; }",
      filename: "src/modules/features/domain/feature.ts",
      errors: [{ messageId: "primitiveProperty" }],
    },
    {
      name: "reports a quoted-key interface member",
      code: 'interface Config { "region": string; }',
      filename: "src/modules/config/domain/config.ts",
      errors: [{ messageId: "primitiveProperty" }],
    },
  ],
});
