import { describe, expect, it } from "vitest";

import { buildRules, REGISTRY, ruleName } from "../src/rules/registry.js";

describe("static rule descriptions", () => {
  it("publishes problem, origin, impact and solutions in every ESLint rule metadata object", () => {
    const rules = buildRules();
    const descriptions = REGISTRY.map((rule) => rules[ruleName(rule)]?.meta.docs?.description);

    expect(descriptions).toHaveLength(REGISTRY.length);
    expect(
      descriptions.every(
        (description) =>
          description?.startsWith("Problem:") &&
          description.includes("Origin:") &&
          description.includes("Why:") &&
          description.includes("Solutions:"),
      ),
    ).toBe(true);
  });
});
