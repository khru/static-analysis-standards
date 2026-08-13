import type { ICruiseResult } from "dependency-cruiser";
import { describe, expect, it } from "vitest";

import {
  buildArchitectureReport,
  manualReviewEntries,
  normalizeCruiseResult,
  toEslintCompatibleDiagnostics,
} from "../../src/reporting/architecture-report.js";
import { toSarif } from "../../src/reporting/sarif.js";

const cruiseResult = {
  modules: [
    {
      source: "src/domain/member.ts",
      valid: false,
      dependencies: [{ module: "src/infrastructure/store.ts" }],
      dependents: ["src/application/register.ts"],
      instability: 0.5,
    },
    {
      source: "src/application/register.ts",
      valid: true,
      dependencies: [],
      dependents: [],
      instability: 0,
    },
  ],
  folders: [
    {
      name: "src/domain",
      moduleCount: 1,
      afferentCouplings: 2,
      efferentCouplings: 1,
      instability: 1 / 3,
    },
  ],
  summary: {
    violations: [
      {
        rule: { name: "stable-dependency", severity: "warn" },
        from: "src/application",
        to: "src/domain",
      },
      {
        rule: { name: "domain-layer-direction", severity: "error" },
        from: "src/domain/member.ts",
        to: "src/infrastructure/store.ts",
      },
      {
        rule: { name: "no-cycles", severity: "error" },
        from: "src/domain/member.ts",
        to: "src/application/register.ts",
        cycle: [{ name: "src/domain/member.ts" }, { name: "src/application/register.ts" }],
      },
    ],
  },
} as unknown as ICruiseResult;

