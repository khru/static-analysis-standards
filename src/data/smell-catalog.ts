export type SmellDispositionKind =
  "shipped" | "covered" | "core" | "architecture-test" | "m4" | "manual-review";

export interface SmellEntry {
  readonly slug: string;
  readonly title: string;
  readonly category: string;
  readonly disposition: SmellDispositionKind;
  readonly rule_id?: string;
}

export const SMELL_CATALOG: readonly SmellEntry[] = [
  {
    slug: "afraid-to-fail",
    title: "Afraid To Fail",
    category: "Responsibility",
    disposition: "manual-review",
  },
  {
    slug: "alternative-classes-with-different-interfaces",
    title: "Alternative Classes with Different Interfaces",
    category: "Duplication",
    disposition: "manual-review",
  },
  {
    slug: "base-class-depends-on-subclass",
    title: "Base Class depends on Subclass",
    category: "Interfaces",
    disposition: "architecture-test",
  },
  {
    slug: "binary-operator-in-name",
    title: "Binary Operator in Name",
    category: "Names",
    disposition: "shipped",
    rule_id: "binary-operator-in-name",
  },
  {
    slug: "boolean-blindness",
    title: "Boolean Blindness",
    category: "Names",
    disposition: "covered",
    rule_id: "no-boolean-parameter",
  },
  {
    slug: "callback-hell",
    title: "Callback Hell",
    category: "Conditional Logic",
    disposition: "shipped",
    rule_id: "callback-hell",
  },
  {
    slug: "clever-code",
    title: "Clever Code",
    category: "Unnecessary Complexity",
    disposition: "manual-review",
  },
  {
    slug: "combinatorial-explosion",
    title: "Combinatorial Explosion",
    category: "Responsibility",
    disposition: "shipped",
    rule_id: "combinatorial-explosion",
  },
  {
    slug: "complicated-boolean-expression",
    title: "Complicated Boolean Expression",
    category: "Conditional Logic",
    disposition: "shipped",
    rule_id: "complicated-boolean-expression",
  },
  {
    slug: "complicated-regex-expression",
    title: "Complicated Regex Expression",
    category: "Names",
    disposition: "shipped",
    rule_id: "complicated-regex-expression",
  },
  {
    slug: "conditional-complexity",
    title: "Conditional Complexity",
    category: "Conditional Logic",
    disposition: "shipped",
    rule_id: "conditional-complexity",
  },
  {
    slug: "data-clump",
    title: "Data Clump",
    category: "Data",
    disposition: "shipped",
    rule_id: "data-clump",
  },
  {
    slug: "dead-code",
    title: "Dead Code",
    category: "Unnecessary Complexity",
    disposition: "core",
    rule_id: "no-unused-vars",
  },
  {
    slug: "divergent-change",
    title: "Divergent Change",
    category: "Responsibility",
    disposition: "manual-review",
  },
  {
    slug: "dubious-abstraction",
    title: "Dubious Abstraction",
    category: "Responsibility",
    disposition: "manual-review",
  },
  {
    slug: "duplicated-code",
    title: "Duplicated Code",
    category: "Duplication",
    disposition: "manual-review",
  },
  {
    slug: "fallacious-comment",
    title: "Fallacious Comment",
    category: "Names",
    disposition: "manual-review",
  },
  {
    slug: "fallacious-method-name",
    title: "Fallacious Method Name",
    category: "Names",
    disposition: "manual-review",
  },
  {
    slug: "fate-over-action",
    title: "Fate over Action",
    category: "Responsibility",
    disposition: "covered",
    rule_id: "prefer-data-driven-dispatch",
  },
  {
    slug: "feature-envy",
    title: "Feature Envy",
    category: "Responsibility",
    disposition: "covered",
    rule_id: "feature-envy-candidate",
  },
  {
    slug: "flag-argument",
    title: "Flag Argument",
    category: "Conditional Logic",
    disposition: "covered",
    rule_id: "no-boolean-parameter",
  },
  {
    slug: "global-data",
    title: "Global Data",
    category: "Data",
    disposition: "shipped",
    rule_id: "global-data",
  },
  {
    slug: "hidden-dependencies",
    title: "Hidden Dependencies",
    category: "Data",
    disposition: "m4",
  },
  {
    slug: "imperative-loops",
    title: "Imperative Loops",
    category: "Unnecessary Complexity",
    disposition: "shipped",
    rule_id: "imperative-loops",
  },
  {
    slug: "inappropriate-static",
    title: "Inappropriate Static",
    category: "Interfaces",
    disposition: "shipped",
    rule_id: "inappropriate-static",
  },
  {
    slug: "incomplete-library-class",
    title: "Incomplete Library Class",
    category: "Interfaces",
    disposition: "manual-review",
  },
  {
    slug: "inconsistent-names",
    title: "Inconsistent Names",
    category: "Names",
    disposition: "manual-review",
  },
  {
    slug: "inconsistent-style",
    title: "Inconsistent Style",
    category: "Names",
    disposition: "manual-review",
  },
  {
    slug: "indecent-exposure",
    title: "Indecent Exposure",
    category: "Data",
    disposition: "manual-review",
  },
  {
    slug: "insider-trading",
    title: "Insider Trading",
    category: "Responsibility",
    disposition: "manual-review",
  },
  {
    slug: "large-class",
    title: "Large Class",
    category: "Measured Smells",
    disposition: "covered",
    rule_id: "small-class-candidate",
  },
  {
    slug: "lazy-element",
    title: "Lazy Element",
    category: "Unnecessary Complexity",
    disposition: "manual-review",
  },
  {
    slug: "long-method",
    title: "Long Method",
    category: "Measured Smells",
    disposition: "covered",
    rule_id: "max-function-statements",
  },
  {
    slug: "long-parameter-list",
    title: "Long Parameter List",
    category: "Measured Smells",
    disposition: "shipped",
    rule_id: "long-parameter-list",
  },
  {
    slug: "magic-number",
    title: "Magic Number",
    category: "Names",
    disposition: "covered",
    rule_id: "no-magic-numbers",
  },
  {
    slug: "message-chain",
    title: "Message Chain",
    category: "Message Calls",
    disposition: "covered",
    rule_id: "one-dot-per-line",
  },
  {
    slug: "middle-man",
    title: "Middle Man",
    category: "Message Calls",
    disposition: "shipped",
    rule_id: "middle-man",
  },
  {
    slug: "mutable-data",
    title: "Mutable Data",
    category: "Data",
    disposition: "shipped",
    rule_id: "mutable-data",
  },
  {
    slug: "null-check",
    title: "Null Check",
    category: "Conditional Logic",
    disposition: "shipped",
    rule_id: "null-check",
  },
  {
    slug: "obscured-intent",
    title: "Obscured Intent",
    category: "Unnecessary Complexity",
    disposition: "manual-review",
  },
  {
    slug: "oddball-solution",
    title: "Oddball Solution",
    category: "Duplication",
    disposition: "manual-review",
  },
  {
    slug: "parallel-inheritance-hierarchies",
    title: "Parallel Inheritance Hierarchies",
    category: "Responsibility",
    disposition: "manual-review",
  },
  {
    slug: "primitive-obsession",
    title: "Primitive Obsession",
    category: "Data",
    disposition: "covered",
    rule_id: "wrap-primitives-candidate",
  },
  {
    slug: "refused-bequest",
    title: "Refused Bequest",
    category: "Interfaces",
    disposition: "manual-review",
  },
  {
    slug: "required-setup-or-teardown-code",
    title: "Required Setup or Teardown Code",
    category: "Responsibility",
    disposition: "manual-review",
  },
  {
    slug: "shotgun-surgery",
    title: "Shotgun Surgery",
    category: "Responsibility",
    disposition: "manual-review",
  },
  {
    slug: "side-effects",
    title: "Side Effects",
    category: "Responsibility",
    disposition: "covered",
    rule_id: "no-mixed-effect-categories",
  },
  {
    slug: "special-case",
    title: "Special Case",
    category: "Conditional Logic",
    disposition: "manual-review",
  },
  {
    slug: "speculative-generality",
    title: "Speculative Generality",
    category: "Unnecessary Complexity",
    disposition: "manual-review",
  },
  {
    slug: "status-variable",
    title: "Status Variable",
    category: "Unnecessary Complexity",
    disposition: "shipped",
    rule_id: "status-variable",
  },
  {
    slug: "temporary-field",
    title: "Temporary Field",
    category: "Data",
    disposition: "shipped",
    rule_id: "temporary-field",
  },
  {
    slug: "tramp-data",
    title: "Tramp Data",
    category: "Data",
    disposition: "manual-review",
  },
  {
    slug: "type-embedded-in-name",
    title: "Type Embedded in Name",
    category: "Names",
    disposition: "covered",
    rule_id: "no-interface-prefix-suffix",
  },
  {
    slug: "uncommunicative-name",
    title: "Uncommunicative Name",
    category: "Names",
    disposition: "covered",
    rule_id: "no-uncommunicative-names",
  },
  {
    slug: "vertical-separation",
    title: "Vertical Separation",
    category: "Measured Smells",
    disposition: "manual-review",
  },
  {
    slug: "what-comment",
    title: '"What" Comment',
    category: "Names",
    disposition: "shipped",
    rule_id: "what-comment",
  },
];

export class UnknownSmellSlugError extends Error {
  constructor(slug: string) {
    super(`Unknown smell slug: ${slug}`);
    this.name = "UnknownSmellSlugError";
  }
}

export function smellEntry(slug: string): SmellEntry {
  const entry = SMELL_CATALOG.find((candidate) => candidate.slug === slug);
  if (entry === undefined) {
    throw new UnknownSmellSlugError(slug);
  }
  return entry;
}
