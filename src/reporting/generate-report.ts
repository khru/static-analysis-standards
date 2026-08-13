import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { cruise, type ICruiseResult, type IReporterOutput } from "dependency-cruiser";

import {
  buildArchitectureReport,
  manualReviewEntries,
  normalizeCruiseResult,
  type ArchitectureReport,
} from "./architecture-report.js";
import {
  repositoryAnalysisTargets,
  repositoryGraphConfig,
  type RepositoryAnalysisTarget,
} from "./dependency-cruiser-config.js";
import { DependencyCruiserRunError } from "./dependency-cruiser-error.js";
import { toSarif, type SarifReport } from "./sarif.js";

export interface AnalysisArtifacts {
  readonly analysis: ArchitectureReport;
  readonly sarif: SarifReport;
  readonly manualReview: ReturnType<typeof manualReviewEntries>;
}

export type CruiseGraph = (
  entryPoints: string[],
  options: Parameters<typeof cruise>[1],
) => Promise<IReporterOutput>;

export async function analyzeRepositories(
  packageDirectory: string,
  targets: readonly RepositoryAnalysisTarget[] = repositoryAnalysisTargets,
  cruiseGraph: CruiseGraph = cruise,
): Promise<ArchitectureReport> {
  const analyses = await Promise.all(
    targets.map(async (target) => {
      const output = await cruiseGraph([...target.entryPoints], {
        ...repositoryGraphConfig.options,
        baseDir: resolve(packageDirectory, target.directory),
        validate: true,
        ruleSet: repositoryGraphConfig,
      });
      if (output.exitCode !== 0) {
        throw new DependencyCruiserRunError(target.name, output.exitCode);
      }
      return normalizeCruiseResult(target.name, output.output as ICruiseResult);
    }),
  );
  return buildArchitectureReport(analyses);
}

export function analysisArtifacts(analysis: ArchitectureReport): AnalysisArtifacts {
  return { analysis, sarif: toSarif(analysis), manualReview: manualReviewEntries() };
}

export async function emitAnalysisArtifacts(
  artifacts: AnalysisArtifacts,
  outputDirectory: string,
): Promise<void> {
  await mkdir(outputDirectory, { recursive: true });
  await Promise.all([
    writeFile(
      resolve(outputDirectory, "architecture.json"),
      `${JSON.stringify(artifacts.analysis, null, 2)}\n`,
    ),
    writeFile(
      resolve(outputDirectory, "architecture.sarif"),
      `${JSON.stringify(artifacts.sarif, null, 2)}\n`,
    ),
    writeFile(
      resolve(outputDirectory, "manual-review.json"),
      `${JSON.stringify(artifacts.manualReview, null, 2)}\n`,
    ),
  ]);
}
