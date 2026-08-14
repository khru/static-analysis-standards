import { describe, expect, it } from "vitest";

import plugin, { configs, rules } from "../src/index.js";
import { isDomainOrApplicationFile } from "../src/shared/file-scope.js";

describe("plugin surface", () => {
  it("does not classify rule implementations as product domain files", () => {
    expect(isDomainOrApplicationFile("src/rules/domain/no-framework-types.ts")).toBe(false);
  });
  it("exposes the plugin metadata", () => {
    expect(plugin.meta).toEqual({
      name: "@evalverde/static-analysis-standards",
      version: "0.1.0",
    });
  });

  it("registers the sixty-three rules under the standards prefix", () => {
    expect(Object.keys(rules)).toHaveLength(63);
  });

  it("registers the deterministic quality rules", () => {
    expect(rules["quality/no-empty-catch"]).toBeDefined();
    expect(rules["quality/no-boolean-parameter"]).toBeDefined();
    expect(rules["quality/no-generic-error"]).toBeDefined();
    expect(rules["quality/no-generic-names-in-domain"]).toBeDefined();
    expect(rules["quality/no-nested-ternary"]).toBeDefined();
    expect(rules["quality/no-uncommunicative-names"]).toBeDefined();
    expect(rules["quality/max-nesting-depth"]).toBeDefined();
    expect(rules["quality/max-function-statements"]).toBeDefined();
    expect(rules["quality/no-static-service-locator"]).toBeDefined();
    expect(rules["quality/no-direct-process-env-access"]).toBeDefined();
    expect(rules["quality/no-date-construction-outside-clock"]).toBeDefined();
    expect(rules["quality/no-abbreviated-names"]).toBeDefined();
    expect(rules["quality/no-deprecated-api-usage"]).toBeDefined();
    expect(rules["quality/no-interface-prefix-suffix"]).toBeDefined();
    expect(rules["quality/no-local-time-construction"]).toBeDefined();
    expect(rules["quality/no-magic-numbers"]).toBeDefined();
    expect(rules["quality/no-magic-strings"]).toBeDefined();
    expect(rules["quality/no-mixed-abstraction-levels"]).toBeDefined();
    expect(rules["quality/no-mixed-effect-categories"]).toBeDefined();
    expect(rules["quality/no-stringly-typed-dispatch"]).toBeDefined();
    expect(rules["quality/prefer-data-driven-dispatch"]).toBeDefined();
    expect(rules["quality/prefer-intl-date-formatting"]).toBeDefined();
    expect(rules["quality/prefer-utc-date-getters"]).toBeDefined();
    expect(rules["quality/prefer-utc-date-setters"]).toBeDefined();
    expect(rules["quality/prefer-utc-serialization"]).toBeDefined();
  });

  it("registers the heuristic strict candidate rules", () => {
    expect(rules["quality/disconnected-method-clusters"]).toBeDefined();
    expect(rules["quality/fat-interface-candidate"]).toBeDefined();
    expect(rules["quality/feature-envy-candidate"]).toBeDefined();
    expect(rules["quality/few-instance-variables"]).toBeDefined();
    expect(rules["quality/first-class-collection-candidate"]).toBeDefined();
    expect(rules["quality/max-one-indentation"]).toBeDefined();
    expect(rules["quality/no-abbreviations"]).toBeDefined();
    expect(rules["quality/no-concrete-low-level-dependency"]).toBeDefined();
    expect(rules["quality/no-else"]).toBeDefined();
    expect(rules["quality/no-getters-setters"]).toBeDefined();
    expect(rules["quality/one-dot-per-line"]).toBeDefined();
    expect(rules["quality/small-class-candidate"]).toBeDefined();
    expect(rules["quality/wrap-primitives-candidate"]).toBeDefined();
  });

  it("registers the tdd-refactor smell candidate rules", () => {
    expect(rules["quality/binary-operator-in-name"]).toBeDefined();
    expect(rules["quality/callback-hell"]).toBeDefined();
    expect(rules["quality/combinatorial-explosion"]).toBeDefined();
    expect(rules["quality/complicated-boolean-expression"]).toBeDefined();
    expect(rules["quality/complicated-regex-expression"]).toBeDefined();
    expect(rules["quality/conditional-complexity"]).toBeDefined();
    expect(rules["quality/data-clump"]).toBeDefined();
    expect(rules["quality/global-data"]).toBeDefined();
    expect(rules["quality/imperative-loops"]).toBeDefined();
    expect(rules["quality/inappropriate-static"]).toBeDefined();
    expect(rules["quality/long-parameter-list"]).toBeDefined();
    expect(rules["quality/middle-man"]).toBeDefined();
    expect(rules["quality/mutable-data"]).toBeDefined();
    expect(rules["quality/null-check"]).toBeDefined();
    expect(rules["quality/status-variable"]).toBeDefined();
    expect(rules["quality/temporary-field"]).toBeDefined();
    expect(rules["quality/what-comment"]).toBeDefined();
  });

  it("registers the domain, architecture and testing rules", () => {
    expect(rules["domain/no-ambient-clock"]).toBeDefined();
    expect(rules["domain/no-ambient-randomness"]).toBeDefined();
    expect(rules["domain/no-framework-types"]).toBeDefined();
    expect(rules["domain/no-orm-types"]).toBeDefined();
    expect(rules["architecture/depend-on-port-not-adapter"]).toBeDefined();
    expect(rules["architecture/no-concrete-repository-dependency"]).toBeDefined();
    expect(rules["testing/no-test-control-flow"]).toBeDefined();
    expect(rules["testing/no-try-finally-in-tests"]).toBeDefined();
  });

  it("ships the recommended config as the twenty-three deterministic quality rules at error severity", () => {
    expect(configs.recommended?.rules).toEqual({
      "standards/quality/max-function-statements": "error",
      "standards/quality/max-nesting-depth": "error",
      "standards/quality/no-abbreviated-names": "error",
      "standards/quality/no-boolean-parameter": "error",
      "standards/quality/no-date-construction-outside-clock": "error",
      "standards/quality/no-deprecated-api-usage": "error",
      "standards/quality/no-direct-process-env-access": "error",
      "standards/quality/no-empty-catch": "error",
      "standards/quality/no-generic-error": "error",
      "standards/quality/no-generic-names-in-domain": "error",
      "standards/quality/no-interface-prefix-suffix": "error",
      "standards/quality/no-local-time-construction": "error",
      "standards/quality/no-magic-numbers": "error",
      "standards/quality/no-magic-strings": "error",
      "standards/quality/no-mixed-abstraction-levels": "error",
      "standards/quality/no-mixed-effect-categories": "error",
      "standards/quality/no-nested-ternary": "error",
      "standards/quality/no-static-service-locator": "error",
      "standards/quality/no-stringly-typed-dispatch": "error",
      "standards/quality/no-uncommunicative-names": "error",
      "standards/quality/prefer-data-driven-dispatch": "error",
      "standards/quality/prefer-utc-date-setters": "error",
      "standards/quality/prefer-utc-serialization": "error",
    });
  });

  it("ships the strict config as the rigorous policies at non-blocking warning severity", () => {
    expect(configs.strict?.rules).toEqual({
      "standards/quality/max-function-statements": "warn",
      "standards/quality/max-nesting-depth": "warn",
      "standards/quality/no-abbreviated-names": "warn",
      "standards/quality/no-boolean-parameter": "warn",
      "standards/quality/no-date-construction-outside-clock": "warn",
      "standards/quality/no-deprecated-api-usage": "warn",
      "standards/quality/no-direct-process-env-access": "warn",
      "standards/quality/no-empty-catch": "warn",
      "standards/quality/no-generic-error": "warn",
      "standards/quality/no-generic-names-in-domain": "warn",
      "standards/quality/no-interface-prefix-suffix": "warn",
      "standards/quality/no-local-time-construction": "warn",
      "standards/quality/no-magic-numbers": "warn",
      "standards/quality/no-magic-strings": "warn",
      "standards/quality/no-mixed-abstraction-levels": "warn",
      "standards/quality/no-mixed-effect-categories": "warn",
      "standards/quality/no-nested-ternary": "warn",
      "standards/quality/no-static-service-locator": "warn",
      "standards/quality/no-stringly-typed-dispatch": "warn",
      "standards/quality/no-uncommunicative-names": "warn",
      "standards/quality/prefer-data-driven-dispatch": "warn",
      "standards/quality/prefer-intl-date-formatting": "warn",
      "standards/quality/prefer-utc-date-getters": "warn",
      "standards/quality/prefer-utc-date-setters": "warn",
      "standards/quality/prefer-utc-serialization": "warn",
      "standards/quality/disconnected-method-clusters": "warn",
      "standards/quality/fat-interface-candidate": "warn",
      "standards/quality/feature-envy-candidate": "warn",
      "standards/quality/few-instance-variables": "warn",
      "standards/quality/first-class-collection-candidate": "warn",
      "standards/quality/max-one-indentation": "warn",
      "standards/quality/no-abbreviations": "warn",
      "standards/quality/no-concrete-low-level-dependency": "warn",
      "standards/quality/no-else": "warn",
      "standards/quality/no-getters-setters": "warn",
      "standards/quality/one-dot-per-line": "warn",
      "standards/quality/small-class-candidate": "warn",
      "standards/quality/wrap-primitives-candidate": "warn",
      "standards/quality/binary-operator-in-name": "warn",
      "standards/quality/callback-hell": "warn",
      "standards/quality/combinatorial-explosion": "warn",
      "standards/quality/complicated-boolean-expression": "warn",
      "standards/quality/complicated-regex-expression": "warn",
      "standards/quality/conditional-complexity": "warn",
      "standards/quality/data-clump": "warn",
      "standards/quality/global-data": "warn",
      "standards/quality/imperative-loops": "warn",
      "standards/quality/inappropriate-static": "warn",
      "standards/quality/long-parameter-list": "warn",
      "standards/quality/middle-man": "warn",
      "standards/quality/mutable-data": "warn",
      "standards/quality/null-check": "warn",
      "standards/quality/status-variable": "warn",
      "standards/quality/temporary-field": "warn",
      "standards/quality/what-comment": "warn",
      "standards/domain/no-ambient-clock": "warn",
      "standards/domain/no-ambient-randomness": "warn",
      "standards/domain/no-framework-types": "warn",
      "standards/domain/no-orm-types": "warn",
    });
  });

  it("ships the architecture config as the two architecture rules at error severity", () => {
    expect(configs.architecture?.rules).toEqual({
      "standards/architecture/depend-on-port-not-adapter": "error",
      "standards/architecture/no-concrete-repository-dependency": "error",
    });
  });

  it("ships the testing config as the two testing rules at error severity", () => {
    expect(configs.testing?.rules).toEqual({
      "standards/testing/no-test-control-flow": "error",
      "standards/testing/no-try-finally-in-tests": "error",
    });
  });
});
