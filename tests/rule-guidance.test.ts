import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { REGISTRY } from "../src/rules/registry.js";

describe("rule guidance", () => {
  it("documents every registered rule with problem, origin, why and solutions", async () => {
    const guidance = await readFile(new URL("../docs/rule-guidance.md", import.meta.url), "utf8");
    const documentedRows = [
      ...guidance.matchAll(
        /^\| `([^`]+)`\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\s*\|$/gm,
      ),
    ];

    expect(documentedRows).toHaveLength(REGISTRY.length);
    expect(documentedRows.map(([_, name]) => name).sort()).toEqual(
      REGISTRY.map(({ name }) => name).sort(),
    );
    expect(documentedRows.every((row) => row.slice(2).every((column) => column.trim()))).toBe(true);
  });
});
