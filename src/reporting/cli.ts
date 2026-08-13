import { resolve } from "node:path";

import {
  analysisArtifacts,
  analyzeRepositories,
  emitAnalysisArtifacts,
} from "./generate-report.js";
import { InvalidAnalysisTargetError } from "./invalid-analysis-target-error.js";
import { repositoryAnalysisTargets } from "./dependency-cruiser-config.js";

const packageDirectory = resolve(import.meta.dirname, "../..");
const requestedTarget = process.argv[2] ?? "plugin";
const target = repositoryAnalysisTargets.find(({ name }) => name === requestedTarget);
if (!target) {
  throw new InvalidAnalysisTargetError(requestedTarget);
}
const outputDirectory = resolve(packageDirectory, "reports");
const analysis = await analyzeRepositories(packageDirectory, [target]);
await emitAnalysisArtifacts(analysisArtifacts(analysis), outputDirectory);
