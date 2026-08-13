# Static analysis standards repository instructions

This repository owns the shared ESLint rules, architecture rules and deterministic
dependency-cruiser report for the standards package. It is the single owner of the
static-analysis implementation; API and web workflows invoke the same CLI with
their own explicit target and never make this workflow analyze another repository.

## Quality pipeline

Run the canonical sequence in [`../docs/quality-gates.md`](../docs/quality-gates.md):

1. Gate 1: `pnpm run editorconfig`.
2. Gate 2: `pnpm run typecheck`, `pnpm run lint`, `pnpm run format:check` and
   `pnpm run sa:report`; the report must exit successfully with no violations.
3. Gate 3: `pnpm run test:coverage`; all four metrics remain at 100%.
4. Gate 4: `pnpm run test:mutation`; Stryker must report 100% and zero survivors.
5. Gate 5: keep this file, package commands and architecture rules aligned.
6. Gate 6: `task ci:local` runs the checked-in workflow with `act` locally only.
7. Gate 7: update this README and root architecture evidence when the contract changes.

Never use `continue-on-error` for a quality gate or lower a threshold. Run
`task cleanup` from the root after reports, coverage or mutation output.

## Package boundary and release safety

The package's public boundary is the compiled ESLint plugin in `dist/`: rules and
flat configs are consumed by npm/pnpm clients. `src/reporting/` is internal tooling
for the explicit-target dependency-cruiser report and is not part of the consumer
runtime. Do not add reporting dependencies or repository analysis to the plugin entry
point.

The manifest is currently `private: true`; do not publish or remove that safeguard
without an approved release decision. Before a future npm release, run the complete
quality pipeline, verify the packed contents contain only the intended `dist/` files,
and check the worktree and release environment for tokens, credentials, `.env` files
or other private data. Hosted publishing controls such as provenance, attestations,
signing and protected release permissions cannot be established by a local command.
`task ci:local` uses `act` only as a local workflow pre-flight and never substitutes
for those hosted controls.

## Commands

```text
pnpm run editorconfig
pnpm run typecheck
pnpm run lint
pnpm run format:check
pnpm run test
pnpm run test:coverage
pnpm run test:mutation
pnpm run sa:report
pnpm run check
```
