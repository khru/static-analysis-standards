import { createRequire } from "node:module";
import type { ESLint, Linter } from "eslint";

import { buildConfigs, buildRules } from "./rules/registry.js";

const packageJson = createRequire(import.meta.url)("../package.json") as { version: string };

export const rules = buildRules();

export const configs: Record<string, Linter.Config> = buildConfigs();

export interface EngineeringPlugin extends ESLint.Plugin {
  readonly configs: Record<string, Linter.Config>;
}

const plugin: EngineeringPlugin = {
  meta: {
    name: "@evalverde/static-analysis-standards",
    version: packageJson.version,
  },
  rules: rules as unknown as ESLint.Plugin["rules"],
  configs,
};

export default plugin;
