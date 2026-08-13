import { describe, expect, it } from "vitest";

import { toSarif } from "../../src/reporting/sarif.js";

describe("SARIF reporting", () => {
  it("emits an empty valid SARIF run when there are no findings", () => {
    const report = toSarif({
      schemaVersion: 1,
      engine: "dependency-cruiser",
      targets: [],
      diagnostics: [],
    });

    expect(report).toEqual({
      version: "2.1.0",
      $schema: "https://json.schemastore.org/sarif-2.1.0.json",
      runs: [
        {
          tool: { driver: { name: "@khru/static-analysis-standards", rules: [] } },
          results: [],
        },
      ],
    });
  });

  it("deduplicates rules while preserving every finding location and message", () => {
    const report = toSarif({
      schemaVersion: 1,
      engine: "dependency-cruiser",
      targets: [
        {
          target: "api",
          modules: [],
          folders: [],
          findings: [
            {
              kind: "forbidden-direction",
              ruleId: "domain-layer-direction",
              severity: "error",
              from: "src/domain/a.ts",
              to: "src/infrastructure/b.ts",
            },
            {
              kind: "forbidden-direction",
              ruleId: "domain-layer-direction",
              severity: "error",
              from: "src/domain/c.ts",
              to: "src/infrastructure/d.ts",
            },
          ],
        },
      ],
      diagnostics: [],
    });

    expect(report.runs[0].tool.driver.rules).toEqual([
      { id: "standards/architecture/domain-layer-direction" },
    ]);
    expect(new Set(report.runs[0].results.map(({ ruleId }) => ruleId)).size).toBe(1);
    expect(report.runs[0].results).toEqual([
      {
        ruleId: "standards/architecture/domain-layer-direction",
        level: "error",
        message: {
          text: "forbidden-direction: src/domain/a.ts depends on src/infrastructure/b.ts",
        },
        locations: [{ physicalLocation: { artifactLocation: { uri: "api/src/domain/a.ts" } } }],
      },
      {
        ruleId: "standards/architecture/domain-layer-direction",
        level: "error",
        message: {
          text: "forbidden-direction: src/domain/c.ts depends on src/infrastructure/d.ts",
        },
        locations: [{ physicalLocation: { artifactLocation: { uri: "api/src/domain/c.ts" } } }],
      },
    ]);
  });
});
