# Draft: Unit Testing Implementation for glean-debug-logger

## Current Testing State

### Infrastructure (Already Working)

- **Framework**: vitest with v8 coverage
- **Config**: `vitest.config.ts` configured for node environment
- **Test command**: `npm run test`
- **Coverage reporters**: text, json, html
- **Existing coverage**: ~40% (utils only)

### Existing Test File

- `src/utils.test.ts` - Comprehensive tests for:
  - `sanitizeData()` - redaction logic
  - `sanitizeFilename()` - filename sanitization
  - `generateSessionId()` - session ID generation
  - `generateFilename()` - filename template parsing

## Requirements Summary

### User Clarification Needed

1. **Coverage target**: What % coverage is acceptable?
2. **Priority order**: Which components to test first?
3. **Component testing**: DebugPanel components need UI testing setup (React Testing Library)?

### What Needs Testing

| Priority | Component             | Complexity | Reason                              |
| -------- | --------------------- | ---------- | ----------------------------------- |
| 1        | `collectMetadata()`   | Medium     | Missing utility function test       |
| 2        | `useLogRecorder` hook | High       | Core functionality, complex mocking |
| 3        | `DebugPanel`          | Medium     | UI component, React Testing Library |
| 4        | `DebugPanelMinimal`   | Low        | Simple UI component                 |

## Testing Strategy

### 1. Utility Function Tests (Easy Wins)

Add tests for `collectMetadata()`:

- Environment detection
- User agent parsing
- Browser detection
- Platform detection

### 2. Hook Tests (useLogRecorder)

Requires mocking browser globals:

- `localStorage`
- `sessionStorage`
- `console.log/error/warn/info/debug`
- `window.fetch`
- `window.XMLHttpRequest`

Test scenarios:

- Log capture (console methods)
- Network interception (fetch, xhr)
- Persistence (localStorage read/write)
- Download functionality (blob creation)
- Upload functionality (fetch POST)
- Cleanup (restore originals)
- Configuration overrides

### 3. Component Tests (DebugPanel)

Requires:

- `@testing-library/react`
- `@testing-library/jest-dom` (optional for jest-dom matchers)

Test scenarios:

- Render without errors
- Keyboard shortcuts (Ctrl+Shift+D)
- Stats display
- Action buttons (download, upload, clear)
- Empty state handling

## Technical Decisions Needed

1. **Browser environment for tests**:
   - Keep `node` environment (current) + mock browser APIs
   - OR switch to `happy-dom` or `jsdom` for realistic browser simulation
2. **Mocking strategy**:
   - `vi.spyOn()` and `vi.mock()` from vitest
   - OR manual mocks for complex globals
3. **Component testing setup**:
   - Need to add React Testing Library if components need testing
   - vitest can test React components directly with `@testing-library/react`

## Research Findings

### Vitest + React Testing Library Pattern

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DebugPanel } from './DebugPanel';

it('renders debug panel', () => {
  render(<DebugPanel />);
  expect(screen.getByText('Debug Panel')).toBeInTheDocument();
});
```

### Mocking Browser Globals in Vitest

```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);
```

## Open Questions

1. **Should I add React Testing Library for component tests?**
2. **Target coverage percentage? (suggest 80%+)**
3. **Test priority order?**
4. **Keep node environment or switch to jsdom?**
