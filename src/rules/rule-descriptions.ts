export const RULE_DESCRIPTIONS = {
  "max-function-statements":
    "Problem: a function exceeds the configured statement limit. Origin: policy and orchestration accumulated in one operation. Why: large operations are difficult to understand, test and change safely. Solutions: extract cohesive operations, keep orchestration at the application boundary, or document a mechanical adapter exception.",
  "max-nesting-depth":
    "Problem: control flow exceeds the configured nesting depth. Origin: guards and branches were composed inline. Why: preconditions become hidden and the path space grows. Solutions: use guard clauses or extract a named policy/collaborator.",
  "no-abbreviated-names":
    "Problem: a catalogued shortened name is used in a declaration or member. Origin: shared vocabulary was shortened for convenience. Why: intent and searchability degrade. Solutions: spell out the domain or technical term, retaining only approved standard acronyms.",
  "no-boolean-parameter":
    "Problem: a function-like API accepts a boolean selector. Origin: two behaviors were compressed into one signature. Why: call sites are boolean-blind and the function has multiple reasons to change. Solutions: split commands or use a named discriminant/options object.",
  "no-date-construction-outside-clock":
    "Problem: non-test host code reads or constructs ambient dates. Origin: platform time leaked into code without an explicit time boundary. Why: behavior becomes implicit and non-deterministic. Solutions: inject Clock, create UTC instants at the boundary, or document a host exception.",
  "no-deprecated-api-usage":
    "Problem: a non-test call uses a catalogued deprecated API. Origin: migration started but was not completed. Why: legacy behavior remains alive and removal is unsafe. Solutions: migrate to the replacement and remove aliases/scaffolding.",
  "no-direct-process-env-access":
    "Problem: non-test, non-configuration code reads process.env members. Origin: configuration leaked across the infrastructure boundary. Why: values are unvalidated and difficult to substitute or test. Solutions: use one typed configuration loader and inject its result.",
  "no-empty-catch":
    "Problem: a catch clause has no statements. Origin: failure handling was omitted or hidden. Why: operational failures disappear and callers cannot choose a policy. Solutions: recover, translate/rethrow a typed error, or make best-effort behavior observable.",
  "no-generic-error":
    "Problem: code constructs the unqualified Error type. Origin: the failure has no owning vocabulary. Why: callers cannot distinguish intent and mappings fall back to magic strings. Solutions: define a typed local error and closed message/code catalog.",
  "no-generic-names-in-domain":
    "Problem: domain/application code uses catalogued generic names. Origin: implementation placeholders replaced business language. Why: the model requires implementation inspection. Solutions: name the business role, state, invariant or operation explicitly.",
  "no-interface-prefix-suffix":
    "Problem: an interface uses I-prefix or Interface-suffix naming. Origin: syntax conventions replaced capability naming. Why: names expose the language construct instead of responsibility. Solutions: name the capability or port directly.",
  "no-local-time-construction":
    "Problem: code uses multi-argument Date construction. Origin: calendar components are interpreted through local timezone semantics. Why: the instant can vary by timezone or DST. Solutions: use Date.UTC, an injected Clock, or a validated UTC instant.",
  "no-magic-numbers":
    "Problem: an unexplained number appears in domain/application policy. Origin: a threshold or protocol value was left inline. Why: meaning and change impact are hidden. Solutions: name a constant/value object and document protocol exceptions.",
  "no-magic-strings":
    "Problem: an unexplained string appears in domain/application policy. Origin: a state/event vocabulary was duplicated inline. Why: typos and inconsistent states become silent behavior changes. Solutions: use a closed catalog, enum or discriminant constant.",
  "no-mixed-abstraction-levels":
    "Problem: one function combines inline computation with collaborator orchestration. Origin: mechanism was added beside policy. Why: the boundary is unclear and changes have broad impact. Solutions: extract mechanism behind a port/adapter and keep one abstraction level per method.",
  "no-mixed-effect-categories":
    "Problem: a function returns a value while also mutating state. Origin: query and command behavior were combined. Why: ordering, retries and tests become difficult. Solutions: separate query and command and isolate mutation behind a collaborator.",
  "no-nested-ternary":
    "Problem: a conditional expression contains another conditional expression. Origin: compact syntax replaced named decision logic. Why: evaluation order and edge cases are hard to scan. Solutions: use guard clauses or a named decision function.",
  "no-static-service-locator":
    "Problem: mutable static state or a self-constructing locator hides composition. Origin: ambient lookup replaced explicit wiring. Why: dependencies are invisible and state leaks between tests. Solutions: compose at the root and inject typed ports/factories.",
  "no-stringly-typed-dispatch":
    "Problem: strings select behavior through switch or if chains. Origin: closed variants were represented as arbitrary text. Why: renames and unsupported values evade the compiler. Solutions: use a discriminated union and typed data-driven map.",
  "no-uncommunicative-names":
    "Problem: vague or one-character names hide intent. Origin: placeholder names survived implementation growth. Why: every use requires source inspection. Solutions: name the role, effect, unit or business concept explicitly.",
  "prefer-data-driven-dispatch":
    "Problem: a switch with single-return cases encodes a lookup table. Origin: variants accumulated as branches. Why: new cases require control-flow edits and omissions are easy. Solutions: use a typed map/catalog with explicit missing-key handling.",
  "prefer-intl-date-formatting":
    "Problem: implicit locale date formatting is used. Origin: runtime locale/timezone behavior was trusted. Why: output varies by environment. Solutions: use Intl.DateTimeFormat with explicit locale and timezone.",
  "prefer-utc-date-getters":
    "Problem: local date getters are called. Origin: a UTC instant was interpreted with local calendar methods. Why: results vary by machine timezone. Solutions: use UTC getters or a domain time abstraction.",
  "prefer-utc-date-setters":
    "Problem: local date setters are called. Origin: calendar mutation used local timezone semantics. Why: DST and timezone alter the resulting instant. Solutions: use UTC setters or reconstruct a validated UTC instant.",
  "prefer-utc-serialization":
    "Problem: local date/time serialization is called. Origin: local representation was selected implicitly. Why: consumers receive ambiguous or shifted timestamps. Solutions: serialize UTC with toISOString or an explicit UTC serializer.",
  "disconnected-method-clusters":
    "Problem: state-touching methods use pairwise-disjoint fields. Origin: multiple responsibilities accumulated in one class. Why: cohesion falls and unrelated changes collide. Solutions: split by reason to change after checking shared invariants.",
  "fat-interface-candidate":
    "Problem: a domain/application interface has more than ten members. Origin: a port widened to avoid another seam. Why: implementations and consumers carry unrelated obligations. Solutions: split ports by client need and capability.",
  "feature-envy-candidate":
    "Problem: a method reads multiple parameter properties but no instance state. Origin: policy was placed near a caller rather than its information. Why: ownership is unclear and behavior scatters. Solutions: move behavior to the information expert or use a focused domain service.",
  "few-instance-variables":
    "Problem: a class has more than five instance fields. Origin: state spread across a large class. Why: state ownership and cohesion become difficult. Solutions: group state into value objects or split the class.",
  "first-class-collection-candidate":
    "Problem: a class holds one array/tuple or collection-typed field. Origin: collection behavior lacks an owner. Why: invariants and operations duplicate at call sites. Solutions: introduce a collection value object when it owns rules.",
  "max-one-indentation":
    "Problem: a function reaches the configured nested block depth. Origin: several blocks were placed in one operation. Why: the primary action is visually hidden. Solutions: guard early and extract nested policy; document necessary mechanical nesting.",
  "no-abbreviations":
    "Problem: an identifier is one to three lowercase alphanumeric characters outside the allowlist. Origin: local names were shortened for convenience. Why: searchability and shared language degrade. Solutions: use the complete term or an established protocol acronym.",
  "no-concrete-low-level-dependency":
    "Problem: domain/application imports a low-level path such as persistence, adapter or client. Origin: the adapter boundary was skipped. Why: replacement and isolated testing require production edits. Solutions: depend on an owning port and translate in composition.",
  "no-else":
    "Problem: an else branch is present, including else-if. Origin: alternatives were written as nested branches. Why: indentation can obscure the normal path. Solutions: use guard returns where valid or document a genuinely paired alternative.",
  "no-getters-setters":
    "Problem: a catalogued accessor method appears in domain/application code. Origin: representation was exposed as property plumbing. Why: callers can bypass invariants. Solutions: expose intention-revealing behavior or immutable values.",
  "one-dot-per-line":
    "Problem: an ordinary call chain traverses multiple methods. Origin: callers navigate object graphs directly. Why: ownership boundaries and Law of Demeter are obscured. Solutions: add behavior to the owner or introduce a focused port.",
  "small-class-candidate":
    "Problem: a class has at least eight non-constructor methods. Origin: responsibilities accumulated in one class. Why: cohesion and change risk decline. Solutions: split by responsibility or justify a material boundary.",
  "wrap-primitives-candidate":
    "Problem: domain/application properties or interface members use raw primitive types. Origin: a domain concept remained a string/number/boolean. Why: validation and meaning duplicate. Solutions: introduce a value object with parsing and invariants.",
  "binary-operator-in-name":
    "Problem: a function, method or class name embeds and/or/not/in/between. Origin: multiple responsibilities were compressed into one name. Why: a missing concept or split is concealed. Solutions: split responsibilities or name one policy explicitly.",
  "callback-hell":
    "Problem: function expressions are nested to the configured callback depth. Origin: asynchronous or nested work was composed inline. Why: error and lifecycle paths are hard to follow. Solutions: extract named operations or use structured async composition.",
  "combinatorial-explosion":
    "Problem: a domain/application function contains at least four if statements. Origin: independent behavior dimensions accumulated in one function. Why: testing and reasoning grow combinatorially. Solutions: use typed policies/tables or separate use cases.",
  "complicated-boolean-expression":
    "Problem: a condition contains at least three counted operands. Origin: several decisions were compressed into one expression. Why: precedence and negation hide policy. Solutions: name predicates and compose them at the policy boundary.",
  "complicated-regex-expression":
    "Problem: a domain/application regex is long or has many grouping/alternation characters. Origin: grammar was embedded as an opaque pattern. Why: small edits can introduce invisible matching defects. Solutions: name/split patterns or use a parser.",
  "conditional-complexity":
    "Problem: a domain/application function reaches the configured decision complexity. Origin: variants accumulated in one operation. Why: branch coverage and change risk increase. Solutions: split policies or use data-driven dispatch.",
  "data-clump":
    "Problem: the same group of at least three parameters repeats in one file. Origin: a concept lacks a value or command object. Why: callers can reorder or partially supply related data. Solutions: introduce a value object or explicit command.",
  "global-data":
    "Problem: top-level mutable let/var data exists in domain/application code. Origin: state was made ambient for convenience. Why: tests interfere and ownership is undefined. Solutions: scope state to composition or inject a stateful port.",
  "imperative-loops":
    "Problem: a domain/application loop is present. Origin: collection/control flow was written procedurally. Why: mutation and exits can obscure intent. Solutions: use a named collection operation, or document why a loop is mechanically required.",
  "inappropriate-static":
    "Problem: an instance method never references instance state. Origin: a utility operation was placed on a stateful class. Why: the class boundary may be accidental. Solutions: make it a pure function/static utility or give the class state ownership.",
  "long-parameter-list":
    "Problem: a domain/application function has more than four parameters. Origin: a command/value object was not introduced. Why: call sites are fragile and arguments are easy to confuse. Solutions: use a named parameter object or split responsibility.",
  "middle-man":
    "Problem: an instance method only returns a member call. Origin: an abstraction was added without translation. Why: indirection grows while responsibility remains unclear. Solutions: remove it or make ownership/translation meaningful.",
  "mutable-data":
    "Problem: domain/application code declares let state. Origin: transitions were implemented procedurally. Why: intermediate states and ordering are harder to reason about. Solutions: prefer const, immutable values and explicit transitions.",
  "null-check":
    "Problem: policy code compares values to null/undefined or uses typeof checks. Origin: validation was deferred past the boundary. Why: uncertainty spreads through policy code. Solutions: validate at the frontier and use a non-null value object/Option.",
  "status-variable":
    "Problem: a local string status is reassigned. Origin: multiple states were encoded in one mutable slot. Why: transitions and invalid states are implicit. Solutions: use a discriminated union or separate state operations.",
  "temporary-field":
    "Problem: a field is referenced by only one method in a multi-method class. Origin: temporary workflow state was stored broadly. Why: lifetime and ownership are unclear. Solutions: keep it local or extract a workflow object.",
  "what-comment":
    "Problem: a comment mostly restates the annotated code. Origin: names or structure failed to communicate. Why: comments duplicate implementation and drift. Solutions: improve names/design and keep comments for why or constraints.",
  "no-ambient-clock":
    "Problem: domain/application code calls new Date() or Date.now(). Origin: time was read directly instead of injected. Why: temporal policy and tests become non-deterministic. Solutions: inject Clock and pass an instant into policy.",
  "no-ambient-randomness":
    "Problem: domain/application code calls ambient random or UUID APIs. Origin: generation leaked into policy. Why: replays and tests cannot be deterministic. Solutions: inject an ID/random-source port.",
  "no-framework-types":
    "Problem: domain/application imports configured framework packages. Origin: framework vocabulary crossed the domain boundary. Why: the domain cannot evolve independently. Solutions: translate framework values at the adapter frontier.",
  "no-orm-types":
    "Problem: domain/application imports configured ORM packages. Origin: persistence representation leaked into policy. Why: schema changes become business changes. Solutions: define local ports/types and translate rows in adapters.",
  "depend-on-port-not-adapter":
    "Problem: application imports a path containing infrastructure. Origin: composition bypassed the owning interface. Why: replacements and fakes require production edits. Solutions: import the port and wire the adapter at composition.",
  "no-concrete-repository-dependency":
    "Problem: application imports a named concrete repository class. Origin: storage became the application contract. Why: business policy couples to persistence. Solutions: depend on a repository port in domain language.",
  "no-test-control-flow":
    "Problem: recognized test callbacks contain if, loops, switch or ternary control flow. Origin: operational branching entered the example. Why: tests reproduce behavior or hide AAA. Solutions: move mechanics to fixtures/hooks and use semantic each cases.",
  "no-try-finally-in-tests":
    "Problem: recognized test callbacks contain try/finally. Origin: cleanup repairs shared state inside the example. Why: failures can leave order-dependent state. Solutions: use isolated fixtures and guaranteed lifecycle hooks.",
} as const;

export type RuleDescriptionName = keyof typeof RULE_DESCRIPTIONS;
