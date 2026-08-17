import type { Linter } from "eslint";
import type { TSESLint } from "@typescript-eslint/utils";

import { dependOnPortNotAdapter } from "./architecture/depend-on-port-not-adapter.js";
import { noConcreteRepositoryDependency } from "./architecture/no-concrete-repository-dependency.js";
import { maxFunctionStatements } from "./code/max-function-statements.js";
import { maxNestingDepth } from "./code/max-nesting-depth.js";
import { noBooleanParameter } from "./code/no-boolean-parameter.js";
import { noDateConstructionOutsideClock } from "./code/no-date-construction-outside-clock.js";
import { noDirectProcessEnvAccess } from "./code/no-direct-process-env-access.js";
import { noEmptyCatch } from "./code/no-empty-catch.js";
import { noGenericError } from "./code/no-generic-error.js";
import { noNestedTernary } from "./code/no-nested-ternary.js";
import { noStaticServiceLocator } from "./code/no-static-service-locator.js";
import { disconnectedMethodClusters } from "./quality/disconnected-method-clusters.js";
import { fatInterfaceCandidate } from "./quality/fat-interface-candidate.js";
import { featureEnvyCandidate } from "./quality/feature-envy-candidate.js";
import { fewInstanceVariables } from "./quality/few-instance-variables.js";
import { firstClassCollectionCandidate } from "./quality/first-class-collection-candidate.js";
import { maxOneIndentation } from "./quality/max-one-indentation.js";
import { noAbbreviations } from "./quality/no-abbreviations.js";
import { noConcreteLowLevelDependency } from "./quality/no-concrete-low-level-dependency.js";
import { noElse } from "./quality/no-else.js";
import { noGettersSetters } from "./quality/no-getters-setters.js";
import { oneDotPerLine } from "./quality/one-dot-per-line.js";
import { smallClassCandidate } from "./quality/small-class-candidate.js";
import { wrapPrimitivesCandidate } from "./quality/wrap-primitives-candidate.js";
import { binaryOperatorInName } from "./quality/binary-operator-in-name.js";
import { callbackHell } from "./quality/callback-hell.js";
import { combinatorialExplosion } from "./quality/combinatorial-explosion.js";
import { complicatedBooleanExpression } from "./quality/complicated-boolean-expression.js";
import { complicatedRegexExpression } from "./quality/complicated-regex-expression.js";
import { conditionalComplexity } from "./quality/conditional-complexity.js";
import { dataClump } from "./quality/data-clump.js";
import { globalData } from "./quality/global-data.js";
import { imperativeLoops } from "./quality/imperative-loops.js";
import { inappropriateStatic } from "./quality/inappropriate-static.js";
import { longParameterList } from "./quality/long-parameter-list.js";
import { middleMan } from "./quality/middle-man.js";
import { mutableData } from "./quality/mutable-data.js";
import { nullCheck } from "./quality/null-check.js";
import { statusVariable } from "./quality/status-variable.js";
import { temporaryField } from "./quality/temporary-field.js";
import { whatComment } from "./quality/what-comment.js";
import { noAmbientClock } from "./domain/no-ambient-clock.js";
import { noAmbientRandomness } from "./domain/no-ambient-randomness.js";
import { noFrameworkTypes } from "./domain/no-framework-types.js";
import { noOrmTypes } from "./domain/no-orm-types.js";
import { noGenericNamesInDomain } from "./quality/no-generic-names-in-domain.js";
import { noUncommunicativeNames } from "./quality/no-uncommunicative-names.js";
import { noAbbreviatedNames } from "./quality/no-abbreviated-names.js";
import { noDeprecatedApiUsage } from "./quality/no-deprecated-api-usage.js";
import { noInterfacePrefixSuffix } from "./quality/no-interface-prefix-suffix.js";
import { noLocalTimeConstruction } from "./quality/no-local-time-construction.js";
import { noMagicNumbers } from "./quality/no-magic-numbers.js";
import { noMagicStrings } from "./quality/no-magic-strings.js";
import { noMixedAbstractionLevels } from "./quality/no-mixed-abstraction-levels.js";
import { noMixedEffectCategories } from "./quality/no-mixed-effect-categories.js";
import { noStringlyTypedDispatch } from "./quality/no-stringly-typed-dispatch.js";
import { preferDataDrivenDispatch } from "./quality/prefer-data-driven-dispatch.js";
import { preferIntlDateFormatting } from "./quality/prefer-intl-date-formatting.js";
import { preferUtcDateGetters } from "./quality/prefer-utc-date-getters.js";
import { preferUtcDateSetters } from "./quality/prefer-utc-date-setters.js";
import { preferUtcSerialization } from "./quality/prefer-utc-serialization.js";
import { noTestControlFlow } from "./testing/no-test-control-flow.js";
import { noTryFinallyInTests } from "./testing/no-try-finally-in-tests.js";
import { RULE_DESCRIPTIONS, type RuleDescriptionName } from "./rule-descriptions.js";

