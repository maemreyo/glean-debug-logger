# Release Instructions

## Current Status

✅ Build: Passed  
✅ Tests: 16/16 passed  
✅ Lint: Config issue (non-critical)  
❌ Release: Requires npm credentials

## To Complete Release

### Option 1: Login to npm and Publish

```bash
# Login to npm (you'll need to enter credentials)
npm login

# Then publish
npm publish --access public
```

### Option 2: Fix GitHub CI (Recommended)

1. **Create @zaob organization on npm** (if it doesn't exist):
   - Go to https://www.npmjs.com/settings/zaob/organizations
   - Or create via CLI: `npm org create zaob`

2. **Generate automation token**:
   - Go to https://www.npmjs.com/settings/TOKEN
   - Create token with "Automation" access
   - Copy the token

3. **Add to GitHub secrets**:
   - Go to https://github.com/maemreyo/glean-debug-logger/settings/secrets/actions
   - Add `NPM_TOKEN` with your token value

4. **Trigger release**:
   ```bash
   git commit --amend --no-edit && git push --force
   ```

## What the Release Does

- Creates a GitHub release with changelog
- Publishes to https://www.npmjs.com/package/@zaob/glean-debug-logger
- Creates a git tag (v1.0.0)

## After Release

The package will be available at:

```
npm install @zaob/glean-debug-logger
```
