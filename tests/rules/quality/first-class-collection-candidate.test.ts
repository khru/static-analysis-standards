import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { firstClassCollectionCandidate } from "../../../src/rules/quality/first-class-collection-candidate.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("first-class-collection-candidate", firstClassCollectionCandidate, {
  valid: [
    {
      name: "accepts a class with a single non-collection field",
      code: "class Money { amount: number; }",
      filename: "src/modules/money/domain/money.ts",
    },
    {
      name: "accepts a class with a single untyped field",
      code: "class Basket { items; }",
      filename: "src/modules/basket/domain/basket.ts",
    },
    {
      name: "accepts a class with several fields",
      code: "class Basket { items: string[]; owner: string; }",
      filename: "src/modules/basket/domain/basket.ts",
    },
    {
      name: "accepts a single field typed with a plain reference",
      code: "class Basket { status: StatusCode; }",
      filename: "src/modules/basket/domain/basket.ts",
    },
    {
      name: "accepts a single field typed with a qualified reference",
      code: "class Basket { state: Models.State; }",
      filename: "src/modules/basket/domain/basket.ts",
    },
    {
      name: "accepts a single collection field outside domain and application code",
      code: "class Basket { items: string[]; }",
      filename: "src/infrastructure/baskets/basket.ts",
    },
    {
      name: "accepts a single collection field inside a test file",
      code: "class Basket { items: string[]; }",
      filename: "tests/unit/basket.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a class whose only field is an array",
      code: "class Basket { items: string[]; }",
      filename: "src/modules/basket/domain/basket.ts",
      errors: [{ messageId: "singleRawCollection" }],
    },
    {
      name: "reports a class whose only field is a tuple",
      code: "class Pair { values: [string, number]; }",
      filename: "src/modules/pair/domain/pair.ts",
      errors: [{ messageId: "singleRawCollection" }],
    },
    {
      name: "reports a class whose only field is a map",
      code: "class Registry { entries: Map<string, number>; }",
      filename: "src/modules/registry/domain/registry.ts",
      errors: [{ messageId: "singleRawCollection" }],
    },
    {
      name: "reports a class expression whose only field is a set",
      code: "const registry = class { items: Set<string>; };",
      filename: "src/modules/registry/domain/registry.ts",
      errors: [{ messageId: "singleRawCollection" }],
    },
  ],
});
