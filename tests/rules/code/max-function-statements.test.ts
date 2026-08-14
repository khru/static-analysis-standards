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
    {
      name: "counts statements inside nested blocks",
      code: "function outer() { if (ready) { const a = 1; const b = 2; } }",
      options: [{ max: 3 }],
    },
    {
      name: "counts the nested function declaration but not its body",
      code: "function outer() { const build = () => { const a = 1; const b = 2; }; }",
      options: [{ max: 2 }],
    },
    {
      name: "does not traverse a nested function declaration body",
      code: "function outer() { function inner() { const a = 1; const b = 2; } }",
      options: [{ max: 2 }],
    },
    {
      name: "allows a function exactly at the configured maximum",
      code: "function f() { const a = 1; const b = 2; return a + b; }",
      options: [{ max: 3 }],
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
    {
      name: "reports a function one statement over the configured maximum",
      code: "function f() { const a = 1; const b = 2; return a + b; }",
      options: [{ max: 2 }],
      errors: [{ messageId: "tooManyStatements", data: { count: 3, max: 2 } }],
    },
    {
      name: "reports statements contributed by a nested block",
      code: "function outer() { if (ready) { const a = 1; const b = 2; } }",
      options: [{ max: 1 }],
      errors: [{ messageId: "tooManyStatements", data: { count: 3, max: 1 } }],
    },
    {
      name: "reports nested control-flow statements while ignoring nested function bodies",
      code: "function outer() { if (ready) { const a = 1; } const build = () => { const b = 2; const c = 3; }; return build(); }",
      options: [{ max: 2 }],
      errors: [{ messageId: "tooManyStatements", data: { count: 4, max: 2 } }],
    },
  ],
});

describe("max-function-statements metadata", () => {
  it("should expose its public rule contract", () => {
    expect(maxFunctionStatements.meta.docs?.description).toContain("statement count");
    expect(maxFunctionStatements.meta.schema).toEqual([
      expect.objectContaining({ additionalProperties: false }),
    ]);
    expect(maxFunctionStatements.defaultOptions).toEqual([{ max: expect.any(Number) }]);
  });
});
