# eslint-plugin-boundaries evaluation spike

Milestone `ENG-B-M1` (criterion `ENG-B-M1-AC-05`) requires a recorded disposition for
`eslint-plugin-boundaries`: adopt it as the architecture gate, or keep the plugin's own
deterministic architecture rules.

## Evaluated facts (verified against primary sources)

- `eslint-plugin-boundaries` is a mature ESLint plugin that enforces architectural
  boundaries. Current release line is 7.x (7.1.0, published 2026-07), MIT-licensed, zero
  reported vulnerabilities, ~1.1 MB install.
- Active rules: `boundaries/dependencies` (canonical dependency restriction),
  `boundaries/no-unknown-files`, `boundaries/no-unknown-dependencies` and
  `boundaries/no-ignored-dependencies`.
- It classifies every file across three independent dimensions — architectural element,
  file category and origin — and matches dependency rules over element/file selectors
  configured in `settings["boundaries/elements"]`, `boundaries/files` and policy blocks.
- It ships `recommended` and `strict` predefined configs.

## Disposition

**Do not adopt `eslint-plugin-boundaries` for the package quality gate.** Keep the
plugin's own deterministic architecture rules (`standards/architecture/depend-on-port-not-adapter`
and `standards/architecture/no-concrete-repository-dependency`).

### Why

1. **Coverage overlap with smaller surface.** The bounded-context contracts the architecture
   rules must protect are already expressed by the two plugin rules (depend on the owning
   port, not the concrete adapter; no concrete repository dependency from domain/application).
   boundaries would reproduce the same direction checks with a second mechanism.
2. **Configuration drift.** boundaries requires maintaining a parallel element/file/policy
   taxonomy in `settings` that must stay in sync with the actual module structure; the
   plugin's rules derive their verdict from the import graph itself, so they cannot drift
   from the codebase.
3. **Graph-level evidence is M4's job.** The Fase C milestone (`ENG-C-M4`) delivers
   dependency-cruiser with `--metrics` (afferent/efferent coupling, instability) and cycle
   detection, which is the graph-level analysis boundaries does not provide.
4. **Existing architecture-test protection.** The consuming repositories already enforce the
   module dependency direction through architecture tests; adopting boundaries would duplicate
   that evidence.

### Trade-offs

- Alternative A (adopt): richer multi-dimensional classification and `no-unknown-*` coverage,
  at the cost of a second dependency, a parallel classification taxonomy and duplicated
  evidence with the architecture tests and M4.
- Alternative B (selected): keep the plugin's deterministic rules now and let dependency-cruiser
  own graph evidence in M4.

### Revisit trigger

Re-evaluate if the boundary matrix grows beyond the two deterministic rules (for example new
cross-module integration-event contracts that need an explicit allowed/denied dependency list)
or if a repository introduces an architecture dimension the current rules cannot express.

Owner: accountable product owner. Decided: 2026-08-06, within `ENG-B-M1`.
