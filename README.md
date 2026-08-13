# Community Ops static analysis standards

`@khru/static-analysis-standards` is the pinned ESLint plugin that encodes the Community Ops engineering discipline as deterministic lint rules and non-blocking review heuristics. Each rule flags a concrete code or test smell and reports a suggested refactor in its message, so the discipline is enforced by the linter instead of by reviewer taste.

The plugin is developed with strict TypeScript, Vitest and the `@typescript-eslint/rule-tester`, and is published to npm and GitHub Packages for application repositories.

## Rule catalog

Rules are addressable by their `standards/<category>/<name>` id.

### `standards/architecture/*` — ports-and-adapters discipline

| Rule                                | Purpose                                                                                                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `depend-on-port-not-adapter`        | Reports application dependencies on infrastructure adapters. Refactor suggested: depend on the owning port, not the concrete adapter.                                 |
| `no-concrete-repository-dependency` | Reports dependencies on concrete repository implementations from domain and application code. Refactor suggested: depend on the repository port in the owning module. |

### `standards/quality/*` — deterministic code smells

| Rule                                 | Purpose                                                                                                                                                                                                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max-function-statements`            | Reports functions whose statement count exceeds the configured maximum. Refactor suggested: extract cohesive groups into methods (Long Method).                                                                                                                   |
| `max-nesting-depth`                  | Reports control flow nested deeper than the configured maximum. Refactor suggested: use guard clauses or extract conditionals (Conditional Complexity).                                                                                                           |
| `no-abbreviated-names`               | Reports abbreviated identifiers that obscure intent. Refactor suggested: rename with the full ubiquitous-language term (Uncommunicative Name).                                                                                                                    |
| `no-boolean-parameter`               | Reports boolean parameters that act as flags. Refactor suggested: remove the flag argument or split the method (Boolean Blindness).                                                                                                                               |
| `no-date-construction-outside-clock` | Reports bare date construction that reads ambient time outside the Clock. Refactor suggested: receive the value from the injected Clock (Hidden Dependencies).                                                                                                    |
| `no-deprecated-api-usage`            | Reports deprecated API calls from the owning catalogs. Refactor suggested: migrate to the replacement API.                                                                                                                                                        |
| `no-direct-process-env-access`       | Reports direct `process.env` key reads outside the configuration module; forwarding the whole environment object to the typed configuration loader is allowed. Refactor suggested: encapsulate environment reads in the typed configuration loader (Global Data). |
| `no-empty-catch`                     | Reports catch blocks that swallow failures without handling them. Refactor suggested: handle the failure or rethrow a typed error.                                                                                                                                |
| `no-generic-error`                   | Reports generic `Error` construction outside test files. Refactor suggested: throw a typed error from the owning context's error catalog.                                                                                                                         |
| `no-generic-names-in-domain`         | Reports generic placeholder names in domain and application code. Refactor suggested: rename with the ubiquitous language (Uncommunicative Name / Obscured Intent).                                                                                               |
| `no-interface-prefix-suffix`         | Reports `I*` and `*Interface` type names. Refactor suggested: name the type by the role it plays in the domain.                                                                                                                                                   |
| `no-local-time-construction`         | Reports local-time `Date` construction and component reads. Refactor suggested: use UTC/instant semantics (Hidden Dependencies).                                                                                                                                  |
| `no-magic-numbers`                   | Reports unexplained numeric literals. Refactor suggested: name them with domain constants.                                                                                                                                                                        |
| `no-magic-strings`                   | Reports unexplained string literals. Refactor suggested: use the owning glossary or catalog.                                                                                                                                                                      |
| `no-mixed-abstraction-levels`        | Reports statements that mix levels of abstraction in one body. Refactor suggested: extract and name each level (Mixed Levels of Abstraction).                                                                                                                     |
| `no-mixed-effect-categories`         | Reports methods that mix queries and commands. Refactor suggested: separate side-effect-free queries from commands (Command Query Separation).                                                                                                                    |
| `no-nested-ternary`                  | Reports nested ternary expressions. Refactor suggested: extract the condition or use guard clauses (Conditional Complexity).                                                                                                                                      |
| `no-static-service-locator`          | Reports static mutable state and static self-returning methods that act as service locators. Refactor suggested: inject dependencies (Global Data / Inappropriate Static).                                                                                        |
| `no-stringly-typed-dispatch`         | Reports string-based dispatch through if/switch chains. Refactor suggested: use data-driven dispatch (Stringly Typed).                                                                                                                                            |
| `no-uncommunicative-names`           | Reports uncommunicative names in production code. Refactor suggested: rename with an intention-revealing name (Uncommunicative Name).                                                                                                                             |
| `prefer-data-driven-dispatch`        | Reports if/switch dispatch that can be table-driven. Refactor suggested: use a registry or map (Data-Driven Dispatch).                                                                                                                                            |
| `prefer-intl-date-formatting`        | Promotion review candidate: manual locale date formatting hides a time zone. Suggested promotion: use `Intl.DateTimeFormat` with an explicit `timeZone` (Internationalization). Non-blocking, strict preset only.                                                 |
| `prefer-utc-date-getters`            | Review candidate: local-time `Date` getters read a hidden time zone. Suggested promotion: use the UTC getter variants. Non-blocking, strict preset only.                                                                                                          |
| `prefer-utc-date-setters`            | Reports local-time `Date` setters that write a hidden time zone. Refactor suggested: use the UTC setter variants.                                                                                                                                                 |
| `prefer-utc-serialization`           | Reports non-UTC date serialization. Refactor suggested: serialize ISO-8601 UTC.                                                                                                                                                                                   |

### `standards/quality/*` — review heuristics (strict preset)

Heuristics are non-blocking review signals: they never assert an absolute defect from a metric and every message says `Review candidate: ...`. They ship only in the `strict` preset as warnings.

| Rule                               | Evidence                                      | Purpose                                                                                                      |
| ---------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `binary-operator-in-name`          | Binary Operator in Name                       | Reports names that embed a binary operator word (and, or, not, in, between).                                 |
| `callback-hell`                    | Callback Hell                                 | Reports function expressions nested at least three callback levels deep.                                     |
| `combinatorial-explosion`          | Combinatorial Explosion                       | Reports functions with at least four conditional branches.                                                   |
| `complicated-boolean-expression`   | Complicated Boolean Expression                | Reports boolean conditions combining at least three operands.                                                |
| `complicated-regex-expression`     | Complicated Regex Expression                  | Reports regular expressions with a long pattern or many groups.                                              |
| `conditional-complexity`           | Conditional Complexity                        | Reports functions with at least six decision points.                                                         |
| `data-clump`                       | Data Clump                                    | Reports a parameter group repeated across at least two functions in the same file.                           |
| `disconnected-method-clusters`     | Single Responsibility                         | Reports classes whose methods touch pairwise-disjoint instance-state clusters.                               |
| `fat-interface-candidate`          | Interface Segregation                         | Reports interfaces that expose more than ten members.                                                        |
| `feature-envy-candidate`           | Feature Envy                                  | Reports methods that read more members of their collaborators than of their own state.                       |
| `few-instance-variables`           | Calisthenics: few instance variables          | Reports classes holding more than five instance variables.                                                   |
| `first-class-collection-candidate` | Calisthenics: first class collections         | Reports classes whose only instance field is a raw collection type.                                          |
| `global-data`                      | Global Data                                   | Reports mutable top-level declarations in domain and application files.                                      |
| `imperative-loops`                 | Imperative Loops                              | Reports imperative loops in domain and application files.                                                    |
| `inappropriate-static`             | Inappropriate Static                          | Reports instance methods that never reference instance state.                                                |
| `long-parameter-list`              | Long Parameter List                           | Reports functions and methods with more than four parameters.                                                |
| `max-one-indentation`              | Calisthenics: one level of indentation        | Reports function bodies that nest statements more than one level deep.                                       |
| `middle-man`                       | Middle Man                                    | Reports methods whose only behavior is forwarding a call to another object.                                  |
| `mutable-data`                     | Mutable Data                                  | Reports `let` declarations in domain and application files.                                                  |
| `no-abbreviations`                 | Calisthenics: don't abbreviate                | Reports abbreviated identifiers that shorten intent.                                                         |
| `no-concrete-low-level-dependency` | Dependency Inversion                          | Reports domain/application imports of concrete persistence, adapter, client or mapper modules.               |
| `no-else`                          | Calisthenics: don't use the else keyword      | Reports `else` branches replaceable by early returns.                                                        |
| `no-getters-setters`               | Calisthenics: no getters/setters              | Reports accessor methods in domain and application code.                                                     |
| `null-check`                       | Null Check                                    | Reports defensive null/undefined checks in domain and application files.                                     |
| `one-dot-per-line`                 | Calisthenics: one dot per line                | Reports chains of more than one member call per statement; `this`/`super`-rooted chains allow one extra dot. |
| `small-class-candidate`            | Calisthenics: keep all entities small         | Reports classes exposing more than seven methods.                                                            |
| `status-variable`                  | Status Variable                               | Reports a local variable initialized with a status value that is reassigned within the same function.        |
| `temporary-field`                  | Temporary Field                               | Reports an instance field read by a single method while the class exposes at least two methods.              |
| `what-comment`                     | What Comment                                  | Reports comments that only restate the code they annotate.                                                   |
| `wrap-primitives-candidate`        | Calisthenics: wrap all primitives and strings | Reports primitive-typed fields in domain and application classes.                                            |

### `standards/domain/*` — framework-independent domain

| Rule                    | Purpose                                                                                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no-ambient-clock`      | Reports ambient date construction in domain and application code. Refactor suggested: inject the Clock and receive the current date (Hidden Dependencies). |
| `no-ambient-randomness` | Reports ambient randomness in domain and application code. Refactor suggested: inject an identifier or random-source port (Hidden Dependencies).           |
| `no-framework-types`    | Reports framework and infrastructure SDK imports in domain and application code. Refactor suggested: keep domain and application framework-independent.    |
| `no-orm-types`          | Reports ORM and persistence type imports in domain and application code. Refactor suggested: define domain vocabulary types instead of table types.        |

### `standards/testing/*` — readable test specifications

| Rule                      | Purpose                                                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no-test-control-flow`    | Reports branches, loops and ternaries inside test cases. Refactor suggested: keep the Arrange-Act-Assert linear or use `it.each`/`test.each` (Conditional Test Logic). |
| `no-try-finally-in-tests` | Reports `try/finally` blocks inside test cases. Refactor suggested: move resource cleanup into a driver, fixture or lifecycle hook with guaranteed per-test isolation. |

## Presets

The plugin exposes four flat configs under `plugin.configs`, derived from the data-driven registry in `src/rules/registry.ts`:

- `recommended` — the 23 `standards/quality/*` deterministic rules as errors.
- `strict` — the rigorous policies (the 25 `standards/quality/*` deterministic rules, the 30 `standards/quality/*` review heuristics and the 4 `standards/domain/*` rules) as non-blocking warnings.
- `architecture` — the 2 `standards/architecture/*` rules as errors.
- `testing` — the 2 `standards/testing/*` rules as errors.

The plugin ships 63 rules in total: 55 `standards/quality/*` (25 deterministic + 30 heuristics), 4 `standards/domain/*`, 2 `standards/architecture/*` and 2 `standards/testing/*`.

Each rule is also addressable directly by its `standards/<category>/<name>` id.

The non-blocking `strict` preset produces a JSON report artifact of every review candidate without ever failing a gate:

```text
pnpm run report:strict   # emits reports/strict-heuristics.json (warnings only, exit code 0)
```

## Severity taxonomy

The plugin classifies every rule into one of five dispositions:

- `error` — deterministic rule that blocks the quality gate (the `recommended`, `architecture` and `testing` presets).
- `warning` — rigorous policy or review heuristic that never blocks; the `strict` preset is warning-only by design.
- `suggestion` — candidate for manual review, never part of any gate.
- `architecture-test` — boundary evidence enforced through an architecture test rather than a lint rule.
- `manual-review` — a signal that requires human judgment; never encoded as a hard rule.

The do-not-lint contract: an absolute metric assertion such as “a class with more than five methods violates SRP” or “every mock is a smell” is a review signal, never a deterministic lint rule. Metrics become `warning`/`suggestion` evidence or `manual-review` candidates, never `error`.

## Repository graph reporting (Phase C)

`sa:report` runs the deterministic repository-graph analysis over one explicit target with dependency-cruiser as the graph engine. The supported targets are `plugin`, `api` and `web`; a workflow must pass exactly one target and never analyzes the other repositories as a side effect. It emits three artifacts under `static-analysis-standards/reports/`:

```text
pnpm run sa:report plugin   # analyze only static-analysis-standards/src
pnpm run sa:report api      # analyze only community-ops-api/src
pnpm run sa:report web      # analyze only community-ops-web/src
```

- `architecture.json` — the canonical analysis: per-target module/folder Martin metrics (afferent, efferent, instability) and the `cycle`, `forbidden-direction` and `stable-dependency` findings with severity, plus ESLint-compatible diagnostics keyed by file.
- `architecture.sarif` — the same findings as a SARIF 2.1.0 report for tool ingestion.
- `manual-review.json` — the `manual-review` disposition entries from the smell catalog that require human judgment.

The graph engine never runs inside ESLint: the normal plugin entry point ships no reporting modules, so consumers never load dependency-cruiser, and the CLI is the only place the graph is executed. A dependency-cruiser engine failure propagates as a typed `DependencyCruiserRunError` so partial evidence is never published. Output is deterministic: repeated runs for the same target produce byte-identical artifacts.

### Package versus internal reporting

The npm package is the ESLint integration boundary. Its published `files` set contains
`dist/`, whose public entry point provides the `standards` rule map and flat configs;
consumers do not need dependency-cruiser or the repository-reporting implementation.
The repository's `src/reporting/` CLI and its JSON, SARIF and manual-review artifacts
are internal development and CI tooling. They analyze one explicit repository target
(`plugin`, `api` or `web`) and must not be imported by the npm consumer path. This
separation keeps the installed lint plugin small and prevents graph analysis from
running as an ESLint side effect.

## Usage

### npm installation

For a published release, install the decoupled package from npm with pnpm:

```text
pnpm add --save-dev @khru/static-analysis-standards
```

The package declares ESLint, TypeScript and `typescript-eslint` as peer dependencies;
the consuming repository must provide compatible versions. This checkout currently
keeps `private: true` in `package.json`, so publishing is not enabled yet. The npm
command is the consumer contract for the release once the owner approves making the
package public.

During local coordinated development, consumers may instead declare the plugin as a
materialized local dependency:

```json
{
  "devDependencies": {
    "@khru/static-analysis-standards": "^0.1.0"
  }
}
```

and spread the presets into their flat ESLint config, registering the `standards` plugin object once:

```ts
import standards from "@khru/static-analysis-standards";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { plugins: { standards }, ...standards.configs.recommended },
  { plugins: { standards }, ...standards.configs.architecture },
  { plugins: { standards }, ...standards.configs.testing },
  eslintConfigPrettier,
);
```

Because the dependency is materialized, the plugin `dist/` is copied into the consumer's `node_modules` at install time. After rebuilding the plugin (`pnpm run build`), re-run `pnpm install` in the consumer so the refreshed `dist/` is picked up.

### Rule options

Presets use each rule's default options. Override an individual rule in the same flat
config entry where the plugin is registered. Rules with configurable schemas are:

```ts
{
  plugins: { standards },
  rules: {
    "standards/quality/max-function-statements": ["error", { max: 10 }],
    "standards/quality/max-nesting-depth": ["error", { max: 3 }],
    "standards/quality/no-magic-numbers": ["error", { allowlist: [1000] }],
    "standards/quality/no-magic-strings": ["error", { allowlist: ["known-value"] }],
    "standards/domain/no-framework-types": ["error", ["react", "react-dom"]],
    "standards/domain/no-orm-types": ["error", ["drizzle-orm"]],
  },
}
```

`max` values are positive integers. The two `allowlist` options accept numbers or
strings respectively, and the domain import catalogs accept unique package-name
arrays. Rules whose schema is empty do not accept rule options. Keep overrides
intentional: changing a threshold or catalog changes the consumer's quality contract.

## Data catalogs

Separated from rule logic in `src/data/`:

- `abbreviations.ts` — the agreed abbreviation→meaning map used by `no-abbreviated-names` and `no-abbreviations`.
- `abstraction-level-types.ts` — the AST types that reveal a mixed abstraction level (collaborator queries, inline initialization, loops) used by `no-mixed-abstraction-levels`.
- `accessor-kinds.ts` — the getter/setter member-kind catalog used by `no-getters-setters`.
- `collection-types.ts` — the raw collection reference names used by `first-class-collection-candidate`.
- `control-flow-catalogs.ts` — nesting/test-case control-flow node types, statement types and the default nesting/statement limits used by `max-nesting-depth`, `max-function-statements` and `no-test-control-flow`.
- `deprecated-apis.ts` — the deprecated API catalog used by `no-deprecated-api-usage`.
- `frameworks.ts` — the framework catalog used by `no-framework-types`.
- `local-date-methods.ts` — the UTC equivalents for local `Date` getters/setters, the serialization replacements and the locale formatting methods used by the UTC/Intl family.
- `low-level-import-segments.ts` — the infrastructure import segments that a domain/application layer must not import, used by `no-concrete-low-level-dependency`.
- `magic-value-exceptions.ts` — the numeric values exempt from `no-magic-numbers` (0 and 1).
- `mutation-methods.ts` — the mutating `Array` method catalog used by `no-mixed-effect-categories`.
- `naming-catalogs.ts` — the single-character allowlist, vague names, generic nouns/verbs and allowed short names used by the naming rules.
- `nested-scope-node-types.ts` — the function node types that close a scope, used by the superficial-scope traversal helpers.
- `orm-packages.ts` — the ORM catalog used by `no-orm-types`.
- `pipeline-operators.ts` — the functional collection pipeline operators exempt from `one-dot-per-line`.
- `primitive-type-keywords.ts` — the raw primitive AST type keywords used by `wrap-primitives-candidate`.
- `rule-thresholds.ts` — the shared numeric thresholds consumed by the deterministic and heuristic rule families.
- `service-locator-catalogs.ts` — the mutable initializer types and locator method names used by `no-static-service-locator`.
- `test-framework-catalogs.ts` — the test-call object and modifier names (`it`/`test`, `each`/`skip`/`only`/`concurrent`) used by the testing-rule helpers.
- `value-packages.ts` — the value-object and validation package catalog used by the heuristic presets.

## Scope semantics of the testing rules

The testing rules follow the superficial-scope decision approved by the accountable product owner: control flow and `try/finally` are reported only in the own scope of the test-case callback. They never descend into nested function expressions, so decision logic inside a collection-transformation predicate (for example an `if` inside a `filter` callback) stays legal, and module-level helpers, lifecycle hooks and drivers keep their cleanup responsibility. This prevents a gate that would reward hiding visible test behavior behind helpers.

## Development

Pinned stack: Node.js 26.5.0, pnpm 11.15.1, TypeScript 6.0.3, ESLint 10, `typescript-eslint` 8.66, Vitest 4.

```text
pnpm run typecheck      # strict TypeScript check
pnpm run lint           # ESLint with zero warnings (self-lint via the plugin's own presets)
pnpm run format:check   # Prettier check
pnpm run test           # Vitest suite (RuleTester)
pnpm run test:coverage  # 100% statements/branches/functions/lines gate
pnpm run report:strict  # non-blocking strict preset report artifact (reports/strict-heuristics.json)
pnpm run sa:report      # dependency-cruiser graph analysis (architecture.json, .sarif, manual-review.json)
pnpm run build          # compile dist/ consumed by file: consumers
pnpm run check          # typecheck + lint + format:check + test
task ci:local            # run the checked-in plugin workflow locally with act
```

Coverage is enforced at 100% across all four metrics. The rule tests exercise each rule through its public `RuleTester` seam with semantic case names that pin the approved semantics.

## Publishing and security

Publishing is a deliberate release action, not part of the normal quality check. Before
the package is made public, the owner must approve removing `private: true`, selecting
the version and configuring the npm publishing workflow. A release must build from a
clean checkout, run the full plugin gates, inspect the packed file list, and publish
only the intended `dist/` output. Never place npm tokens, credentials or private
environment files in the repository or command output.

The checked-in GitHub Actions workflow uses pinned action references, read-only
`contents` permission and `pnpm install --frozen-lockfile`. `act` is a local pre-flight
only (`task ci:local`); a local pass does not prove hosted identity, branch protection,
attestations, provenance or signing. Those release-security properties require the
hosted GitHub environment and its configured protections.
