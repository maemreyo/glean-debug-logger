# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-20T09:29:03Z
**Commit:** 6b8760f
**Branch:** main

## OVERVIEW

React/Next.js debug logging library that intercepts console logs, network requests (Fetch/XHR), and exports with smart filenames.

## STRUCTURE

```
./src/
├── components/   # DebugPanel (UI), DebugPanelMinimal
├── hooks/        # useLogRecorder (core bootstrap)
├── types/        # TypeScript interfaces
├── utils/        # Filename templating, sanitization
└── index.ts      # Named exports only

./examples/       # Backend integrations (Next.js, S3, PostgreSQL, Supabase)
```

## WHERE TO LOOK

| Task                    | Location                        | Notes                          |
| ----------------------- | ------------------------------- | ------------------------------ |
| Add console interceptor | `src/hooks/useLogRecorder.ts`   | Lines 96-152                   |
| Add network interceptor | `src/hooks/useLogRecorder.ts`   | Lines 154-346                  |
| Add sanitization rule   | `src/utils/sanitize.ts`         | Extend `DEFAULT_SANITIZE_KEYS` |
| Add filename template   | `src/utils/filename.ts`         | Add placeholder parser         |
| DebugPanel UI changes   | `src/components/DebugPanel.tsx` | Complex component (~15KB)      |

## CONVENTIONS

- **Named exports ONLY** (tree-shaking requirement)
- **Scope REQUIRED** in commit messages: `feat(hooks): ...`
- **Zero runtime deps** (React is peer dependency)
- **Bundle < 20KB** constraint
- **@ts-nocheck** injected in build artifacts

## ANTI-PATTERNS (THIS PROJECT)

- `TODO`/`FIXME` in release branches (forbidden)
- Unprefixed `console.log` in production code
- Default `JSON.stringify` (circular ref anti-pattern) → use `safeStringify`
- Empty commit scope (commitlint rejects)

## SECURITY (SANITIZATION)

Forbidden keys (auto-redacted from logs):

- `password`, `token`, `apiKey`, `secret`, `authorization`
- `creditCard`, `cardNumber`, `cvv`, `ssn`

## COMMANDS

```bash
npm run build      # tsup → dist (CJS + ESM)
npm run test       # vitest (node env)
npm run lint       # eslint
npm run format     # prettier
npm run release    # semantic-release → NPM
```

## NOTES

- Library uses **monkey-patching** of global `console`, `fetch`, `XMLHttpRequest`
- Cleanup restores originals on unmount
- Auto-saves to localStorage (`debug_logs` key)
- Examples show backend integration patterns only (no backend code in main package)
