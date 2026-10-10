# Changelog

All notable changes to `@evalverde/static-analysis-standards` are recorded
in this file.

## [0.1.4] - 2026-10-10

- Refresh development dependencies with pnpm, retaining the latest TypeScript 6
  release compatible with `typescript-eslint` 8.71.1.
- Add strict review rules for fallacious getter/setter names, type words embedded
  in annotated names, and Object Calisthenics classes with more than two state
  fields.
- Add `no-public-mutable-properties` for domain/application state that exposes
  invariants through mutable public fields.
- Ensure every packed or published artifact builds and verifies the public
  `dist/` entry point before it can be consumed.
- Make the publish smoke test inspect the tarball and installed `dist/index.js`.

## [0.1.3] - 2026-08-18

- Harden cognitive boolean expression boundaries and tests.

## [0.1.2] - 2026-08-18

- Add `no-high-cognitive-boolean-expression` to detect boolean conditions with excessive cognitive load.

## [0.1.1] - 2026-08-17

- Remove obsolete product branding from the package and reporting targets.
- Publish future releases through the GitHub Actions release pipeline.

## [0.1.0] - 2026-08-14

- Publish the first public package release with provenance, SBOM, and GitHub
  release evidence.
