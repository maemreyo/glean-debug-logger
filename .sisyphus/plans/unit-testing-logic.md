# Unit Testing Implementation for glean-debug-logger

## Context

### Original Request

Implement unit testing for `glean-debug-logger` to ensure logic correctness before refactoring DebugPanel UI components.

### Interview Summary

**Key Discussions**:

- User wants to test core logic ONLY (hook + utilities)
- UI components (DebugPanel, DebugPanelMinimal) will be tested AFTER refactor
- Current state: vitest configured, `src/utils.test.ts` exists with utility tests
- Missing tests: `collectMetadata()`, `getBrowserInfo()`, `generateExportFilename()` utilities
- Hook (`useLogRecorder`) is completely untested and complex

**Research Findings**:

- Utility functions needing tests: `collectMetadata()`, `getBrowserInfo()`, `generateExportFilename()`
- Hook has 8 returned functions: `downloadLogs`, `uploadLogs`, `clearLogs`, `getLogs`, `getLogCount`, `getMetadata`, `sessionId`
- Hook internal logic: console/fetch/XHR interception, localStorage persistence, maxLogs FIFO queue
- Mocking strategy: vi.stubGlobal for fetch/XMLHttpRequest/localStorage/DOM
- Cleanup logic EXISTS (verified in lines 147-151 of useLogRecorder.ts)
- Environment: node (not jsdom) - manual browser mocks required

### Metis Review

**Identified Gaps** (addressed):

- Coverage target: 80% (confirmed with user)
- Environment: node + manual mocks (confirmed with user)
- Error cases: YES - detailed testing required (confirmed with user)
- Cleanup verification: OK (verified cleanup logic exists)

---

## Work Objectives

### Core Objective

Implement comprehensive unit tests for core logic (hook + utilities) to ensure correctness before DebugPanel UI refactor.

### Concrete Deliverables

- `src/utils/metadata.test.ts` - Tests for `collectMetadata()`, `getBrowserInfo()`, `generateExportFilename()`
- `src/hooks/__mocks__/browser.ts` - Browser globals mock setup
- `src/hooks/useLogRecorder.test.ts` - Comprehensive hook integration tests

### Definition of Done

- [ ] `npm run test` passes with 0 failures
- [ ] Coverage report shows ≥80% overall coverage
- [ ] All critical paths tested (console, fetch, XHR interception)
- [ ] All error handling scenarios tested
- [ ] Cleanup/restoration verified

### Must Have

- Console interception tests (log, error, warn, info, debug)
- Fetch interception tests (request + response capture)
- localStorage persistence tests
- maxLogs FIFO queue tests
- Metadata collection tests
- Error handling tests (storage failures, network failures, DOM failures)
- Cleanup verification tests

### Must NOT Have (Guardrails)

- Tests for DebugPanel/DebugPanelMinimal components
- E2E-style workflow tests
- Property-based tests
- Performance benchmarks
- Visual regression tests
- Test infrastructure changes (keep vitest.config.ts as-is)

---

## Verification Strategy

### Test Decision

- **Infrastructure exists**: YES (vitest configured)
- **User wants tests**: YES - detailed error cases required
- **Framework**: vitest (already configured)
- **Coverage target**: 80%

### Test Infrastructure

**Existing** (no changes needed):

```bash
npm run test                    # Run all tests
npm run test -- --coverage      # Generate coverage report
```

**Pattern to follow**:

- `src/**/*.test.ts` and `src/**/*.test.tsx` files are auto-discovered
- Coverage excludes `node_modules/`, `dist/`, `**/*.test.{ts,tsx}`, `**/*.d.ts`

### Test Setup

**Browser Mock Setup** (`src/hooks/__mocks__/browser.ts`):

- `localStorage` with vi.fn() spies
- `window.fetch` mock with response tracking
- `XMLHttpRequest` mock class
- `document.createElement/appendChild/click/removeChild` spies
- `URL.createObjectURL/revokeObjectURL` mocks
- `navigator.userAgent`, `navigator.platform` stubs
- `Intl.DateTimeFormat().resolvedOptions().timeZone` stub

**Cleanup per test**:

```typescript
afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
```

---