export type RuleFamily = "quality" | "domain" | "architecture" | "testing";

export interface RegistryRule {
  readonly name: string;
  readonly family: RuleFamily;
  readonly deterministic: boolean;
  readonly recommended: boolean;
  readonly strict: boolean;
  readonly module: TSESLint.RuleModule<string, readonly unknown[]>;
}

export const REGISTRY: readonly RegistryRule[] = [
  {
    name: "max-function-statements",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: maxFunctionStatements,
  },
  {
    name: "max-nesting-depth",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: maxNestingDepth,
  },
  {
    name: "no-abbreviated-names",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noAbbreviatedNames,
  },
  {
    name: "no-boolean-parameter",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noBooleanParameter,
  },
  {
    name: "no-date-construction-outside-clock",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noDateConstructionOutsideClock,
  },
  {
    name: "no-deprecated-api-usage",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noDeprecatedApiUsage,
  },
  {
    name: "no-direct-process-env-access",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noDirectProcessEnvAccess,
  },
  {
    name: "no-empty-catch",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noEmptyCatch,
  },
  {
    name: "no-generic-error",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noGenericError,
  },
  {
    name: "no-generic-names-in-domain",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noGenericNamesInDomain,
  },
  {
    name: "no-interface-prefix-suffix",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noInterfacePrefixSuffix,
  },
  {
    name: "no-local-time-construction",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noLocalTimeConstruction,
  },
  {
    name: "no-magic-numbers",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noMagicNumbers,
  },
  {
    name: "no-magic-strings",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noMagicStrings,
  },
  {
    name: "no-mixed-abstraction-levels",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noMixedAbstractionLevels,
  },
  {
    name: "no-mixed-effect-categories",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noMixedEffectCategories,
  },
  {
    name: "no-nested-ternary",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noNestedTernary,
  },
  {
    name: "no-static-service-locator",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noStaticServiceLocator,
  },
  {
    name: "no-stringly-typed-dispatch",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noStringlyTypedDispatch,
  },
  {
    name: "no-uncommunicative-names",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: noUncommunicativeNames,
  },
  {
    name: "prefer-data-driven-dispatch",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: preferDataDrivenDispatch,
  },
  {
    name: "prefer-intl-date-formatting",
    family: "quality",
    deterministic: true,
    recommended: false,
    strict: true,
    module: preferIntlDateFormatting,
  },
  {
    name: "prefer-utc-date-getters",
    family: "quality",
    deterministic: true,
    recommended: false,
    strict: true,
    module: preferUtcDateGetters,
  },
  {
    name: "prefer-utc-date-setters",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: preferUtcDateSetters,
  },
  {
    name: "prefer-utc-serialization",
    family: "quality",
    deterministic: true,
    recommended: true,
    strict: true,
    module: preferUtcSerialization,
  },
  {
    name: "disconnected-method-clusters",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: disconnectedMethodClusters,
  },
  {
    name: "fat-interface-candidate",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: fatInterfaceCandidate,
  },
  {
    name: "feature-envy-candidate",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: featureEnvyCandidate,
  },
  {
    name: "few-instance-variables",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: fewInstanceVariables,
  },
  {
    name: "first-class-collection-candidate",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: firstClassCollectionCandidate,
  },
  {
    name: "max-one-indentation",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: maxOneIndentation,
  },
  {
    name: "no-abbreviations",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: noAbbreviations,
  },
  {
    name: "no-concrete-low-level-dependency",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: noConcreteLowLevelDependency,
  },
  {
    name: "no-else",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: noElse,
  },
  {
    name: "no-getters-setters",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: noGettersSetters,
  },
  {
    name: "one-dot-per-line",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: oneDotPerLine,
  },
  {
    name: "small-class-candidate",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: smallClassCandidate,
  },
  {
    name: "wrap-primitives-candidate",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: wrapPrimitivesCandidate,
  },
  {
    name: "binary-operator-in-name",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: binaryOperatorInName,
  },
  {
    name: "callback-hell",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: callbackHell,
  },
  {
    name: "combinatorial-explosion",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: combinatorialExplosion,
  },
  {
    name: "complicated-boolean-expression",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: complicatedBooleanExpression,
  },
  {
    name: "complicated-regex-expression",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: complicatedRegexExpression,
  },
  {
    name: "conditional-complexity",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: conditionalComplexity,
  },
  {
    name: "data-clump",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: dataClump,
  },
  {
    name: "global-data",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: globalData,
  },
  {
    name: "imperative-loops",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: imperativeLoops,
  },
  {
    name: "inappropriate-static",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: inappropriateStatic,
  },
  {
    name: "long-parameter-list",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: longParameterList,
  },
  {
    name: "middle-man",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: middleMan,
  },
  {
    name: "mutable-data",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: mutableData,
  },
  {
    name: "null-check",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: nullCheck,
  },
  {
    name: "status-variable",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: statusVariable,
  },
  {
    name: "temporary-field",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: temporaryField,
  },
  {
    name: "what-comment",
    family: "quality",
    deterministic: false,
    recommended: false,
    strict: true,
    module: whatComment,
  },
  {
    name: "no-ambient-clock",
    family: "domain",
    deterministic: true,
    recommended: false,
    strict: true,
    module: noAmbientClock,
  },
  {
    name: "no-ambient-randomness",
    family: "domain",
    deterministic: true,
    recommended: false,
    strict: true,
    module: noAmbientRandomness,
  },
  {
    name: "no-framework-types",
    family: "domain",
    deterministic: true,
    recommended: false,
    strict: true,
    module: noFrameworkTypes,
  },
  {
    name: "no-orm-types",
    family: "domain",
    deterministic: true,
    recommended: false,
    strict: true,
    module: noOrmTypes,
  },
  {
    name: "depend-on-port-not-adapter",
    family: "architecture",
    deterministic: true,
    recommended: false,
    strict: false,
    module: dependOnPortNotAdapter,
  },
  {
    name: "no-concrete-repository-dependency",
    family: "architecture",
    deterministic: true,
    recommended: false,
    strict: false,
    module: noConcreteRepositoryDependency,
  },
  {
    name: "no-test-control-flow",
    family: "testing",
    deterministic: true,
    recommended: false,
    strict: false,
    module: noTestControlFlow,
  },
  {
    name: "no-try-finally-in-tests",
    family: "testing",
    deterministic: true,
    recommended: false,
    strict: false,
    module: noTryFinallyInTests,
  },
] as const;

