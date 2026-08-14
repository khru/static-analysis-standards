import type { ArchitectureReport, GraphFinding } from "./architecture-report.js";

interface SarifResult {
  readonly ruleId: string;
  readonly level: "error" | "warning";
  readonly message: { readonly text: string };
  readonly locations: readonly [
    { readonly physicalLocation: { readonly artifactLocation: { readonly uri: string } } },
  ];
}

export interface SarifReport {
  readonly version: "2.1.0";
  readonly $schema: string;
  readonly runs: readonly [
    {
      readonly tool: {
        readonly driver: { readonly name: string; readonly rules: readonly unknown[] };
      };
      readonly results: readonly SarifResult[];
    },
  ];
}

function toSarifResult(target: string, finding: GraphFinding): SarifResult {
  return {
    ruleId: `standards/architecture/${finding.ruleId}`,
    level: finding.severity,
    message: { text: `${finding.kind}: ${finding.from} depends on ${finding.to}` },
    locations: [{ physicalLocation: { artifactLocation: { uri: `${target}/${finding.from}` } } }],
  };
}

export function toSarif(report: ArchitectureReport): SarifReport {
  const findings = report.targets.flatMap(({ target, findings: targetFindings }) =>
    targetFindings.map((finding) => toSarifResult(target, finding)),
  );
  const ruleIds = [...new Set(findings.map(({ ruleId }) => ruleId))].sort();
  return {
    version: "2.1.0",
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs: [
      {
        tool: {
          driver: {
            name: "@evalverde/static-analysis-standards",
            rules: ruleIds.map((id) => ({ id })),
          },
        },
        results: findings,
      },
    ],
  };
}
