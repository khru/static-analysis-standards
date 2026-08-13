import type { ESLint, Linter } from "eslint";

import { buildConfigs, buildRules } from "./rules/registry.js";

export const rules = buildRules();

export const configs: Record<string, Linter.Config> = buildConfigs();

export interface EngineeringPlugin extends ESLint.Plugin {
  readonly configs: Record<string, Linter.Config>;
}

const plugin: EngineeringPlugin = {
  meta: {
    name: "@khru/static-analysis-standards",
    version: "0.1.0",
  },
  rules: rules as unknown as ESLint.Plugin["rules"],
  configs,
};

export default plugin;