## Task Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        SETUP PHASE                              │
│  1. Create browser mocks file                                   │
│  2. Create metadata tests file                                  │
│  3. Create hook tests file                                      │
│                                                                 │
│  ↓ Parallel when independent                                    │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  METADATA TESTS  │    │  MOCK UTILS      │                   │
│  │  (3 functions)   │    │  (shared mock)   │                   │
│  └──────────────────┘    └──────────────────┘                   │
│           ↓                        ↓                            │
│           └────────────┬─────────────────┘                      │
│                        ↓                                        │
│                 ┌──────────────────┐                            │
│                 │  HOOK TESTS      │                            │
│                 │  (comprehensive) │                            │
│                 └──────────────────┘                            │
│                        ↓                                        │
│                        ↓                                        │
│                 ┌──────────────────┐                            │
│                 │  VERIFY          │                            │
│                 │  80% coverage    │                            │
│                 └──────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

## Parallelization

| Group | Tasks      | Reason                       |
| ----- | ---------- | ---------------------------- |
| A     | 2, 3       | Can be created independently |
| B     | 4, 5, 6, 7 | All use hook with mocks      |
| C     | 8          | Depends on all tests passing |

| Task | Depends On | Reason                  |
| ---- | ---------- | ----------------------- |
| 4    | 2          | Uses browser mocks      |
| 5    | 2          | Uses browser mocks      |
| 6    | 2          | Uses browser mocks      |
| 7    | 2          | Uses browser mocks      |
| 8    | 4, 5, 6, 7 | Needs all tests written |

---

## TODOs

