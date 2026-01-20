# Draft: Logic Testing Implementation Plan

## Context

### User Goal

Test core logic of `glean-debug-logger` **BEFORE** refactoring DebugPanel UI components.

### Scope

- ✅ **IN**: Utility functions + useLogRecorder hook logic
- ❌ **EXCLUDE**: DebugPanel, DebugPanelMinimal (UI refactor coming later)

---

## Research Findings - COMPLETE

### 1. Utility Functions Analysis

| Function                 | File        | Test Status    | Complexity |
| ------------------------ | ----------- | -------------- | ---------- |
| `sanitizeData`           | sanitize.ts | ✅ Tested      | Medium     |
| `sanitizeFilename`       | sanitize.ts | ✅ Tested      | Low        |
| `getBrowserInfo`         | sanitize.ts | ❌ **MISSING** | Low        |
| **`collectMetadata`**    | sanitize.ts | ❌ **MISSING** | High       |
| `generateSessionId`      | filename.ts | ✅ Tested      | Low        |
| `generateFilename`       | filename.ts | ✅ Tested      | Medium     |
| `generateExportFilename` | filename.ts | ❌ **MISSING** | Low        |

### 2. useLogRecorder Hook Analysis

#### Returned Functions (8 total)

1. `downloadLogs(format?, customFilename?)` - Creates blob, triggers download
2. `uploadLogs(customEndpoint?)` - POST to endpoint
3. `clearLogs()` - Clear array + localStorage
4. `getLogs()` - Return copy of logs
5. `getLogCount()` - Return reactive count
6. `getMetadata()` - Return metadata
7. `sessionId` - Session identifier

#### Internal Logic Paths

- **Console interception**: 5 levels (log, error, warn, info, debug)
- **Fetch interception**: Request + Response + Error capture
- **XHR interception**: Open + Send + Headers + Load/Error events
- **localStorage**: Persist on mount + every log add
- **Max logs**: FIFO queue (shift oldest when > maxLogs)

### 3. Vitest Browser Mocking Patterns (from research)

#### Mocking window.fetch

```typescript
// Use vi.stubGlobal with vi.fn
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ data: 'test' }),
});
vi.stubGlobal('fetch', mockFetch);
```

#### Mocking XMLHttpRequest

```typescript
const mockXHR = {
  open: vi.fn(),
  send: vi.fn(),
  setRequestHeader: vi.fn(),
  addEventListener: vi.fn(),
  readyState: 4,
  status: 200,
  responseText: '{}',
};
const MockXHR = vi.fn(() => mockXHR);
vi.stubGlobal('XMLHttpRequest', MockXHR);
```

#### Mocking localStorage

```typescript
const storage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: vi.fn((k) => storage[k] || null),
  setItem: vi.fn((k, v) => {
    storage[k] = v;
  }),
  removeItem: vi.fn((k) => {
    delete storage[k];
  }),
};
vi.stubGlobal('localStorage', mockLocalStorage);
```

#### Mocking DOM for download

```typescript
const mockElement = {
  click: vi.fn(),
  setAttribute: vi.fn(),
  href: '',
  download: '',
};
vi.spyOn(document, 'createElement').mockImplementation((tag) => {
  if (tag === 'a') return mockElement;
  return originalCreateElement(tag);
});
```

### 4. React Hook Testing Patterns (from research)

#### Using renderHook from @testing-library/react

```typescript
import { renderHook, waitFor, act } from '@testing-library/react';

it('should capture logs', async () => {
  const { result } = renderHook(() => useLogRecorder());

  act(() => {
    console.log('test');
  });

  await waitFor(() => {
    expect(result.current.getLogs()).toHaveLength(1);
  });
});
```

#### Cleanup Strategy

```typescript
afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
```

---

## Test Coverage Plan

### Priority 1: Utility Functions (Easy Wins)

#### 1.1 collectMetadata() Tests - NEW

```typescript
describe('collectMetadata', () => {
  it('should return skeleton in SSR', () => {
    // Mock: typeof window === 'undefined'
    expect(result.environment).toBe('server');
  });

  it('should collect browser info in browser', () => {
    // Mock: window, navigator, Intl
    expect(result.browser).toBe('chrome');
    expect(result.timezone).toBeDefined();
  });

  it('should handle missing APIs gracefully', () => {
    // Mock: window.screen = undefined
    expect(result.screenResolution).toBe('unknown');
  });
});
```

#### 1.2 getBrowserInfo() Tests - NEW

```typescript
describe('getBrowserInfo', () => {
  it('should parse Chrome userAgent', () => {
    expect(getBrowserInfo('Mozilla/5.0...')).toBe('chrome');
  });
  it('should parse Safari userAgent', () => {
    expect(getBrowserInfo('Mozilla/5.0...Safari...')).toBe('safari');
  });
  it('should return unknown for unrecognized', () => {
    expect(getBrowserInfo('')).toBe('unknown');
  });
});
```

#### 1.3 generateExportFilename() Tests - NEW

```typescript
describe('generateExportFilename', () => {
  it('should map LogMetadata correctly', () => {
    const result = generateExportFilename(metadata, 'json');
    expect(result).toContain(metadata.sessionId);
    expect(result).toEndWith('.json');
  });
});
```

### Priority 2: useLogRecorder Hook Tests (Complex)

#### 2.1 Initialization Tests

