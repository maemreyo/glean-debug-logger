# src/hooks

**Core bootstrap module** - Initializes all interceptors (console, fetch, XHR).

## FILES

```
hooks/
└── useLogRecorder.ts    # Main hook (~15KB)
```

## WHERE TO LOOK

| Task                 | Location                          |
| -------------------- | --------------------------------- |
| Console interception | `useLogRecorder.ts` lines 96-152  |
| Fetch interception   | `useLogRecorder.ts` lines 154-238 |
| XHR interception     | `useLogRecorder.ts` lines 240-346 |
| Cleanup logic        | `useLogRecorder.ts` lines 348-351 |

## CONVENTIONS

- **Global interception**: All changes happen inside `useEffect` on mount
- **Prefix logging**: Internal logs use `[useLogRecorder]` prefix
- **Cleanup required**: Must restore originals on unmount (prevents memory leaks)
- **No direct exports**: Only `useLogRecorder` exported via `src/index.ts`

## ANTI-PATTERNS

- **No `console.log`** without prefix in this module
- **No state mutations** outside React hooks
- **No blocking operations** in interceptors (performance critical)
