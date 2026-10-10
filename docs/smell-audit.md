# Smell and coupling audit

This document records the review of the 56 smells in `src/data/smell-catalog.ts`
against the Code Smells catalogue and the supplied material on coupling,
Responsibility-Driven Design (RDD), Object Calisthenics and connascence. A smell
is promoted to an ESLint rule only when the AST provides a repeatable signal and
the message can recommend a concrete change. Project-wide, historical and
runtime properties remain report or architecture evidence; turning those into a
local syntax rule would create false certainty.

## Detection decisions for every catalogued smell

| Smell                                         | Decision and reasoned improvement                                                                                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| afraid-to-fail                                | Manual review. Look for swallowed failures, overly defensive branching and missing failure ownership; use typed errors, explicit recovery and failure-oriented examples. |
| alternative-classes-with-different-interfaces | Architecture/reporting candidate. Compare implementations of one role across modules; introduce a shared port or an adapter that normalizes the contract.                |
| base-class-depends-on-subclass                | Architecture test. Detect inheritance dependency edges with dependency-cruiser; invert the dependency or use composition and a stable abstraction.                       |
| binary-operator-in-name                       | Covered by `binary-operator-in-name`; split multiple responsibilities or name the single policy.                                                                         |
| boolean-blindness                             | Covered by `no-boolean-parameter`; replace a flag with a named command, discriminant or separate operations.                                                             |
| callback-hell                                 | Covered by `callback-hell`; extract named operations or use structured async composition with explicit lifecycle ownership.                                              |
| clever-code                                   | Manual review. Syntax cannot determine whether compact code is comprehensible in its domain; prefer intention-revealing names and a simpler decomposition.               |
| combinatorial-explosion                       | Covered by `combinatorial-explosion`; separate independent dimensions or use typed policy/data-driven dispatch.                                                          |
| complicated-boolean-expression                | Covered by `complicated-boolean-expression` and `no-high-cognitive-boolean-expression`; extract named predicates and preserve boundary cases as examples.                |
| complicated-regex-expression                  | Covered by `complicated-regex-expression`; name or parse the grammar and test representative invalid inputs.                                                             |
| conditional-complexity                        | Covered by `conditional-complexity`; split policy, use a discriminated union or table, and test each decision boundary.                                                  |
| data-clump                                    | Covered by `data-clump`; introduce a value object or command so related data has one invariant owner.                                                                    |
| dead-code                                     | Delegated to ESLint core `no-unused-vars`; remove unreachable/unused code after checking side effects and public contracts.                                              |
| divergent-change                              | Manual/project review. Group changes by reason to change and split modules whose consumers evolve independently.                                                         |
| dubious-abstraction                           | Manual review. Validate the abstraction against real variation; remove speculative indirection or make the translation/invariant explicit.                               |
| duplicated-code                               | Project/reporting candidate. Use duplication analysis across files, then extract a concept only when the duplicated behavior changes for the same reason.                |
| fallacious-comment                            | Manual review. Comments that contradict behavior need semantic and historical context; fix the code or explain the constraint rather than adding restatements.           |
| fallacious-method-name                        | Covered by `no-fallacious-method-name`; align getter/setter names with return and side-effect behavior.                                                                  |
| fate-over-action                              | Covered by `prefer-data-driven-dispatch`; express variants as typed data and keep policy ownership explicit.                                                             |
| feature-envy                                  | Covered by `feature-envy-candidate`; move behavior to the information expert or introduce a focused domain service.                                                      |
| flag-argument                                 | Covered by `no-boolean-parameter`; make the operation explicit instead of hiding two commands behind a flag.                                                             |
| global-data                                   | Covered by `global-data` and `no-static-service-locator`; compose state at the boundary and inject ownership.                                                            |
| hidden-dependencies                           | Runtime/architecture candidate. Review constructors, imports and ambient services; use explicit ports, composition roots and deterministic fakes.                        |
| imperative-loops                              | Covered by `imperative-loops`; prefer named collection operations when they express the policy, retaining loops for mechanics with a rationale.                          |
| inappropriate-static                          | Covered by `inappropriate-static` and `no-static-service-locator`; make state instance-owned or make a stateless utility a pure function.                                |
| incomplete-library-class                      | Manual/API review. Compare the abstraction with its consumers and add the missing operation to the owning interface or remove the wrapper.                               |
| inconsistent-names                            | Cross-file review. Build a ubiquitous-language glossary and use a project-level naming checker only after the vocabulary is agreed.                                      |
| inconsistent-style                            | Formatting/lint concern, not a domain smell. Use Prettier and ESLint configuration; do not encode subjective style as a design rule.                                     |
| indecent-exposure                             | Covered by `no-public-mutable-properties`; public mutable state should be replaced with intention-revealing operations or readonly/value-object state.                   |
| insider-trading                               | Architecture/reporting candidate. Detect knowledge crossing bounded contexts through imports and data shapes; translate at the boundary and expose only the contract.    |
| large-class                                   | Covered by `small-class-candidate` and `max-two-instance-variables`; split by responsibility, while treating thresholds as review evidence rather than proof.            |
| lazy-element                                  | Candidate review. A class/function with no meaningful behavior may be accidental indirection; remove it or give it an invariant/translation worth owning.                |
| long-method                                   | Covered by `max-function-statements`; extract cohesive policies and preserve orchestration at the application boundary.                                                  |
| long-parameter-list                           | Covered by `long-parameter-list`; use a named command/value object or split the operation by responsibility.                                                             |
| magic-number                                  | Covered by `no-magic-numbers`; name thresholds and protocol values, documenting deliberate standard exceptions.                                                          |
| message-chain                                 | Covered by `one-dot-per-line`; move behavior to the owner or define a focused port instead of traversing an object graph.                                                |
| middle-man                                    | Covered by `middle-man`; remove forwarding or make its translation, policy or ownership explicit.                                                                        |
| mutable-data                                  | Covered by `mutable-data`; prefer immutable values and explicit state transitions, isolating unavoidable mechanics.                                                      |
| null-check                                    | Covered by `null-check`; validate at the boundary and pass a non-null value object or explicit option onward.                                                            |
| obscured-intent                               | Partly covered by naming/complexity rules. The remaining semantic judgment requires review; name roles, invariants and effects at the point of use.                      |
| oddball-solution                              | Manual review. Compare the solution with neighboring conventions and simplify only when the common abstraction preserves the domain invariant.                           |
| parallel-inheritance-hierarchies              | Architecture/reporting candidate. Correlate subclass families across two hierarchies; replace synchronized inheritance with composition or one cohesive policy.          |
| primitive-obsession                           | Covered by `wrap-primitives-candidate` and `no-type-embedded-in-name`; create value objects where validation, units or identity matter.                                  |
| refused-bequest                               | Architecture/semantic review. Detect inherited members that are unused only with type and consumer context; prefer composition or a narrower port.                       |
| required-setup-or-teardown-code               | Testing/architecture review. Move lifecycle ownership to fixtures or adapters with guaranteed isolation; avoid hidden ordering requirements.                             |
| shotgun-surgery                               | Project-history/reporting candidate. Correlate commits and dependency edges; move the changing concept behind one owner or port.                                         |
| side-effects                                  | Covered by `no-mixed-effect-categories`; separate queries and commands and make retries/idempotency explicit.                                                            |
| special-case                                  | Candidate review. Replace repeated exceptional branches with a Null Object, policy or explicit variant only when the exception has stable semantics.                     |
| speculative-generality                        | Manual review. Remove unused extension points and abstractions until a real variation or consumer justifies them.                                                        |
| status-variable                               | Covered by `status-variable`; use a discriminated union and explicit transitions instead of a mutable string slot.                                                       |
| temporary-field                               | Covered by `temporary-field`; keep workflow state local or extract a lifecycle-owned workflow object.                                                                    |
| tramp-data                                    | Candidate review. Identify parameters forwarded through multiple layers without being used; remove them or introduce a command/value object at the owning boundary.      |
| type-embedded-in-name                         | Covered by `no-type-embedded-in-name`; name the concept, role or identity and leave representation to the annotation.                                                    |
| uncommunicative-name                          | Covered by `no-uncommunicative-names` and `no-generic-names-in-domain`; use the domain vocabulary and name effects/units.                                                |
| vertical-separation                           | Reporting/review candidate. Inspect declarations separated from use and module cohesion; colocate related policy or split the module.                                    |
| what-comment                                  | Covered by `what-comment`; improve names and structure, reserving comments for why, constraints and external behavior.                                                   |

