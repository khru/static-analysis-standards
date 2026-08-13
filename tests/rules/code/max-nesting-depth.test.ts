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
  ],
});
