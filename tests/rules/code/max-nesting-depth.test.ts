import { RuleTester } from "@typescript-eslint/rule-tester";

import { maxNestingDepth } from "../../../src/rules/code/max-nesting-depth.js";

const ruleTester = new RuleTester();

ruleTester.run("max-nesting-depth", maxNestingDepth, {
  valid: [
    {
      name: "flat function with guard clauses",
      code: "function f(user) { if (!user) return; if (!user.active) return; return work(); }",
      options: [{ max: 3 }],
    },
    {
      name: "three levels of nesting is allowed",
      code: "function f() { if (a) { if (b) { if (c) { run(); } } } }",
      options: [{ max: 3 }],
    },
    {
      name: "module-level nesting is ignored",
      code: "if (a) { if (b) { if (c) { if (d) { run(); } } } }",
      options: [{ max: 3 }],
    },
    {
      name: "defaults the maximum when max is omitted",
      code: "function f() { if (a) { if (b) { if (c) { run(); } } } }",
      options: [{}],
    },
    {
      name: "sibling controls do not inherit depth",
      code: "function f() { if (a) { run(); } if (b) { run(); } }",
      options: [{ max: 2 }],
    },
    {
      name: "sibling controls preserve the frame depth after exit",
      code: "function f() { if (a) { if (b) { run(); } } if (c) { run(); } }",
      options: [{ max: 2 }],
    },
    {
      name: "a flat function after a nested function starts at zero depth",
      code: "function nested() { if (a) { if (b) { run(); } } } function flat() { if (c) { run(); } }",
      options: [{ max: 2 }],
    },
  ],
  invalid: [
    {
      name: "reports the node that crosses the maximum depth",
      code: "function f() { if (a) { if (b) { if (c) { if (d) { run(); } } } } }",
      options: [{ max: 3 }],
      errors: [{ messageId: "tooDeep", data: { depth: 4, max: 3 } }],
    },
    {
      name: "honors a custom maximum",
      code: "function f() { if (a) { if (b) { run(); } } }",
      options: [{ max: 1 }],
      errors: [{ messageId: "tooDeep", data: { depth: 2, max: 1 } }],
    },
    {
      name: "reports the second nested control at the exact crossing depth",
      code: "function f() { if (a) { if (b) { if (c) { run(); } } } }",
      options: [{ max: 2 }],
      errors: [{ messageId: "tooDeep", data: { depth: 3, max: 2 } }],
    },
    {
      name: "reports each branch that crosses the configured depth",
      code: "function f() { if (a) { if (b) { if (c) { run(); } } } if (d) { if (e) { if (f) { run(); } } } }",
      options: [{ max: 2 }],
      errors: [
        { messageId: "tooDeep", data: { depth: 3, max: 2 } },
        { messageId: "tooDeep", data: { depth: 3, max: 2 } },
      ],
    },
  ],
});

describe("max-nesting-depth metadata", () => {
  it("should expose its public rule contract", () => {
    expect(maxNestingDepth.meta.docs?.description).toContain("nested");
    expect(maxNestingDepth.meta.schema).toEqual([
      expect.objectContaining({ additionalProperties: false }),
    ]);
    expect(maxNestingDepth.defaultOptions).toEqual([{ max: expect.any(Number) }]);
  });
});