describe("architecture report", () => {
  it("normalizes dependency-cruiser metrics and graph evidence deterministically", () => {
    const normalized = normalizeCruiseResult("fixture", cruiseResult);

    expect(normalized.modules).toEqual([
      { name: "src/application/register.ts", afferent: 0, efferent: 0, instability: 0 },
      { name: "src/domain/member.ts", afferent: 1, efferent: 1, instability: 0.5 },
    ]);
    expect(normalized.folders).toEqual([
      { name: "src/domain", afferent: 2, efferent: 1, instability: 1 / 3 },
    ]);
    expect(normalized.findings.map(({ kind }) => kind)).toEqual([
      "forbidden-direction",
      "cycle",
      "stable-dependency",
    ]);
  });

  it("transforms graph findings into ESLint-compatible diagnostics without running ESLint", () => {
    const diagnostics = toEslintCompatibleDiagnostics([
      normalizeCruiseResult("fixture", cruiseResult),
    ]);

    expect(diagnostics[1]).toEqual({
      filePath: "fixture/src/domain/member.ts",
      messages: [
        {
          ruleId: "standards/architecture/domain-layer-direction",
          severity: 2,
          message: "forbidden-direction: dependency on src/infrastructure/store.ts",
          line: 1,
          column: 1,
        },
        {
          ruleId: "standards/architecture/no-cycles",
          severity: 2,
          message: "cycle: dependency on src/application/register.ts",
          line: 1,
          column: 1,
        },
      ],
      errorCount: 2,
      warningCount: 0,
    });
  });

  it("converts the normalized report to SARIF 2.1.0", () => {
    const report = buildArchitectureReport([normalizeCruiseResult("fixture", cruiseResult)]);
    const sarif = toSarif(report);

    expect(sarif.version).toBe("2.1.0");
    expect(sarif.runs[0].results).toHaveLength(3);
    expect(sarif.runs[0].results[0]?.locations[0].physicalLocation.artifactLocation.uri).toBe(
      "fixture/src/domain/member.ts",
    );
  });

  it("derives the sorted manual-review list from the smell catalog", () => {
    const entries = manualReviewEntries();

    expect(entries[0]).toEqual({
      slug: "afraid-to-fail",
      title: "Afraid To Fail",
      category: "Responsibility",
    });
    expect(
      entries.every((entry, index) => index === 0 || entries[index - 1]!.slug < entry.slug),
    ).toBe(true);
  });

  it("uses neutral metrics and architecture defaults when dependency-cruiser omits optional data", () => {
    const sparseResult = {
      modules: [
        {
          source: "src/orphan.ts",
          valid: false,
          dependencies: [],
          dependents: [],
        },
      ],
      folders: [{ name: "src", moduleCount: 1 }],
      summary: {
        violations: [
          {
            rule: {},
            from: "src/orphan.ts",
            to: "missing-package",
          },
        ],
      },
    } as unknown as ICruiseResult;

    const normalized = normalizeCruiseResult("fixture", sparseResult);

    expect(normalized.modules[0]?.instability).toBe(0);
    expect(normalized.folders).toEqual([{ name: "src", afferent: 0, efferent: 0, instability: 0 }]);
    expect(normalized.findings[0]).toMatchObject({
      ruleId: "architecture",
      kind: "forbidden-direction",
      severity: "warning",
    });
  });

  it("uses an empty folder list when dependency-cruiser emits no folders", () => {
    const resultWithoutFolders = {
      modules: [],
      summary: { violations: [] },
    } as unknown as ICruiseResult;

    expect(normalizeCruiseResult("fixture", resultWithoutFolders).folders).toEqual([]);
  });

  it("normalizes cycle names and defaults missing rule metadata", () => {
    const normalized = normalizeCruiseResult("fixture", {
      modules: [],
      folders: [],
      summary: {
        violations: [
          {
            rule: {},
            from: "src/a.ts",
            to: "src/b.ts",
            cycle: [{ name: "src/z.ts" }, { name: "src/a.ts" }],
          },
        ],
      },
    } as unknown as ICruiseResult);

    expect(normalized.findings).toEqual([
      {
        kind: "forbidden-direction",
        ruleId: "architecture",
        severity: "warning",
        from: "src/a.ts",
        to: "src/b.ts",
        cycle: ["src/a.ts", "src/z.ts"],
      },
    ]);
    expect(normalized.findings[0]?.ruleId).toBe("architecture");
  });

  it("builds sorted targets and diagnostics for every finding", () => {
    const first = normalizeCruiseResult("z-target", cruiseResult);
    const second = normalizeCruiseResult("a-target", cruiseResult);

    expect(buildArchitectureReport([first, second])).toEqual({
      schemaVersion: 1,
      engine: "dependency-cruiser",
      targets: [second, first],
      diagnostics: [
        {
          filePath: "a-target/src/application",
          messages: [
            {
              ruleId: "standards/architecture/stable-dependency",
              severity: 1,
              message: "stable-dependency: dependency on src/domain",
              line: 1,
              column: 1,
            },
          ],
          errorCount: 0,
          warningCount: 1,
        },
        {
          filePath: "a-target/src/domain/member.ts",
          messages: [
            {
              ruleId: "standards/architecture/domain-layer-direction",
              severity: 2,
              message: "forbidden-direction: dependency on src/infrastructure/store.ts",
              line: 1,
              column: 1,
            },
            {
              ruleId: "standards/architecture/no-cycles",
              severity: 2,
              message: "cycle: dependency on src/application/register.ts",
              line: 1,
              column: 1,
            },
          ],
          errorCount: 2,
          warningCount: 0,
        },
        {
          filePath: "z-target/src/application",
          messages: [
            {
              ruleId: "standards/architecture/stable-dependency",
              severity: 1,
              message: "stable-dependency: dependency on src/domain",
              line: 1,
              column: 1,
            },
          ],
          errorCount: 0,
          warningCount: 1,
        },
        {
          filePath: "z-target/src/domain/member.ts",
          messages: [
            {
              ruleId: "standards/architecture/domain-layer-direction",
              severity: 2,
              message: "forbidden-direction: dependency on src/infrastructure/store.ts",
              line: 1,
              column: 1,
            },
            {
              ruleId: "standards/architecture/no-cycles",
              severity: 2,
              message: "cycle: dependency on src/application/register.ts",
              line: 1,
              column: 1,
            },
          ],
          errorCount: 2,
          warningCount: 0,
        },
      ],
    });
  });

  it("normalizes folder metrics when folders are present", () => {
    const normalized = normalizeCruiseResult("fixture", {
      modules: [],
      folders: [
        { name: "src/z", afferentCouplings: 2, efferentCouplings: 3, instability: 0.6 },
        { name: "src/a", afferentCouplings: 1, efferentCouplings: 4, instability: 0.8 },
      ],
      summary: { violations: [] },
    } as unknown as ICruiseResult);

    expect(normalized.folders).toEqual([
      { name: "src/a", afferent: 1, efferent: 4, instability: 0.8 },
      { name: "src/z", afferent: 2, efferent: 3, instability: 0.6 },
    ]);
  });

  it("returns only manual review catalog entries with stable fields and ordering", () => {
    const entries = manualReviewEntries();

    expect(entries.length).toBeGreaterThan(1);
    expect(entries).toEqual(
      [...entries].sort((left, right) => left.slug.localeCompare(right.slug)),
    );
    expect(entries.every(({ slug, title, category }) => slug && title && category)).toBe(true);
    expect(entries).not.toContainEqual({
      slug: "no-boolean-parameter",
      title: expect.any(String),
      category: expect.any(String),
    });
  });
});
