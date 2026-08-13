import type { IConfiguration, IFlattenedRuleSet } from "dependency-cruiser";

export const repositoryGraphRules: IFlattenedRuleSet = {
  forbidden: [
    {
      name: "no-cycles",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "domain-layer-direction",
      severity: "error",
      from: { path: "(^|/)domain/" },
      to: { path: "(^|/)(application|infrastructure|presentation|composition)/" },
    },
    {
      name: "application-layer-direction",
      severity: "error",
      from: { path: "(^|/)application/" },
      to: { path: "(^|/)(infrastructure|presentation|composition)/" },
    },
    {
      name: "infrastructure-layer-direction",
      severity: "error",
      from: { path: "(^|/)infrastructure/" },
      to: { path: "(^|/)(presentation|composition)/" },
    },
    {
      name: "stable-dependency",
      severity: "warn",
      scope: "folder",
      from: {},
      to: { moreUnstable: true },
    },
  ],
};

export const repositoryGraphConfig: IConfiguration = {
  ...repositoryGraphRules,
  options: {
    metrics: true,
    tsPreCompilationDeps: "specify",
    doNotFollow: { path: "node_modules" },
    exclude: "(^|/)(dist|coverage|reports|node_modules)/",
  },
};

export interface RepositoryAnalysisTarget {
  readonly name: string;
  readonly directory: string;
  readonly entryPoints: readonly string[];
}

export const repositoryAnalysisTargets: readonly RepositoryAnalysisTarget[] = [
  { name: "plugin", directory: ".", entryPoints: ["src"] },
  { name: "api", directory: "../community-ops-api", entryPoints: ["src"] },
  { name: "web", directory: "../community-ops-web", entryPoints: ["src"] },
];
