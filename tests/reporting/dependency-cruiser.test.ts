import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { ICruiseResult, IReporterOutput } from "dependency-cruiser";
import { cruise } from "dependency-cruiser";
import { describe, expect, it } from "vitest";

import {
  analysisArtifacts,
  analyzeRepositories,
  emitAnalysisArtifacts,
  type CruiseGraph,
} from "../../src/reporting/generate-report.js";
import {
  repositoryAnalysisTargets,
  repositoryGraphConfig,
  repositoryGraphRules,
} from "../../src/reporting/dependency-cruiser-config.js";

const emptyCruiseResult = {
  modules: [],
  folders: [],
  summary: { violations: [] },
} as unknown as ICruiseResult;

describe("dependency-cruiser reporting pipeline", () => {
  it("commits precise repository targets with cycle, layer, and stability rules", () => {
    expect(repositoryAnalysisTargets).toEqual([
      { name: "plugin", directory: ".", entryPoints: ["src"] },
      { name: "api", directory: "../api", entryPoints: ["src"] },
      { name: "web", directory: "../web", entryPoints: ["src"] },
    ]);
    expect(repositoryGraphRules.forbidden?.map(({ name }) => name)).toEqual([
      "no-cycles",
      "domain-layer-direction",
      "application-layer-direction",
      "infrastructure-layer-direction",
      "stable-dependency",
    ]);
    expect(repositoryGraphConfig.options?.metrics).toBe(true);
  });

  it("analyzes exactly the explicitly supplied target", async () => {
    const invocations: Parameters<CruiseGraph>[] = [];
    const cruiseGraph: CruiseGraph = async (...parameters) => {
      invocations.push(parameters);
      return { output: emptyCruiseResult, exitCode: 0 } satisfies IReporterOutput;
    };

    await analyzeRepositories(
      "/workspace/static-analysis-standards",
      [repositoryAnalysisTargets[0]!],
      cruiseGraph,
    );

    expect(invocations).toHaveLength(1);
    expect(invocations[0]?.[1]?.baseDir).toBe("/workspace/static-analysis-standards");
  });

  it("invokes programmatic cruise with metrics and dependency-cruiser rules", async () => {
    const invocations: Parameters<CruiseGraph>[] = [];
    const cruiseGraph: CruiseGraph = async (...parameters) => {
      invocations.push(parameters);
      return { output: emptyCruiseResult, exitCode: 0 } satisfies IReporterOutput;
    };

    await analyzeRepositories(
      "/workspace/static-analysis-standards",
      repositoryAnalysisTargets,
      cruiseGraph,
    );

    expect(invocations).toHaveLength(3);
    expect(invocations[0]?.[1]).toMatchObject({ metrics: true, validate: true });
    expect(invocations[0]?.[1]?.ruleSet).toBe(repositoryGraphConfig);
    expect(invocations[0]?.[0]).toEqual(["src"]);
    expect(invocations[0]?.[1]?.baseDir).toBe("/workspace/static-analysis-standards");
  });

  it("gets cycle, forbidden-direction, stable-dependency, and metrics evidence from dependency-cruiser", async () => {
    const analysis = await analyzeRepositories(
      import.meta.dirname,
      [
        {
          name: "fixture",
          directory: "../fixtures/repository-graph",
          entryPoints: ["."],
        },
      ],
      cruise,
    );

    expect(analysis.targets[0]?.modules).toHaveLength(7);
    expect(analysis.targets[0]?.folders.length).toBeGreaterThan(0);
    expect(analysis.targets[0]?.findings.map(({ kind }) => kind)).toEqual(
      expect.arrayContaining(["cycle", "forbidden-direction", "stable-dependency"]),
    );
    expect(JSON.stringify(analysis)).not.toContain(import.meta.dirname);
  });

  it("fails the analysis when dependency-cruiser exits with an error", async () => {
    const cruiseGraph: CruiseGraph = async () => ({
      output: emptyCruiseResult,
      exitCode: 1,
    });

    await expect(
      analyzeRepositories(
        "/workspace/static-analysis-standards",
        [{ name: "plugin", directory: ".", entryPoints: ["src"] }],
        cruiseGraph,
      ),
    ).rejects.toThrow("dependency-cruiser exited 1 while analyzing plugin");
  });

  it("emits deterministic JSON, SARIF, and manual-review artifacts", async () => {
    const firstDirectory = await mkdtemp(join(tmpdir(), "sa-report-"));
    const secondDirectory = await mkdtemp(join(tmpdir(), "sa-report-"));
    const analysis = await analyzeRepositories("/workspace", [], async () => ({
      output: emptyCruiseResult,
      exitCode: 0,
    }));

    await emitAnalysisArtifacts(analysisArtifacts(analysis), firstDirectory);
    await emitAnalysisArtifacts(analysisArtifacts(analysis), secondDirectory);

    const firstArchitecture = await readFile(join(firstDirectory, "architecture.json"), "utf8");
    const secondArchitecture = await readFile(join(secondDirectory, "architecture.json"), "utf8");
    expect(secondArchitecture).toBe(firstArchitecture);
    expect(JSON.parse(firstArchitecture)).toEqual(analysis);

    const firstSarif = await readFile(join(firstDirectory, "architecture.sarif"), "utf8");
    const secondSarif = await readFile(join(secondDirectory, "architecture.sarif"), "utf8");
    expect(secondSarif).toBe(firstSarif);
    expect(JSON.parse(firstSarif).version).toBe("2.1.0");

    const firstManualReview = await readFile(join(firstDirectory, "manual-review.json"), "utf8");
    const secondManualReview = await readFile(join(secondDirectory, "manual-review.json"), "utf8");
    expect(secondManualReview).toBe(firstManualReview);
    expect(JSON.parse(firstManualReview).length).toBeGreaterThan(0);
    await rm(firstDirectory, { recursive: true });
    await rm(secondDirectory, { recursive: true });
  });
});
