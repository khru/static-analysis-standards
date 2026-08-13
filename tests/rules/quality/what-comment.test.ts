import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { whatComment } from "../../../src/rules/quality/what-comment.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("what-comment", whatComment, {
  valid: [
    {
      name: "accepts a why comment that explains intent",
      code: "// cache the value for repeated renders\nconst total = items.length;",
      filename: "src/modules/items/domain/item.ts",
    },
    {
      name: "accepts code without comments",
      code: "const total = items.length;",
      filename: "src/modules/items/domain/item.ts",
    },
    {
      name: "accepts a comment with no significant words",
      code: "// ok\nconst total = items.length;",
      filename: "src/modules/items/domain/item.ts",
    },
    {
      name: "accepts a comment with more than eight significant words",
      code: "// collect every input value then compute the final total before returning the result\nconst total = items.length;",
      filename: "src/modules/items/domain/item.ts",
    },
    {
      name: "accepts a comment shorter than the minimum length",
      code: "//\nconst total = items.length;",
      filename: "src/modules/items/domain/item.ts",
    },
    {
      name: "accepts a restating comment inside a test file",
      code: "// total items length\nconst total = items.length;",
      filename: "tests/unit/item.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a comment that only restates the code",
      code: "// total items length\nconst total = items.length;",
      filename: "src/modules/items/domain/item.ts",
      errors: [{ messageId: "whatComment" }],
    },
  ],
});
