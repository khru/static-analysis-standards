# Publishing

The package repository is `https://github.com/khru/static-analysis-standards`.
The package name is `@evalverde/static-analysis-standards` in both npm and GitHub
Packages. npm publication is public and does not require a paid private
registry subscription. The same versioned tarball is validated before either
registry is published.

This package is released from a Git tag. The hosted workflow does not run
`act`; `act` is a local verification tool only.

## Release Inputs

- The tag must use the form `vX.Y.Z`.
- The tag must point at the commit whose `static-analysis-standards/package.json`
  contains the matching version.
- The package must not be private when the workflow runs. This is intentionally
  checked by the workflow rather than changed during release automation.
- The `npm-release` GitHub environment must contain the `NPM_TOKEN` secret.
  The token needs publish access to `@evalverde/static-analysis-standards`.
- GitHub Packages publication uses the repository `GITHUB_TOKEN` and requires
  package write permission for the `khru` owner.
- The repository must allow GitHub Actions to write contents and attestations,
  and to mint an OIDC token. These are granted at job scope by the workflow.

## Normal Release

1. Update the package version and changelog in a commit.
2. Push the commit and an annotated or lightweight matching tag, for example
   `v0.1.0`.
3. Confirm the `Release static analysis standards package` workflow completed.
4. Confirm npm shows provenance for the published version.
5. Confirm the GitHub release contains the `.tgz` archive and
   `sbom.spdx.json`, and that each artifact has a GitHub attestation.

The workflow installs with the frozen lockfile, runs `pnpm run check`, builds,
checks tag/version consistency, creates the package archive, publishes it with
`--provenance`, generates an SPDX JSON SBOM, attests the archive and SBOM, and
creates the GitHub release. A failed gate stops before publish. A failed
post-publish step does not retract the npm version automatically.

A release can also be started with `workflow_dispatch` by entering an existing
`vX.Y.Z` tag. The workflow checks out that tag, so dispatch does not publish
uncommitted branch contents.

## Local Verification With `act`

Run `act` only from a developer machine, never by adding it to the hosted
workflow. Use a dry run to inspect the event and provide secrets through a
local, ignored file:

```sh
act workflow_dispatch \
  -W .github/workflows/release-package.yml \
  --input tag=v0.1.0 \
  --secret-file .secrets
```

Do not use a real publishing token for a local run. Prefer a dry-run or a
non-publishing fork of the workflow when testing locally. Never commit
`.secrets`.

## Rollback

1. If the workflow fails before `Publish package with npm provenance`, fix the
   release commit or workflow and rerun the same tag.
2. If npm publication succeeds but GitHub release or attestation steps fail,
   do not rerun the full workflow or republish the same version. Fix the
   operational failure, then create the missing GitHub release and upload a
   freshly generated archive and SBOM from the immutable tagged commit. Verify
   their attestations before publishing the release.
3. If a published version is materially unsafe, deprecate it immediately with
   `npm deprecate` and publish a higher patch version containing the fix. Do
   not delete or overwrite a published npm version.
4. Remove or correct the Git tag only when the release owner has confirmed the
   consequence for the immutable npm version and GitHub release. A corrected
   version gets a new tag; tags are not reused for different package contents.

Rollback cannot make an npm publication disappear from consumers who already
installed it. Deprecation plus a new patched version is the supported recovery.
