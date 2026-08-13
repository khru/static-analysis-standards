# Plugin security gates

The `plugin-quality` workflow applies blocking security checks to
`static-analysis-standards`. It runs on pull requests and pushes to `main`
when the plugin or this workflow changes. No security job uses
`continue-on-error`; a finding or scanner failure fails its job.

## Gates

- CodeQL analyzes the plugin's JavaScript and TypeScript source and publishes
  code-scanning results.
- Trivy scans the plugin filesystem for high and critical vulnerabilities,
  secrets, and misconfiguration; it then generates a CycloneDX SBOM and scans
  that SBOM for high and critical vulnerabilities.
- `pnpm audit --audit-level high` blocks high and critical dependency findings.
- OSV-Scanner checks the plugin's pinned pnpm lockfile against OSV.
- Gitleaks scans the complete repository history without publishing comments or
  artifacts.
- Dependabot updates GitHub Actions and the plugin's npm dependencies weekly.
- Scorecard runs on plugin changes, `main`, and a weekly schedule, publishing
  SARIF results.

## Pinning and limitations

Top-level actions are pinned to the release commit SHAs verified when this
workflow was added. Dependabot owns their update proposals. Trivy v0.30.0
currently invokes `aquasecurity/setup-trivy@v0.2.2` and `actions/cache@v4`
internally, so those transitive action references cannot be pinned from this
repository. The OSV-Scanner action is a Docker action and executes its
versioned scanner image; it does not expose a host-side executable or a
separate SARIF upload step in this workflow.

These gates prove scanner execution and block on the configured severities;
they do not replace remediation, secret rotation, dependency review, or branch
protection rules requiring the named status checks.