- [ ] 1. Create browser globals mock setup file

  **What to do**:
  - Create `src/hooks/__mocks__/browser.ts`
  - Export `setupBrowserMocks()` function
  - Export `teardownBrowserMocks()` function
  - Mock all browser globals needed by hook and utilities

  **Must NOT do**:
  - Mock anything not used by the code under test
  - Add complex mock factories (use vi.fn() directly)

  **Parallelizable**: YES (standalone utility)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/utils.test.ts:1-30` - Test imports and setup patterns (vi.fn, describe, it, expect)

  **Hook References** (functions to mock):
  - `src/hooks/useLogRecorder.ts:105-111` - console.log/error/warn/info/debug patching
  - `src/hooks/useLogRecorder.ts:155` - window.fetch patching
  - `src/hooks/useLogRecorder.ts:401-407` - document.createElement/a.click/removeChild
  - `src/hooks/useLogRecorder.ts:400` - URL.createObjectURL
  - `src/hooks/useLogRecorder.ts:463` - localStorage.setItem/getItem/removeItem

  **WHY Each Reference Matters**:
  - Console mock needs same 5 methods as originalConsole
  - Fetch mock needs to support both fetch(url) and fetch(url, options)
  - DOM mock needs to support anchor element with href, download, click
  - localStorage mock needs getItem, setItem, removeItem

  **Acceptance Criteria**:
  - [ ] File created: `src/hooks/__mocks__/browser.ts`
  - [ ] Exports `setupBrowserMocks()` function
  - [ ] Exports `teardownBrowserMocks()` function
  - [ ] `localStorage` mock has: getItem, setItem, removeItem, clear (all vi.fn())
  - [ ] `window.fetch` mock: vi.fn() returning Promise<Response>
  - [ ] `XMLHttpRequest` mock class exists
  - [ ] `document.createElement('a')` returns mock anchor element
  - [ ] `URL.createObjectURL()` returns 'blob:...' string
  - [ ] `navigator.userAgent` mocked to 'Mozilla/5.0 Chrome'
  - [ ] `Intl.DateTimeFormat().resolvedOptions().timeZone` mocked to 'UTC'

  **Manual Execution Verification**:
  - [ ] Command: `ls src/hooks/__mocks__/browser.ts` → file exists
  - [ ] Command: `head -20 src/hooks/__mocks__/browser.ts` → shows imports and setup function

  **Commit**: YES
  - Message: `test(hooks): add browser globals mock setup`
  - Files: `src/hooks/__mocks__/browser.ts`

---

- [ ] 2. Create metadata utility tests file

  **What to do**:
  - Create `src/utils/metadata.test.ts`
  - Test `collectMetadata()` function (SSR + browser detection)
  - Test `getBrowserInfo()` function (userAgent parsing)
  - Test `generateExportFilename()` function (filename generation)

  **Must NOT do**:
  - Modify existing `src/utils.test.ts`
  - Test anything not related to metadata functions

  **Parallelizable**: YES (standalone file)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/utils.test.ts:1-50` - Test structure and naming conventions
  - `src/utils.test.ts:60-120` - sanitizeData tests (similar complexity)
  - `src/utils.test.ts:200-280` - generateFilename tests (template parsing)

  **Implementation References** (functions to test):
  - `src/utils/sanitize.ts:58-85` - collectMetadata() function
  - `src/utils/sanitize.ts:25-56` - getBrowserInfo() function
  - `src/utils/filename.ts:80-95` - generateExportFilename() function

  **Type References** (contracts to implement against):
  - `src/types/index.ts:LogMetadata` - Metadata interface
  - `src/types/index.ts:MetadataConfig` - Config interface

  **WHY Each Reference Matters**:
  - sanitize.test.ts shows how to structure sanitize utility tests
  - filename.test.ts shows template parsing test patterns
  - collectMetadata needs to handle SSR (window === 'undefined')

  **Acceptance Criteria**:

  **collectMetadata() tests**:
  - [ ] Test: SSR environment returns skeleton metadata
    - Mock: `typeof window === 'undefined'`
    - Verify: `result.environment === 'server'`, `result.browser === 'unknown'`
  - [ ] Test: Browser environment returns full metadata
    - Mock: `window`, `navigator.userAgent`, `Intl`
    - Verify: `result.environment === 'browser'`, `result.browser === 'chrome'`
  - [ ] Test: Chrome userAgent detection
    - Mock: `navigator.userAgent = 'Mozilla/5.0 Chrome/120.0.0.0...'`
    - Verify: `result.browser === 'chrome'`
  - [ ] Test: Safari userAgent detection
    - Mock: `navigator.userAgent = 'Mozilla/5.0 Safari/605.1.15'`
    - Verify: `result.browser === 'safari'`
  - [ ] Test: Firefox userAgent detection
    - Mock: `navigator.userAgent = 'Mozilla/5.0 Firefox/120.0'`
    - Verify: `result.browser === 'firefox'`
  - [ ] Test: Unknown browser returns 'unknown'
    - Mock: `navigator.userAgent = 'Unknown Bot'`
    - Verify: `result.browser === 'unknown'`
  - [ ] Test: Timezone detection works
    - Mock: `Intl.DateTimeFormat().resolvedOptions().timeZone = 'America/New_York'`
    - Verify: `result.timezone === 'America/New_York'`
  - [ ] Test: Screen resolution detection
    - Mock: `window.screen.width = 1920`, `window.screen.height = 1080`
    - Verify: `result.screenResolution === '1920x1080'`
  - [ ] Test: Missing screen returns 'unknown'
    - Mock: `window.screen = undefined`
    - Verify: `result.screenResolution === 'unknown'`
  - [ ] Test: Inner dimensions detection
    - Mock: `window.innerWidth = 1280`, `window.innerHeight = 720`
    - Verify: `result.viewport === '1280x720'`

  **getBrowserInfo() tests**:
  - [ ] Test: Chrome 120+
    - Input: `'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36'`
    - Verify: `'chrome'`
  - [ ] Test: Safari 17+
    - Input: `'Mozilla/5.0 AppleWebKit/605.1.15 Safari/605.1.15'`
    - Verify: `'safari'`
  - [ ] Test: Firefox 120+
    - Input: `'Mozilla/5.0 Firefox/120.0'`
    - Verify: `'firefox'`
  - [ ] Test: Edge 120+
    - Input: `'Mozilla/5.0 Chrome/120.0.0.0 Edg/120.0.0.0'`
    - Verify: `'edge'`
  - [ ] Test: Empty string returns 'unknown'
    - Input: `''`
    - Verify: `'unknown'`
  - [ ] Test: Unknown userAgent returns 'unknown'
    - Input: `'CustomBrowser/1.0'`
    - Verify: `'unknown'`

  **generateExportFilename() tests**:
  - [ ] Test: JSON format with sessionId
    - Input: `metadata = { sessionId: 'abc123' }`, `format = 'json'`
    - Verify: filename ends with `.json`, contains sessionId
  - [ ] Test: TXT format
    - Input: `metadata = { sessionId: 'abc123' }`, `format = 'txt'`
    - Verify: filename ends with `.txt`
  - [ ] Test: Empty metadata still generates filename
    - Input: `metadata = {}`, `format = 'json'`
    - Verify: filename is defined, follows pattern

  **Manual Execution Verification**:
  - [ ] Command: `npm run test -- src/utils/metadata.test.ts` → PASS
  - [ ] Coverage: `npm run test -- src/utils/metadata.test.ts --coverage` → View html report

  **Commit**: YES
  - Message: `test(utils): add metadata utility tests`
  - Files: `src/utils/metadata.test.ts`

