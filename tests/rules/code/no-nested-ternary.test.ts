import { RuleTester } from "@typescript-eslint/rule-tester";

import { noNestedTernary } from "../../../src/rules/code/no-nested-ternary.js";

const ruleTester = new RuleTester();

ruleTester.run("no-nested-ternary", noNestedTernary, {
  valid: [
    {
      name: "single ternary",
      code: "const value = isActive ? 1 : 2;",
    },
    {
      name: "ternary with expression branches",
      code: "const value = a ? b : c;",
    },
  ],
  invalid: [
    {
      name: "reports a ternary nested in the consequent",
      code: "const value = a ? (b ? c : d) : e;",
      errors: [{ messageId: "nestedTernary" }],
    },
    {
      name: "reports a ternary nested in the alternate",
      code: "const value = a ? b : c ? d : e;",
      errors: [{ messageId: "nestedTernary" }],
    },
    {
      name: "reports each ternary that nests another",
      code: "const value = a ? (b ? (c ? d : e) : f) : g;",
      errors: [{ messageId: "nestedTernary" }, { messageId: "nestedTernary" }],
    },
  ],
});

describe("no-nested-ternary metadata", () => {
  it("should expose its public diagnostic description", () => {
    expect(noNestedTernary.meta.docs?.description).toContain("nested");
  });
});
