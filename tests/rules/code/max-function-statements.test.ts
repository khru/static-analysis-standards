import { RuleTester } from "@typescript-eslint/rule-tester";

import { maxFunctionStatements } from "../../../src/rules/code/max-function-statements.js";

const ruleTester = new RuleTester();

ruleTester.run("max-function-statements", maxFunctionStatements, {
  valid: [
    {
      name: "function below the default maximum",
      code: ["function f() {", "  const a = 1;", "  const b = 2;", "  return a + b;", "}"].join(
        "\n",
      ),
    },
    {
      name: "arrow function with an expression body is not counted",
      code: "const next = () => nextStage();",
    },
  ],
  invalid: [
    {
      name: "reports a function above a custom maximum",
      code: [
        "function f() {",
        "  const a = 1;",
        "  const b = 2;",
        "  const c = 3;",
        "  const d = 4;",
        "  return a + b + c + d;",
        "}",
      ].join("\n"),
      options: [{ max: 4 }],
      errors: [{ messageId: "tooManyStatements", data: { count: 5, max: 4 } }],
    },
    {
      name: "counts a nested function declaration but not its body",
      code: "function outer() { const x = 1; function inner() { return 1; } }",
      options: [{ max: 1 }],
      errors: [{ messageId: "tooManyStatements", data: { count: 2, max: 1 } }],
    },
    {
      name: "skips a nested function expression body",
      code: "function outer() { const x = 1; const f = function() { const a = 1; }; return f(); }",
      options: [{ max: 1 }],
      errors: [{ messageId: "tooManyStatements", data: { count: 3, max: 1 } }],
    },
  ],
});