---

- [ ] 3. Create useLogRecorder hook tests file

  **What to do**:
  - Create `src/hooks/useLogRecorder.test.ts`
  - Import `renderHook` from @testing-library/react
  - Import browser mock setup from `__mocks__/browser`
  - Test all hook functionality with detailed error cases

  **Must NOT do**:
  - Test UI components
  - Skip error handling tests (user requested detailed error cases)

  **Parallelizable**: YES (standalone file, depends on mock file)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/utils.test.ts:1-50` - Test structure conventions
  - `src/utils.test.ts:80-100` - Mock patterns using vi.fn()

  **Hook References** (functions to test):
  - `src/hooks/useLogRecorder.ts:96-492` - Full hook implementation
  - `src/hooks/useLogRecorder.ts:102-151` - Console interception + cleanup
  - `src/hooks/useLogRecorder.ts:154-235` - Fetch interception
  - `src/hooks/useLogRecorder.ts:237-320` - XHR interception
  - `src/hooks/useLogRecorder.ts:380-416` - downloadLogs function
  - `src/hooks/useLogRecorder.ts:418-455` - uploadLogs function
  - `src/hooks/useLogRecorder.ts:457-468` - clearLogs function
  - `src/hooks/useLogRecorder.ts:470-480` - getLogs, getLogCount, getMetadata

  **Type References** (contracts to implement against):
  - `src/types/index.ts:UseLogRecorderConfig` - Config interface
  - `src/types/index.ts:LogEntry` - Log entry interface
  - `src/types/index.ts:LogMetadata` - Metadata interface

  **Testing Library Reference**:
  - `renderHook(() => useLogRecorder())` - Render hook in isolation
  - `waitFor(() => {})` - Wait for async assertions
  - `act(() => {})` - Trigger synchronous state changes

  **WHY Each Reference Matters**:
  - renderHook provides isolated hook testing without full component render
  - Console/fetch/XHR sections show what needs mocking
  - downloadLogs/uploadLogs show DOM and network dependencies

  **Acceptance Criteria**:

  **Setup and Initialization**:
  - [ ] Test: Hook returns all 7 expected functions
    - Verify: `{ downloadLogs, uploadLogs, clearLogs, getLogs, getLogCount, getMetadata, sessionId }` all present
  - [ ] Test: Generates sessionId on mount if not provided
    - Verify: `result.current.sessionId` matches pattern `session_\d+_...`
  - [ ] Test: Uses custom sessionId from config
    - Config: `{ sessionId: 'custom-id' }`
    - Verify: `result.current.sessionId === 'custom-id'`
  - [ ] Test: Loads persisted logs from localStorage on mount
    - Mock: localStorage with `[{ type: 'CONSOLE', level: 'LOG' }]`
    - Verify: `result.current.getLogs()` returns persisted logs

  **Console Interception**:
  - [ ] Test: Captures console.log calls
    - Action: `console.log('test message')`
    - Verify: Logs contain entry with `type: 'CONSOLE'`, `level: 'LOG'`
  - [ ] Test: Captures console.error calls
    - Action: `console.error('error msg')`
    - Verify: Logs contain entry with `level: 'ERROR'`
  - [ ] Test: Captures console.warn calls
    - Action: `console.warn('warn msg')`
    - Verify: Logs contain entry with `level: 'WARN'`
  - [ ] Test: Captures console.info calls
    - Action: `console.info('info msg')`
    - Verify: Logs contain entry with `level: 'INFO'`
  - [ ] Test: Captures console.debug calls
    - Action: `console.debug('debug msg')`
    - Verify: Logs contain entry with `level: 'DEBUG'`
  - [ ] Test: Preserves original console behavior
    - Mock: Track original console.log calls
    - Action: `console.log('test')`
    - Verify: Original function was called (not just mocked)
  - [ ] Test: Handles circular references gracefully
    - Action: `console.log({ self: {} })` where `self.self = self`
    - Verify: Log entry exists, no crash
  - [ ] Test: Truncates long log data to 5000 chars
    - Action: `console.log('x'.repeat(10000))`
    - Verify: Log data length ≤ 5000

  **Fetch Interception**:
  - [ ] Test: Captures fetch GET requests
    - Action: `fetch('https://api.example.com/data')`
    - Verify: Logs contain FETCH_REQ with url, method: 'GET'
  - [ ] Test: Captures fetch POST requests with body
    - Action: `fetch('https://api.example.com', { method: 'POST', body: JSON.stringify({a:1}) })`
    - Verify: Logs contain FETCH_REQ with method: 'POST', body captured
  - [ ] Test: Captures fetch responses
    - Action: `fetch('https://api.example.com')`
    - Verify: Logs contain FETCH_RES with status, statusText
  - [ ] Test: Excludes URLs matching excludeUrls config
    - Config: `{ excludeUrls: ['https://excluded.com'] }`
    - Action: `fetch('https://excluded.com/api')` + `fetch('https://tracked.com/api')`
    - Verify: Only tracked.com URL appears in logs
  - [ ] Test: Sanitizes Authorization header
    - Action: `fetch('https://api.example.com', { headers: { Authorization: 'Bearer secret' } })`
    - Verify: FETCH_REQ headers do NOT contain 'Bearer secret'
  - [ ] Test: Sanitizes other sensitive keys
    - Action: `fetch('https://api.example.com', { body: JSON.stringify({ password: 'hunter2', token: 'abc' }) })`
    - Verify: Request body sanitized, original values not present
  - [ ] Test: Captures fetch errors (network failure)
    - Mock: fetch throws Error
    - Action: `fetch('https://api.example.com')`
    - Verify: Log captured with error info

  **XHR Interception**:
  - [ ] Test: Captures XHR open events
    - Action: `const xhr = new XMLHttpRequest(); xhr.open('GET', 'https://api.example.com');`
    - Verify: Logs contain XHR_REQ with method, url
  - [ ] Test: Captures XHR send events
    - Action: `const xhr = new XMLHttpRequest(); xhr.open('POST', 'https://api.example.com'); xhr.send('data');`
    - Verify: Logs contain XHR_REQ with body
  - [ ] Test: Captures XHR load events (response received)
    - Mock: XHR triggers load event
    - Action: Complete XHR request
    - Verify: Logs contain XHR_RES with status, responseText

  **maxLogs FIFO Queue**:
  - [ ] Test: Logs stop at maxLogs limit
    - Config: `{ maxLogs: 3 }`
    - Action: Add 5 logs
    - Verify: `getLogs()` returns only 3 logs
  - [ ] Test: Oldest logs are removed first (FIFO)
    - Config: `{ maxLogs: 2 }`
    - Action: Add logs labeled 1, 2, 3, 4
    - Verify: Logs contain only 3, 4 (1, 2 removed)
  - [ ] Test: maxLogs = 0 allows no logs
    - Config: `{ maxLogs: 0 }`
    - Action: Add logs
    - Verify: `getLogs()` returns empty array
  - [ ] Test: maxLogs = Infinity allows unlimited logs
    - Config: `{ maxLogs: Infinity }`
    - Action: Add 100 logs
    - Verify: `getLogs()` returns 100 logs

  **localStorage Persistence**:
  - [ ] Test: Saves logs to localStorage on each log add
    - Mock: Track localStorage.setItem calls
    - Action: Add a log
    - Verify: localStorage.setItem called with persistenceKey
  - [ ] Test: Loads logs from localStorage on mount
    - Mock: localStorage.getItem returns persisted logs
    - Action: Render hook
    - Verify: getLogs returns persisted data
  - [ ] Test: clearLogs removes localStorage entry
    - Action: `result.current.clearLogs()`
    - Verify: localStorage.removeItem called
  - [ ] Test: Handles localStorage.getItem throwing (quota full)
    - Mock: localStorage.getItem throws Error
    - Action: Render hook
    - Verify: No crash, graceful handling
  - [ ] Test: Handles localStorage.setItem throwing (quota full)
    - Mock: localStorage.setItem throws Error
    - Action: Add log
    - Verify: No crash, error logged to console.warn
  - [ ] Test: Persistence disabled when enablePersistence = false
    - Config: `{ enablePersistence: false }`
    - Action: Add log
    - Verify: localStorage not accessed

  **downloadLogs Function**:
  - [ ] Test: Returns filename for JSON format
    - Action: `const filename = result.current.downloadLogs('json')`
    - Verify: filename ends with `.json`, contains sessionId
  - [ ] Test: Returns filename for TXT format
    - Action: `const filename = result.current.downloadLogs('txt')`
    - Verify: filename ends with `.txt`
  - [ ] Test: Includes metadata when includeMetadata = true
    - Config: `{ includeMetadata: true }`
    - Action: `downloadLogs('json')`
    - Verify: Blob content contains metadata
  - [ ] Test: Excludes metadata when includeMetadata = false
    - Config: `{ includeMetadata: false }`
    - Action: `downloadLogs('json')`
    - Verify: Blob content is only logs array
  - [ ] Test: Uses custom filename when provided
    - Action: `downloadLogs('json', 'custom-name')`
    - Verify: filename contains 'custom-name'
  - [ ] Test: Returns null in SSR environment
    - Mock: `typeof window === 'undefined'`
    - Action: `downloadLogs('json')`
    - Verify: Returns null, no error
  - [ ] Test: Handles DOM exception during download
    - Mock: document.createElement throws
    - Action: `downloadLogs('json')`
    - Verify: Returns null, console.error logged
  - [ ] Test: Custom filename sanitization
    - Action: `downloadLogs('json', '../../../etc/passwd')`
    - Verify: Filename sanitized, no path traversal

  **uploadLogs Function**:
  - [ ] Test: Returns error when no endpoint configured
    - Config: `{ uploadEndpoint: undefined }`
    - Action: `await uploadLogs()`
    - Verify: `{ success: false, error: 'No endpoint configured' }`
  - [ ] Test: Uses custom endpoint when provided
    - Config: `{ uploadEndpoint: 'https://default.com' }`
    - Action: `await uploadLogs('https://custom.com')`
    - Verify: fetch called with custom endpoint
  - [ ] Test: POSTs to configured endpoint
    - Config: `{ uploadEndpoint: 'https://api.example.com/logs' }`
    - Mock: fetch returns ok response
    - Action: `await uploadLogs()`
    - Verify: fetch called with correct URL and method
  - [ ] Test: Sends metadata and logs in payload
    - Config: `{ uploadEndpoint: 'https://api.example.com', includeMetadata: true }`
    - Action: `await uploadLogs()`
    - Verify: fetch body contains metadata and logs
  - [ ] Test: Returns success on 200 response
    - Mock: fetch returns Response with ok: true
    - Action: `await uploadLogs()`
    - Verify: `{ success: true, data: responseData }`
  - [ ] Test: Returns error on non-200 response
    - Mock: fetch returns Response with status: 500
    - Action: `await uploadLogs()`
    - Verify: `{ success: false, error: 'Upload failed: 500' }`
  - [ ] Test: Returns error on network failure
    - Mock: fetch throws Error
    - Action: `await uploadLogs()`
    - Verify: `{ success: false, error: errorMessage }`
  - [ ] Test: Sanitizes payload before upload
    - Config: `{ sanitizeKeys: ['password'] }`
    - Action: `await uploadLogs()`
    - Verify: fetch body does NOT contain sensitive keys
  - [ ] Test: Content-Type is application/json
    - Action: `await uploadLogs()`
    - Verify: fetch headers include 'Content-Type': 'application/json'

  **clearLogs Function**:
  - [ ] Test: Clears all logs from state
    - Action: Add logs, then `clearLogs()`
    - Verify: `getLogs()` returns empty array
  - [ ] Test: Resets log count to 0
    - Action: Add logs, then `clearLogs()`
    - Verify: `getLogCount()` returns 0
  - [ ] Test: Removes localStorage entry
    - Action: `clearLogs()`
    - Verify: localStorage.removeItem called

  **getLogs Function**:
  - [ ] Test: Returns copy of logs array (not reference)
    - Action: `const logs1 = getLogs(); logs1.push({})`
    - Verify: `getLogs()` returns original array without mutation

  **getLogCount Function**:
  - [ ] Test: Returns reactive count
    - Action: Add 3 logs
    - Verify: `getLogCount()` returns 3

  **getMetadata Function**:
  - [ ] Test: Returns metadata object
    - Action: `const metadata = getMetadata()`
    - Verify: metadata has sessionId, browser, timezone, etc.
  - [ ] Test: Returns copy (not reference)
    - Action: `const meta1 = getMetadata(); meta1.sessionId = 'hacked'`
    - Verify: `getMetadata()` returns original sessionId

  **Cleanup and Restoration**:
  - [ ] Test: Restores console methods on unmount
    - Mock: Track original console.log
    - Action: unmount()
    - Verify: `console.log === originalConsole.log`
  - [ ] Test: Restores window.fetch on unmount
    - Mock: Store original fetch
    - Action: unmount()
    - Verify: `window.fetch === originalFetch`
  - [ ] Test: Restores XMLHttpRequest on unmount
    - Mock: Store original XHR
    - Action: unmount()
    - Verify: `window.XMLHttpRequest === originalXHR`

  **Error Handling - Comprehensive**:
  - [ ] Test: Handles JSON.stringify failure gracefully
    - Action: console.log with object that throws on stringify
    - Verify: Log captured with String(arg) fallback, no crash
  - [ ] Test: Handles localStorage disabled (private mode)
    - Mock: localStorage methods throw
    - Action: Add log
    - Verify: No crash, console.warn logged
  - [ ] Test: Handles fetch Response clone failure
    - Mock: response.clone() throws
    - Action: fetch that returns non-cloneable response
    - Verify: Error caught, handled gracefully
  - [ ] Test: Handles XHR constructor failure
    - Mock: XMLHttpRequest constructor throws
    - Action: Use XHR
    - Verify: No crash, error logged
  - [ ] Test: Handles invalid JSON in response
    - Mock: response.json() throws
    - Action: fetch returns non-JSON response
    - Verify: Response body is '[Unable to parse response]'
  - [ ] Test: Handles response body too large (>1000 chars)
    - Mock: response text is 5000 chars
    - Action: fetch returns large response
    - Verify: Response body truncated to 1000 chars
  - [ ] Test: Handles concurrent hook instances
    - Action: Render hook twice, add logs to first
    - Verify: Second hook instance not affected

  **Manual Execution Verification**:
  - [ ] Command: `npm run test -- src/hooks/useLogRecorder.test.ts` → PASS
  - [ ] Coverage: `npm run test -- src/hooks/useLogRecorder.test.ts --coverage` → 80%+
  - [ ] Command: `npm run test` → All tests pass

  **Commit**: YES
  - Message: `test(hooks): add useLogRecorder comprehensive tests`
  - Files: `src/hooks/useLogRecorder.test.ts`

---

- [ ] 4. Verify all tests pass

  **What to do**:
  - Run full test suite
  - Verify no failures
  - Check coverage meets 80% target

  **Must NOT do**:
  - Modify test files to make them pass (fix code instead)

  **References**:
  - `package.json:scripts.test` - Test command

  **Acceptance Criteria**:
  - [ ] Command: `npm run test` → Exit code 0
  - [ ] All test files: PASS (0 failures)
  - [ ] Coverage report shows: Overall ≥80%
  - [ ] Console output: No warnings or errors

  **Manual Execution Verification**:
  - [ ] Command: `npm run test 2>&1` → See "PASS" for all files
  - [ ] Command: `npm run test -- --coverage 2>&1` → See coverage table

  **Commit**: YES (if any fixes needed)
  - Message: `test: fix and verify all tests pass`

---

## Commit Strategy

| After Task | Message                                               | Files                              | Verification                                       |
| ---------- | ----------------------------------------------------- | ---------------------------------- | -------------------------------------------------- |
| 1          | `test(hooks): add browser globals mock setup`         | `src/hooks/__mocks__/browser.ts`   | `ls` check                                         |
| 2          | `test(utils): add metadata utility tests`             | `src/utils/metadata.test.ts`       | `npm run test -- src/utils/metadata.test.ts`       |
| 3          | `test(hooks): add useLogRecorder comprehensive tests` | `src/hooks/useLogRecorder.test.ts` | `npm run test -- src/hooks/useLogRecorder.test.ts` |
| 4          | `test: verify all tests pass`                         | Any fixes needed                   | `npm run test`                                     |

---

## Success Criteria

### Verification Commands

```bash
# Run specific test file
npm run test -- src/utils/metadata.test.ts

# Run hook tests
npm run test -- src/hooks/useLogRecorder.test.ts

# Run all tests
npm run test

# Generate coverage report
npm run test -- --coverage
```

### Final Checklist

- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] `npm run test` passes with 0 failures
- [ ] Coverage ≥80%
- [ ] No DebugPanel/DebugPanelMinimal tests
- [ ] All error handling scenarios tested
- [ ] Cleanup restoration verified
