# NPM OIDC Trusted Publishing & Release Guide

This document outlines the final working configuration for automated publishing of `@zaob/glean-debug-logger` to npm using GitHub Actions OIDC Trusted Publishing. It also serves as a troubleshooting record for future reference.

## Background

The project `@zaob/glean-debug-logger` initially faced multiple failures when attempting to publish to npmjs.com through GitHub Actions, despite the workflow appearing to run successfully. This led to a deep dive into npm's OIDC (OpenID Connect) Trusted Publishing mechanism.

## Troubleshooting Journey

### Problems Encountered (in order)

1.  **Skipped Workflows**: Initial semantic-release commits included `[skip ci]`, which prevented GitHub Actions from triggering the release workflow for the actual publishing step.
2.  **Missing Plugin**: The `release.config.js` was missing the `@semantic-release/npm` plugin, meaning it only handled GitHub releases but never attempted to talk to npm.
3.  **Authentication Failures**: After adding the npm plugin, we encountered "Invalid npm token" (401/403) errors.
4.  **OIDC Misconfiguration**: Attempting to switch to OIDC Trusted Publishing initially failed with "package not found" errors because the publisher wasn't scoped correctly.
5.  **Environment Interference**: Attempting to fix authentication by setting `NODE_AUTH_TOKEN` actually broke the OIDC handshake, as `actions/setup-node@v4` handles this differently when OIDC is intended.
6.  **Permission Issues**: Even after the handshake worked, the granular access token needed specific "Bypass two-factor authentication" permissions for automated CI.

### Root Causes Identified

1.  **Commit Message Formatting**: `release.config.js` had `[skip ci]` in the default or custom commit message, causing GitHub to ignore the release commits.
2.  **Incomplete Release Config**: `release.config.js` lacked the essential `@semantic-release/npm` plugin for package registry interaction.
3.  **NODE_AUTH_TOKEN Conflict**: `actions/setup-node@v4` sets `NODE_AUTH_TOKEN` automatically when a `registry-url` is provided, which can interfere with `semantic-release`'s own npm authentication logic when using OIDC.
4.  **Registry Verification**: `@semantic-release/npm` requires a valid token during the `verifyConditions` step, but OIDC allows this to be fulfilled dynamically if configured correctly.
5.  **Trust Level**: Trusted Publishers must be configured at the **PACKAGE level** (`https://www.npmjs.com/package/@zaob/glean-debug-logger/settings`), not just at the Organization level.
6.  **Provenance Requirements**: Modern npm publishing with OIDC requires `provenance: true` to be set in both `package.json` and the release configuration.

---

## Final Working Configuration

### 1. GitHub Actions Workflow (`.github/workflows/release.yml`)

The workflow requires specific permissions for the `id-token` to allow the OIDC handshake with npm.

```yaml
permissions:
  id-token: write # Required for OIDC
  contents: write
  packages: write
  issues: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Important for semantic-release

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build package
        run: npm run build

      - name: Semantic Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_REGISTRY_URL: 'https://registry.npmjs.org/'
        run: npx semantic-release
```

### 2. Package Configuration (`package.json`)

The `publishConfig` must explicitly enable provenance.

```json
{
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

### 3. Semantic Release Config (`release.config.js`)

Ensure the npm plugin is included with `provenance: true`.

```javascript
module.exports = {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        /* ... */
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        /* ... */
      },
    ],
    [
      '@semantic-release/changelog',
      {
        /* ... */
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        provenance: true,
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'dist'],
        message: 'chore(release): ${nextRelease.version}\n\n${nextRelease.notes}',
        // Ensure NO [skip ci] is present here
      },
    ],
  ],
};
```

---

## npmjs.com Trusted Publisher Setup

To enable OIDC, you must configure the "Trusted Publisher" on npmjs.com:

1.  Navigate to: `https://www.npmjs.com/package/@zaob/glean-debug-logger/settings`
2.  Go to **"Publishing"** -> **"Trusted Publishers"**.
3.  Click **"Add a publisher"**.
4.  Select **GitHub**.
5.  Fill in the details:
    - **GitHub owner**: `maemreyo`
    - **Repository**: `glean-debug-logger`
    - **Workflow name**: `release.yml`
    - **Branch**: `main` (or `refs/heads/main`)

---

## Lessons Learned & Key Takeaways

1.  **No More Secrets**: OIDC Trusted Publishing does **NOT** require an `NPM_TOKEN` to be stored in GitHub Secrets. The authentication is short-lived and handled via a signed JWT (id-token).
2.  **Package Level Trust**: Always configure Trusted Publishers at the **PACKAGE level**. Organization-level settings are often insufficient for scoped packages.
3.  **Provenance is Mandatory**: For OIDC to work correctly and securely, `provenance: true` must be set. This links the npm package directly to the GitHub Actions run that built it.
4.  **Workflow Permissions**: The `id-token: write` permission is the most critical and often overlooked part of the YAML configuration.
5.  **Avoid Token Interference**: Do NOT set `NODE_AUTH_TOKEN: ''` or similar hacks. If configured correctly on npm, GitHub Actions automatically handles the token exchange.

## Result

- **Package**: `@zaob/glean-debug-logger`
- **Latest Version**: 1.5.0
- **Publish Method**: Fully automated OIDC Trusted Publishing (Secure, zero-maintenance tokens).
