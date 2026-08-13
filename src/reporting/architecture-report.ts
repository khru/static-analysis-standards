import type { ICruiseResult, IFolder, IModule, IViolation } from "dependency-cruiser";

import { SMELL_CATALOG } from "../data/smell-catalog.js";

export type GraphFindingKind = "cycle" | "forbidden-direction" | "stable-dependency";

export interface GraphFinding {
  readonly kind: GraphFindingKind;
  readonly ruleId: string;
  readonly severity: "error" | "warning";
  readonly from: string;
  readonly to: string;
  readonly cycle?: readonly string[];
}

export interface ComponentMetrics {
  readonly name: string;
  readonly afferent: number;
  readonly efferent: number;
  readonly instability: number;
}

export interface TargetArchitectureAnalysis {
  readonly target: string;
  readonly modules: readonly ComponentMetrics[];
  readonly folders: readonly ComponentMetrics[];
  readonly findings: readonly GraphFinding[];
}

export interface ArchitectureReport {
  readonly schemaVersion: 1;
  readonly engine: "dependency-cruiser";
  readonly targets: readonly TargetArchitectureAnalysis[];
  readonly diagnostics: readonly EslintCompatibleDiagnostic[];
}

export interface EslintCompatibleMessage {
  readonly ruleId: string;
  readonly severity: 1 | 2;
  readonly message: string;
  readonly line: 1;
  readonly column: 1;
}

export interface EslintCompatibleDiagnostic {
  readonly filePath: string;
  readonly messages: readonly EslintCompatibleMessage[];
  readonly errorCount: number;
  readonly warningCount: number;
}

export interface ManualReviewEntry {
  readonly slug: string;
  readonly title: string;
  readonly category: string;
}

function compareNames(left: { readonly name: string }, right: { readonly name: string }): number {
  return left.name.localeCompare(right.name);
}

function moduleMetrics(module: IModule): ComponentMetrics {
  return {
    name: module.source,
    afferent: module.dependents.length,
    efferent: module.dependencies.length,
    instability: module.instability ?? 0,
  };
}

function folderMetrics(folder: IFolder): ComponentMetrics {
  return {
    name: folder.name,
    afferent: folder.afferentCouplings ?? 0,
    efferent: folder.efferentCouplings ?? 0,
    instability: folder.instability ?? 0,
  };
}

function findingKind(ruleId: string): GraphFindingKind {
  if (ruleId === "no-cycles") return "cycle";
  if (ruleId === "stable-dependency") return "stable-dependency";
  return "forbidden-direction";
}

function graphFinding(violation: IViolation): GraphFinding {
  const cycle = violation.cycle?.map(({ name }) => name).sort();
  return {
    kind: findingKind(violation.rule.name ?? "architecture"),
    ruleId: violation.rule.name ?? "architecture",
    severity: violation.rule.severity === "error" ? "error" : "warning",
    from: violation.from,
    to: violation.to,
    ...(cycle === undefined ? {} : { cycle }),
  };
}

function compareFindings(left: GraphFinding, right: GraphFinding): number {
  return `${left.ruleId}\0${left.from}\0${left.to}`.localeCompare(
    `${right.ruleId}\0${right.from}\0${right.to}`,
  );
}

export function normalizeCruiseResult(
  target: string,
  cruiseResult: ICruiseResult,
): TargetArchitectureAnalysis {
  return {
    target,
    modules: cruiseResult.modules.map(moduleMetrics).sort(compareNames),
    folders: (cruiseResult.folders ?? []).map(folderMetrics).sort(compareNames),
    findings: cruiseResult.summary.violations.map(graphFinding).sort(compareFindings),
  };
}

export function toEslintCompatibleDiagnostics(
  targets: readonly TargetArchitectureAnalysis[],
): readonly EslintCompatibleDiagnostic[] {
  const findings = targets.flatMap(({ target, findings: targetFindings }) =>
    targetFindings.map((finding) => ({ target, finding })),
  );
  const filePaths = [
    ...new Set(findings.map(({ target, finding }) => `${target}/${finding.from}`)),
  ].sort();
  return filePaths.map((filePath) => {
    const messages = findings
      .filter(({ target, finding }) => `${target}/${finding.from}` === filePath)
      .map(({ finding }) => ({
        ruleId: `standards/architecture/${finding.ruleId}`,
        severity: (finding.severity === "error" ? 2 : 1) as 1 | 2,
        message: `${finding.kind}: dependency on ${finding.to}`,
        line: 1 as const,
        column: 1 as const,
      }));
    return {
      filePath,
      messages,
      errorCount: messages.filter(({ severity }) => severity === 2).length,
      warningCount: messages.filter(({ severity }) => severity === 1).length,
    };
  });
}

export function buildArchitectureReport(
  targets: readonly TargetArchitectureAnalysis[],
): ArchitectureReport {
  const sortedTargets = [...targets].sort((left, right) => left.target.localeCompare(right.target));
  return {
    schemaVersion: 1,
    engine: "dependency-cruiser",
    targets: sortedTargets,
    diagnostics: toEslintCompatibleDiagnostics(sortedTargets),
  };
}

export function manualReviewEntries(): readonly ManualReviewEntry[] {
  return SMELL_CATALOG.filter(({ disposition }) => disposition === "manual-review")
    .map(({ slug, title, category }) => ({ slug, title, category }))
    .sort((left, right) => left.slug.localeCompare(right.slug));
}
