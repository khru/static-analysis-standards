import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";
import { describe } from "vitest";

import { noTypeEmbeddedInName } from "../../../src/rules/quality/no-type-embedded-in-name.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

describe("no-type-embedded-in-name", () => {
  ruleTester.run("no-type-embedded-in-name", noTypeEmbeddedInName, {
    valid: [
      "const date: string = '2026-01-01';",
      "const userId: UserId = value;",
      "const items: Item[] = values;",
      "const names: ReadonlyArray<string> = values;",
      "const lookup: Map<string, User> = values;",
      "const selected: Set<string> = values;",
      "const namespaced: Namespace.Map<string, User> = values;",
      "const read = ({ value }: Input) => value;",
      "const transform = function ({ value }: Input) { return value; };",
      "function read({ value }: Input) { return value; }",
      "class Catalog { ['usersArray']: User[] = []; untyped = value; }",
      { code: "const dateString: string = value;", filename: "date.test.ts" },
    ],
    invalid: [
      {
        code: "const dateString: string = value;",
        errors: [{ messageId: "typeEmbedded", data: { name: "dateString", type: "string" } }],
      },
      {
        code: "function parse(valueNumber: number) { return valueNumber; }",
        errors: [{ messageId: "typeEmbedded", data: { name: "valueNumber", type: "number" } }],
      },
      {
        code: "const parse = (valueBoolean: boolean) => valueBoolean;",
        errors: [{ messageId: "typeEmbedded", data: { name: "valueBoolean", type: "boolean" } }],
      },
      {
        code: "const parse = function (valueArray: string[]) { return valueArray; };",
        errors: [{ messageId: "typeEmbedded", data: { name: "valueArray", type: "array" } }],
      },
      {
        code: "const enabledBoolean: boolean = true;",
        errors: [{ messageId: "typeEmbedded", data: { name: "enabledBoolean", type: "boolean" } }],
      },
      {
        code: "const userList: User[] = values;",
        errors: [{ messageId: "typeEmbedded", data: { name: "userList", type: "array" } }],
      },
      {
        code: "const userMap: Map<string, User> = values;",
        errors: [{ messageId: "typeEmbedded", data: { name: "userMap", type: "map" } }],
      },
      {
        code: "const userSet: Set<User> = values;",
        errors: [{ messageId: "typeEmbedded", data: { name: "userSet", type: "set" } }],
      },
      {
        code: "class Users { usersArray: User[] = []; }",
        errors: [{ messageId: "typeEmbedded", data: { name: "usersArray", type: "array" } }],
      },
    ],
  });
});
