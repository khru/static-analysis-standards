import { RuleTester } from "@typescript-eslint/rule-tester";

import { noEmptyCatch } from "../../../src/rules/code/no-empty-catch.js";

const ruleTester = new RuleTester();

ruleTester.run("no-empty-catch", noEmptyCatch, {
  valid: [
    {
      name: "handles the failure inside the catch",
      code: "try { risky(); } catch (error) { logger.warn(error); }",
    },
    {
      name: "rethrows a typed error",
      code: "try { risky(); } catch (error) { throw new FetchFailedError(error); }",
    },
    {
      name: "has a finally block with statements",
      code: "try { risky(); } finally { cleanup(); }",
    },
  ],
  invalid: [
    {
      name: "reports a completely empty catch",
      code: "try { risky(); } catch (error) {}",
      errors: [{ messageId: "emptyCatch" }],
    },
    {
      name: "reports a catch containing only a comment",
      code: "try { risky(); } catch (error) { /* ignore */ }",
      errors: [{ messageId: "emptyCatch" }],
    },
  ],
});

describe("no-empty-catch metadata", () => {
  it("should expose its public diagnostic description", () => {
    expect(noEmptyCatch.meta.docs?.description).toContain("catch");
  });
});
