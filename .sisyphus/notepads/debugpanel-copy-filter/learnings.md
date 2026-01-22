# DebugPanel Copy Filter - Learnings

## Project Background

- React/Next.js debug logging library that intercepts console logs, network requests
- Zero runtime deps (React is peer dependency)
- Named exports ONLY for tree-shaking
- Bundle < 20KB constraint

## Component Structure

- `src/components/DebugPanel.tsx` - Main debug panel component (615 lines)
- `src/components/DebugPanel.styles.ts` - Inline styles for the component
- `src/hooks/useLogRecorder.ts` - Core hook that manages log recording
- `src/types/index.ts` - Type definitions

## Key Log Types (from types/index.ts:6-13)

```typescript
type LogType =
  | 'CONSOLE'
  | 'FETCH_REQ'
  | 'FETCH_RES'
  | 'FETCH_ERR'
  | 'XHR_REQ'
  | 'XHR_RES'
  | 'XHR_ERR';
```

## Filter Categories (from plan)

- **logs**: CONSOLE entries (any level: log, error, warn, info, debug)
- **errors**: CONSOLE entries with level === 'ERROR'
- **network**: FETCH_REQ, FETCH_RES, XHR_REQ, XHR_RES (all network requests + responses)
- **networkErrors**: FETCH_ERR, XHR_ERR only

## Current Copy Implementation (DebugPanel.tsx:219-285)

- `handleCopy` function uses `getLogs()` which returns ALL logs
- Copy format stored in localStorage as `debug-panel-copy-format`
- Current format options: 'json' | 'ecs.json' | 'ai.txt'
- Status messages: `copyStatus` state with type ('success'|'error') and message
- Auto-clears after 3 seconds via useEffect (lines 297-305)

## Button Grid Pattern (DebugPanel.tsx:452-519)

- Uses `actionButtonStyles` from DebugPanel.styles.ts
- 3-column grid layout (6 buttons per row)
- Disabled state when `logCount === 0`
- Format: icon + text label

## State Pattern to Follow (DebugPanel.tsx:77-85)

```typescript
const [copyFormat, setCopyFormat] = useState<'json' | 'ecs.json' | 'ai.txt'>(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('debug-panel-copy-format');
    if (saved && ['json', 'ecs.json', 'ai.txt'].includes(saved)) {
      return saved as 'json' | 'ecs.json' | 'ai.txt';
    }
  }
  return 'ecs.json';
});
```

## Notepad Location

- Plan: `.sisyphus/plans/debugpanel-copy-filter.md`
- Notepads: `.sisyphus/notepads/debugpanel-copy-filter/`