export function ruleId(rule: RegistryRule): string {
  return `standards/${rule.family}/${rule.name}`;
}

export function ruleName(rule: RegistryRule): string {
  return `${rule.family}/${rule.name}`;
}

export function buildRules(): Record<string, TSESLint.RuleModule<string, readonly unknown[]>> {
  return Object.fromEntries(
    REGISTRY.map((rule) => [ruleName(rule), withRuleDescription(rule.name, rule.module)]),
  );
}

function withRuleDescription(
  name: string,
  module: TSESLint.RuleModule<string, readonly unknown[]>,
): TSESLint.RuleModule<string, readonly unknown[]> {
  const description = RULE_DESCRIPTIONS[name as RuleDescriptionName]!;
  return {
    ...module,
    meta: {
      ...module.meta,
      docs: { ...module.meta.docs, description },
    },
  };
}

function toRules(
  entries: readonly RegistryRule[],
  severity: Linter.RuleSeverity,
): Record<string, Linter.RuleSeverity> {
  return Object.fromEntries(entries.map((rule) => [ruleId(rule), severity]));
}

export function buildConfigs(): Record<string, Linter.Config> {
  return {
    recommended: {
      name: "static-analysis-standards/recommended",
      rules: toRules(
        REGISTRY.filter((rule) => rule.recommended),
        "error",
      ),
    },
    strict: {
      name: "static-analysis-standards/strict",
      rules: toRules(
        REGISTRY.filter((rule) => rule.strict),
        "warn",
      ),
    },
    architecture: {
      name: "static-analysis-standards/architecture",
      rules: toRules(
        REGISTRY.filter((rule) => rule.family === "architecture"),
        "error",
      ),
    },
    testing: {
      name: "static-analysis-standards/testing",
      rules: toRules(
        REGISTRY.filter((rule) => rule.family === "testing"),
        "error",
      ),
    },
  };
}
