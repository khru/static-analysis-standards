import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { middleMan } from "../../../src/rules/quality/middle-man.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("middle-man", middleMan, {
  valid: [
    {
      name: "accepts a method that does real work before delegating",
      code: "class Wrapper { delegate; save() { this.delegate.validate(); return this.delegate.save(); } }",
      filename: "src/modules/wrapper/application/wrapper.ts",
    },
    {
      name: "accepts a method that composes its result",
      code: 'class Facade { delegate; save() { const result = this.delegate.save(); return result ?? "ok"; } }',
      filename: "src/modules/facade/application/facade.ts",
    },
    {
      name: "accepts a method whose only statement is not a return",
      code: "class Wrapper { delegate; run() { this.delegate.emit(); } }",
      filename: "src/modules/wrapper/application/wrapper.ts",
    },
    {
      name: "accepts a method that returns without an argument",
      code: "class Wrapper { delegate; run() { return; } }",
      filename: "src/modules/wrapper/application/wrapper.ts",
    },
    {
      name: "accepts an overload signature without a body",
      code: "class Wrapper { delegate; run(): string; }",
      filename: "src/modules/wrapper/application/wrapper.ts",
    },
    {
      name: "accepts a getter",
      code: "class Wrapper { delegate; get label() { return this.delegate.label; } }",
      filename: "src/modules/wrapper/domain/wrapper.ts",
    },
    {
      name: "accepts a static method",
      code: "class Wrapper { static run() { return service.call(); } }",
      filename: "src/modules/wrapper/application/wrapper.ts",
    },
    {
      name: "accepts a method with a computed key",
      code: 'class Wrapper { ["run"]() { return this.delegate.save(); } }',
      filename: "src/modules/wrapper/application/wrapper.ts",
    },
    {
      name: "accepts a forwarding method inside a test file",
      code: "class Facade { delegate; save() { return this.delegate.save(); } }",
      filename: "tests/unit/facade.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a method that only forwards to another object",
      code: "class Facade { delegate; save() { return this.delegate.save(); } }",
      filename: "src/modules/facade/application/facade.ts",
      errors: [{ messageId: "middleMan" }],
    },
  ],
});
