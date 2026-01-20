# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-20 13:49 ICT
**Branch:** (staged changes, no commits)

## OVERVIEW

React/Next.js debug logging library. Captures console logs, network requests (Fetch + XHR), exports with smart filenames, supports server upload. Zero runtime dependencies (peer: React 17+).

## STRUCTURE

```
glean-debug-logger/
├── docs/
│   ├── idea.md           # Complete implementation specs + code
│   └── author.md         # Package metadata
├── src/                  # ← NOT YET CREATED
│   ├── hooks/
│   │   └── useLogRecorder.js
│   ├── components/
│   │   ├── DebugPanel.jsx
│   │   └── DebugPanelMinimal.jsx
│   ├── utils/
│   ├── types/
│   └── index.js
└── .gitignore
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Implementation specs | `docs/idea.md` | Full code + docs here |
| Package metadata | `docs/author.md` | npm name, author, repo |
| Future source | `src/` | Create this directory first |
| Backend examples | `docs/idea.md` → "backend upload" | Next.js, S3, Supabase, PostgreSQL |

## CONVENTIONS (THIS PROJECT)

- **Scoped package**: `@zaob/glean-debug-logger`
- **Build tool**: `tsup` (esbuild-based)
- **Test framework**: `vitest` + `@testing-library/react`
- **Zero dependencies**: Only peer dep is React
- **Dual format**: CJS + ESM output
- **TypeScript**: Generate `.d.ts` via tsup

## ANTI-PATTERNS (THIS PROJECT)

- ❌ **NEVER bundle React** → Must be `peerDependency`
- ❌ **NEVER include `node_modules/`** → Use `.npmignore` or `files` whitelist
- ❌ **NEVER publish source maps** → Use `sourcemap: false`
- ❌ **NEVER use default exports** → Use named exports for tree-shaking
- ❌ **NEVER exceed 20KB** → Bundle size limit

## UNIQUE STYLES

- **Smart filename templates**: `{env}_{userId}_{sessionId}_{timestamp}.json`
- **Metadata-rich exports**: Include browser, platform, screen, timezone
- **Auto-sanitization**: Redacts `password`, `token`, `apiKey`, `secret`
- **Rate limiting**: Upload endpoints must implement rate limiting

## COMMANDS

```bash
# Initialize project (not yet run)
npm init -y

# Install dev dependencies
npm install -D tsup vitest @testing-library/react eslint prettier

# Install peer dependencies (for dev)
npm install react react-dom

# Build
npm run build   # Creates dist/ folder

# Test
npm test

# Pack (local test)
npm pack
```

## GOTCHAS

1. **Blueprint phase**: No source code exists. Create `src/` directory first.
2. **Browser restriction**: Cannot set custom download path. Workaround: smart filenames or server upload.
3. **No commits yet**: Git has staged changes, run `git commit` after creating `AGENTS.md`.
4. **Package name**: Verify `@zaob/glean-debug-logger` is available on npm.

## NEXT STEPS (Priority)

1. Create `src/` directory with folder structure
2. Extract code from `docs/idea.md` into `src/`
3. Run `npm init` to create `package.json`
4. Copy config files from `docs/idea.md` → root
5. First commit
6. Test build with `npm run build`