## Coupling and connascence coverage

| Dimension                                   | What can be enforced here                                                                                                                              | What remains outside local ESLint                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Afferent/efferent and instability           | Dependency-cruiser report, low-level import rules and port-not-adapter rules. Interpret Ca/Ce with integration strength, not as a universal threshold. | System topology, team ownership and whether a dependency is strategically valuable.        |
| Module coupling                             | Import-boundary rules and deterministic dependency graph.                                                                                              | Whether a shared/common dependency is the right product decision.                          |
| Connascence of name/type/meaning/position   | Naming, typed-dispatch, primitive and data-clump rules.                                                                                                | Semantic equivalence across independently deployed services.                               |
| Algorithmic connascence                     | Review candidate; keep transformations behind one owner and test the contract.                                                                         | Proving two modules share an algorithm without semantic analysis.                          |
| Execution/timing/value/identity connascence | Test-control-flow and explicit boundary rules provide partial signals; runtime contracts need tests.                                                   | Ordering, timing, retries, availability and identity across processes.                     |
| Lifecycle/temporal/runtime coupling         | Explicit ports, no ambient state and architecture report provide boundary evidence.                                                                    | Failure cascades, timeouts, circuit breakers, bulkheads and deployment lifecycle.          |
| Integration strength                        | Keep intrusive coupling out of domain/application code; prefer functional/model/contract boundaries.                                                   | Whether an external integration is operationally safe requires runtime and contract tests. |

The resulting policy is intentionally strict about observable local design and
explicit about the limits of AST-only analysis. New rules require a focused
behavioral RuleTester suite, a concrete message with a refactoring direction,
catalog/documentation coverage and evidence from the repository quality gates.
