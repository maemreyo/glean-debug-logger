# src/utils

**Utility modules** - Pure functions for filename templating and data sanitization.

## FILES

```
utils/
├── filename.ts     # Filename template parser
├── sanitize.ts     # Sensitive data redaction
└── index.ts        # Barrel exports
```

## WHERE TO LOOK

| Task                     | Location                                |
| ------------------------ | --------------------------------------- |
| Add template placeholder | `filename.ts`                           |
| Add forbidden key        | `sanitize.ts` → `DEFAULT_SANITIZE_KEYS` |
| Safe JSON serialization  | `sanitize.ts` → `safeStringify`         |

## CONVENTIONS

- **Pure functions only** (no side effects)
- **No external dependencies** (zero runtime deps requirement)
- **Test file**: `src/utils.test.ts` (colocated)

## ANTI-PATTERNS

- **No `JSON.stringify`** → use `safeStringify` (handles circular refs)
- **No mutable operations** on input data