```typescript
describe('useLogRecorder initialization', () => {
  it('should generate sessionId when not provided', () => {
    const { result } = renderHook(() => useLogRecorder());
    expect(result.current.sessionId).toMatch(/^session_\d+_/);
  });

  it('should use custom sessionId from config', () => {
    const { result } = renderHook(() => useLogRecorder({ sessionId: 'custom' }));
    expect(result.current.sessionId).toBe('custom');
  });

  it('should load persisted logs on mount', () => {
    // Mock localStorage with existing logs
    expect(getLogs()).toHaveLength(3);
  });
});
```

#### 2.2 Console Interception Tests

```typescript
describe('console interception', () => {
  it('should capture console.log calls', () => {
    console.log('test message');
    expect(getLogs()).toContainEqual(expect.objectContaining({ type: 'CONSOLE', level: 'LOG' }));
  });

  it('should preserve original console behavior', () => {
    const originalCalled = vi.fn();
    vi.spyOn(console, 'log').mockImplementation(() => originalCalled());
    console.log('test');
    expect(originalCalled).toHaveBeenCalled();
  });

  it('should capture all log levels', () => {
    console.error('err');
    console.warn('warn');
    console.info('info');
    console.debug('debug');
    const logs = getLogs();
    expect(logs).toContainEqual({ level: 'ERROR' });
    expect(logs).toContainEqual({ level: 'WARN' });
  });
});
```

#### 2.3 Fetch Interception Tests

```typescript
describe('fetch interception', () => {
  it('should capture fetch requests', async () => {
    await fetch('https://api.example.com/data');
    const logs = getLogs();
    expect(logs).toContainEqual(
      expect.objectContaining({ type: 'FETCH_REQ', url: 'https://api.example.com/data' })
    );
  });

  it('should capture fetch responses', async () => {
    await fetch('https://api.example.com/data');
    const logs = getLogs();
    expect(logs).toContainEqual(expect.objectContaining({ type: 'FETCH_RES', status: 200 }));
  });

  it('should exclude URLs in excludeUrls config', async () => {
    await fetch('https://api.example.com/api');
    await fetch('https://excluded.com/api');
    const logs = getLogs();
    expect(logs).toHaveLength(1);
  });

  it('should sanitize sensitive headers', async () => {
    await fetch('https://api.example.com', {
      headers: { Authorization: 'Bearer token123' },
    });
    const reqLog = logs.find((l) => l.type === 'FETCH_REQ');
    expect(reqLog.headers).not.toContain('Bearer token123');
  });
});
```

#### 2.4 Download/Upload Tests

```typescript
describe('downloadLogs', () => {
  it('should create download for JSON format', () => {
    const filename = downloadLogs('json');
    expect(filename).toEndWith('.json');
  });

  it('should return null in SSR', () => {
    expect(downloadLogs('json')).toBeNull();
  });
});

describe('uploadLogs', () => {
  it('should POST to configured endpoint', async () => {
    const result = await uploadLogs();
    expect(result.success).toBe(true);
  });

  it('should return error when no endpoint configured', async () => {
    const result = await uploadLogs();
    expect(result.success).toBe(false);
    expect(result.error).toContain('No endpoint');
  });
});
```

#### 2.5 Max Logs / Persistence Tests

```typescript
describe('maxLogs limit', () => {
  it('should remove oldest log when exceeding maxLogs', () => {
    // Add 5 logs with maxLogs = 3
    expect(getLogs()).toHaveLength(3);
  });
});

describe('persistence', () => {
  it('should save to localStorage on each log', () => {
    // Verify localStorage.setItem called
  });

  it('should handle localStorage errors gracefully', () => {
    // Verify no crash when localStorage full
  });
});
```

#### 2.6 Cleanup Tests

```typescript
describe('cleanup', () => {
  it('should restore original console methods', () => {
    unmount();
    expect(console.log).toBe(originalConsole.log);
  });

  it('should restore original fetch', () => {
    unmount();
    expect(window.fetch).toBe(originalFetch);
  });
});
```

---

## Files to Create

```
src/
├── utils/
│   └── metadata.test.ts        # NEW: collectMetadata, getBrowserInfo, generateExportFilename
├── hooks/
│   ├── useLogRecorder.test.ts  # NEW: Hook integration tests
│   └── __mocks__/
│       └── browser.ts          # NEW: Browser globals mock setup
```

---

## Technical Decisions

| Decision            | Choice                          | Reason                                     |
| ------------------- | ------------------------------- | ------------------------------------------ |
| Testing framework   | vitest + @testing-library/react | Already configured vitest, need renderHook |
| Browser environment | node + manual mocks             | Fastest, full control                      |
| Mocking strategy    | vi.stubGlobal + vi.spyOn        | Standard vitest approach                   |
| Coverage target     | 70-80%                          | Realistic for complex hook                 |

---

## Clearance Checklist

| Requirement                        | Status                                |
| ---------------------------------- | ------------------------------------- |
| Core objective defined?            | ✅ Test logic before UI refactor      |
| Scope boundaries established?      | ✅ Hook + utilities only, no UI       |
| Technical approach decided?        | ✅ vitest + renderHook + manual mocks |
| No critical ambiguities remaining? | ✅ All research complete              |
| Test strategy confirmed?           | ✅ Manual verification via commands   |

**ALL CLEAR - Ready for plan generation**
