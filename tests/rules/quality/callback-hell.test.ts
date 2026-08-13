import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { callbackHell } from "../../../src/rules/quality/callback-hell.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("callback-hell", callbackHell, {
  valid: [
    {
      name: "accepts a flat sequence of callback calls",
      code: "function load(items) { items.forEach(function (item) { fetch(item).then(function (response) { consume(response); }); }); }",
      filename: "src/modules/loader/application/loader.ts",
    },
    {
      name: "accepts arrow callbacks nested below the threshold",
      code: "function run(task) { task.step((result) => finish(result)); }",
      filename: "src/modules/tasks/application/task-runner.ts",
    },
    {
      name: "accepts up to three nested callback levels",
      code: "function run(task) { task.step(function (a) { a.step(function (b) { b.step(function (c) { finish(c); }); }); }); }",
      filename: "src/modules/tasks/application/task-runner.ts",
    },
    {
      name: "accepts deep callbacks inside a test file",
      code: "function run(task) { task.step(function (a) { a.step(function (b) { b.step(function (c) { c.step(function (d) { finish(d); }); }); }); }); }",
      filename: "tests/unit/task-runner.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a fourth nested callback level",
      code: "function run(task) { task.step(function (a) { a.step(function (b) { b.step(function (c) { c.step(function (d) { finish(d); }); }); }); }); }",
      filename: "src/modules/tasks/application/task-runner.ts",
      errors: [{ messageId: "callbackHell" }],
    },
  ],
});
