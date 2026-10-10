import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";
import { describe } from "vitest";

import { noFallaciousMethodName } from "../../../src/rules/quality/no-fallacious-method-name.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

describe("no-fallacious-method-name", () => {
  ruleTester.run("no-fallacious-method-name", noFallaciousMethodName, {
    valid: [
      "class User { getName() { return this.name; } setName(value) {} save() { return true; } }",
      "class User { setName(value) { return this; } updateName(value) { return this; } }",
      { code: "class User { getName() {} }", filename: "user.test.ts" },
      "class User { ['getName']() {} }",
    ],
    invalid: [
      {
        code: "class User { getName() {} }",
        errors: [{ messageId: "getterWithoutValue", data: { name: "getName" } }],
      },
      {
        code: "class User { setName(value) { return value; } }",
        errors: [{ messageId: "setterWithValue", data: { name: "setName" } }],
      },
    ],
  });
});
