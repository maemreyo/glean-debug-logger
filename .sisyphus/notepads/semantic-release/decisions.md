# Decisions - Semantic Release Setup

## Date: 2026-01-22

## Decision: Use GitHub Actions for Semantic Release

### Options Considered

1. **Option A: GitHub Actions (Recommended)**
   - ✅ Automatic on every push to main
   - ✅ No local setup required
   - ✅ Secure token management via GitHub secrets
   - ✅ Parallel jobs for build/test/release

2. **Option B: CLI (Manual)**
   - ❌ Requires local semantic-release installation
   - ❌ Manual token configuration
   - ❌ Risk of inconsistent releases

### Decision Made

**Selected: Option A (GitHub Actions)** - The industry standard for automated releases.

### Rationale

1. **Security**: GitHub secrets (NPM_TOKEN) are more secure than local configuration files
2. **Automation**: No manual release commands - happens automatically on push
3. **CI/CD Integration**: Builds and tests run in GitHub Actions before release
4. **Industry Standard**: Most npm packages use GitHub Actions for releases
5. **Scalability**: Works across multiple contributors without local setup requirements

### Configuration Details

**File**: `.releaserc` (JavaScript module.exports, not JSON)

- Used `module.exports` instead of `export default` for broader Node.js compatibility
- Configured with commit analyzer, release notes generator, changelog, npm, github, and git plugins

**Workflow**: `.github/workflows/release.yml`

- Triggers on push to main/beta branches
- Runs semantic-release with GITHUB_TOKEN and NPM_TOKEN from secrets
- Outputs version and channel for verification
- Includes verify step to confirm release

### Conventional Commits Format Enforced

Commit message linting is already configured in package.json:

```json
{
  "devDependencies": {
    "@commitlint/cli": "^20.3.1",
    "@commitlint/config-conventional": "^20.3.1"
  }
}
```

This ensures all commits follow the conventional commits format required by semantic-release for proper version bumping.

### Release Channels Configured

| Channel | npm dist-tag       | GitHub release | Use Case            |
| ------- | ------------------ | -------------- | ------------------- |
| Latest  | `latest` (default) | Default        | Production releases |
| Beta    | `beta`             | Pre-release    | Feature testing     |
| Next    | `next`             | Pre-release    | Canary builds       |

The plan supports pre-release branches (main for latest, beta for beta), enabling staging releases.
