# Semantic Release Setup Plan

## Overview

Add semantic-release to automate version management and package publishing for `@zaob/glean-debug-logger`.

## Architecture Decision

### Option A: GitHub Actions (Recommended)

- ✅ Automatic on every push to main
- ✅ No local setup required
- ✅ Secure token management via GitHub secrets
- ✅ Parallel jobs for build/test/release

### Option B: CLI (Manual)

- Requires local semantic-release installation
- Manual token configuration
- Risk of inconsistent releases

**Decision**: Option A (GitHub Actions) - The industry standard for automated releases.

---

## What semantic-release Does

1. **Analyzes commit messages** (Conventional Commits format)
2. **Determines version bump** (major.minor.patch)
3. **Generates changelog** from commit messages
4. **Updates package.json version**
5. **Creates GitHub release** with changelog
6. **Publishes to npm** registry

---

## Required Packages

```bash
# Core
npm install --save-dev semantic-release

# Plugins (required for npm + GitHub)
npm install --save-dev @semantic-release/npm @semantic-release/github

# Optional but recommended
npm install --save-dev @semantic-release/changelog @semantic-release/git
```

---

## Configuration Files

### 1. `release.config.js`

```javascript
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/git',
  ],
};
```

### 2. `.github/workflows/release.yml`

```yaml
name: Release
on:
  push:
    branches: [main]

permissions:
  contents: read
  packages: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci

      - run: npm test

      - run: npm run build

      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## GitHub Secrets Required

### NPM_TOKEN

1. Go to https://www.npmjs.com/settings/TOKEN_NAME/accessTokens
2. Create granular token with:
   - Package: `@zaob/glean-debug-logger`
   - Permissions: Read and Publish
3. Copy token
4. Add to GitHub: Repository Settings → Secrets → New repository secret
   - Name: `NPM_TOKEN`
   - Value: [paste token]

### GITHUB_TOKEN

- Automatically available in GitHub Actions
- No setup required
- Used by @semantic-release/github plugin

---

## Conventional Commits Format

| Commit Type             | Description     | Version Bump |
| ----------------------- | --------------- | ------------ |
| `feat: add new feature` | New feature     | minor        |
| `fix: bug fix`          | Bug fix         | patch        |
| `feat!:` or `fix!:`     | Breaking change | major        |
| `chore: maintenance`    | No release      | none         |
| `docs: documentation`   | No release      | none         |
| `refactor: code change` | No feature/fix  | none         |
| `test: adding tests`    | No release      | none         |
| `perf: performance`     | No release      | none         |

---

## First Release Workflow

### Before First Release (Current State)

- Version: 1.0.0 (already set in package.json)
- Commits: None analyzed yet

### After First Release

1. Push to main with semantic-release config
2. GitHub Action triggers
3. semantic-release analyzes commits
4. First release created:
   - Changelog generated
   - GitHub release v1.0.0
   - Published to npm

---

## Release Channels

| Channel | npm dist-tag       | GitHub release |
| ------- | ------------------ | -------------- |
| Latest  | `latest` (default) | Default        |
| Beta    | `beta`             | Pre-release    |
| Next    | `next`             | Pre-release    |

Configure with `prereleaseBranches` in release.config.js

---

## Commit Message Linting (Optional but Recommended)

Add commitlint to enforce Conventional Commits:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

Add to package.json scripts:

```json
{
  "commitlint": "commitlint --from HEAD~1"
}
```

GitHub Actions commit linting also available.

---

## Rollback Strategy

### If Release Fails

1. GitHub Actions will show error
2. Check workflow logs
3. Fix issue locally
4. Amend or add new commit
5. Push to trigger again

### If Release Succeeded But Shouldn't Have

1. Delete GitHub release
2. Delete npm version: `npm unpublish @zaob/glean-debug-logger@version`
3. Amend commit with `--no-edit`
4. Force push: `git push --force`
5. **Warning**: Only works if no one has downloaded the package

---

## Timeline

1. Install semantic-release and plugins (5 min)
2. Create release.config.js (2 min)
3. Create GitHub Actions workflow (3 min)
4. Add NPM_TOKEN to GitHub secrets (5 min)
5. Push and test (2 min)
6. Verify first release (5 min)

**Total: ~22 minutes**

---

## Verification Checklist

- [x] semantic-release installed (verified via npm list)
- [x] release.config.js created (.releaserc created)
- [x] GitHub Actions workflow created (release.yml exists)
- [ ] NPM_TOKEN added to GitHub secrets (manual step, requires GitHub repo access)
- [ ] First push triggers workflow (requires manual push to main branch)
- [ ] GitHub release created (requires workflow to run)
- [ ] Package published to npm (requires workflow to run)
- [ ] Version bumped correctly (requires workflow to run)
