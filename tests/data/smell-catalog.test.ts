import { describe, expect, it } from "vitest";

import {
  SMELL_CATALOG,
  smellEntry,
  type SmellDispositionKind,
} from "../../src/data/smell-catalog.js";
import { REGISTRY } from "../../src/rules/registry.js";

const dispositionKinds: readonly SmellDispositionKind[] = [
  "shipped",
  "covered",
  "core",
  "architecture-test",
  "m4",
  "manual-review",
];

const registeredRuleNames = new Set(REGISTRY.map((rule) => rule.name));

describe("tdd-refactor smell catalog", () => {
  it("catalogs the fifty-six smells from the tdd-refactor source with unique slugs", () => {
    expect(SMELL_CATALOG).toHaveLength(56);
    const slugs = SMELL_CATALOG.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(56);
  });

  it.each(SMELL_CATALOG)("keeps title, category and disposition well formed for $slug", (entry) => {
    expect(entry.title.trim().length).toBeGreaterThan(0);
    expect(entry.category.trim().length).toBeGreaterThan(0);
    expect(dispositionKinds).toContain(entry.disposition);
  });

  it("ships exactly the seventeen statically detectable smells", () => {
    const shipped = SMELL_CATALOG.filter((entry) => entry.disposition === "shipped");
    expect(shipped).toHaveLength(17);
  });

  it.each(SMELL_CATALOG.filter((entry) => entry.disposition === "shipped"))(
    "ships a registered rule for $slug",
    (entry) => {
      expect(entry.rule_id, entry.slug).toBeDefined();
      expect(registeredRuleNames, entry.slug).toContain(entry.rule_id!);
    },
  );

  it("maps exactly the twelve covered smells to registered plugin rules", () => {
    const covered = SMELL_CATALOG.filter((entry) => entry.disposition === "covered");
    expect(covered).toHaveLength(12);
  });

  it.each(SMELL_CATALOG.filter((entry) => entry.disposition === "covered"))(
    "maps covered smell $slug to a registered plugin rule",
    (entry) => {
      expect(entry.rule_id, entry.slug).toBeDefined();
      expect(registeredRuleNames, entry.slug).toContain(entry.rule_id!);
    },
  );

  it("maps the core smell to a core eslint rule name rather than a plugin rule", () => {
    const core = SMELL_CATALOG.find((entry) => entry.disposition === "core");
    expect(core?.rule_id).toBe("no-unused-vars");
    expect(registeredRuleNames).not.toContain("no-unused-vars");
  });

  it("keeps the architecture-test and m4 smells deferred without a plugin rule", () => {
    const deferred = SMELL_CATALOG.filter(
      (entry) => entry.disposition === "architecture-test" || entry.disposition === "m4",
    );
    expect(deferred).toHaveLength(2);
  });

  it.each(SMELL_CATALOG.filter((entry) => entry.disposition === "architecture-test"))(
    "keeps architecture-test smell $slug without a plugin rule",
    (entry) => {
      expect(entry.rule_id, entry.slug).toBeUndefined();
    },
  );

  it.each(SMELL_CATALOG.filter((entry) => entry.disposition === "m4"))(
    "keeps m4 smell $slug without a plugin rule",
    (entry) => {
      expect(entry.rule_id, entry.slug).toBeUndefined();
    },
  );

  it("keeps the remaining smells for manual review without a plugin rule", () => {
    const manual = SMELL_CATALOG.filter((entry) => entry.disposition === "manual-review");
    expect(manual).toHaveLength(24);
  });

  it.each(SMELL_CATALOG.filter((entry) => entry.disposition === "manual-review"))(
    "keeps manual-review smell $slug without a plugin rule",
    (entry) => {
      expect(entry.rule_id, entry.slug).toBeUndefined();
    },
  );

  it.each(SMELL_CATALOG)("resolves slug $slug through the lookup helper", (entry) => {
    expect(smellEntry(entry.slug).slug).toBe(entry.slug);
  });

  it("rejects an unknown smell slug", () => {
    expect(() => smellEntry("unknown-smell")).toThrow(/Unknown smell slug/);
  });
});
