# Custom Download Directory Feature Implementation

## Context

### Original Request

Add ability for users to select a target directory when downloading log files, instead of using the browser's default Downloads folder.

### Interview Summary

**User Requirements (Confirmed)**:

1. **Use case**: Auto-save to project folder
2. **Environment**: Browser-only web app (no Electron)
3. **User experience**: Directory Picker with config + per-download option
4. **Browser support**: All modern browsers with fallback (Chrome + Firefox critical)
5. **Priority**: Critical

**Answers to Critical Questions (Confirmed)**:

| #   | Question                     | Answer                                     | Rationale                          |
| --- | ---------------------------- | ------------------------------------------ | ---------------------------------- |
| Q1  | Permission persistence       | **A** - Per-session only                   | Simpler, more secure, no IndexedDB |
| Q2  | Override behavior            | **B** - Yes, per-download overrides config | Maximum flexibility                |
| Q3  | Filename in directory        | **C** - Both (template + picked directory) | Consistent with existing behavior  |
| Q4  | Fallback UX (Firefox/Safari) | **C** - Disable button completely          | Clear UX, no confusion             |
| Q5  | Permission denied            | **B** - Show error, allow retry            | User-friendly, actionable          |
| Q6  | User cancellation            | **A** - Silent cancel                      | Expected behavior, non-intrusive   |

**Research Findings**:

- File System Access API (`showDirectoryPicker()`) supported in Chrome 86+, Edge 86+
- Firefox and Safari do NOT support this API
- Standard `<a download>` works everywhere but cannot control directory
- Progressive enhancement pattern: feature detect → use API → fallback to standard

### Metis Review

**Identified Gaps (Addressed)**:

- Permission lifecycle clarified (per-session only, no IndexedDB)
- Error handling patterns defined (AbortError = silent cancel, NotAllowedError = show error)
- Scope exclusions confirmed (no history, no batch, no cleanup, no upload)

**Guardrails Applied**:

- MUST: Feature detect before use, handle AbortError as non-error, preserve existing API
- MUST NOT: Store handles in localStorage, modify existing download logic, break UI
- Scope exclusions set (no IndexedDB, no file versioning, no batch exports)

---

## Work Objectives

### Core Objective

Implement File System Access API integration allowing users to select target directory for downloads, with graceful fallback for unsupported browsers.

### Concrete Deliverables

1. `src/types/index.ts` - Updated `LogRecorderConfig` and new `DownloadOptions` interface
2. `src/hooks/useLogRecorder.ts` - Updated `downloadLogs` with directory picker support
3. `src/hooks/__mocks__/browser.ts` - Updated browser mocks for testing
4. `src/components/DebugPanel.tsx` - New "Save to Directory" button
5. `src/hooks/useLogRecorder.test.ts` - New tests for directory picker
6. `src/components/DebugPanel.test.tsx` - New tests for UI button (if test file exists)

### Definition of Done

- [ ] `npm run test` passes with 0 failures
- [ ] New tests added for directory picker functionality
- [ ] Directory button shows on supported browsers only
- [ ] Permission denied shows error with retry option
- [ ] User cancellation is silent (no error)
- [ ] Bundle size increase < 3KB
- [ ] Backward compatibility: existing `downloadLogs('json')` calls work unchanged

### Must Have

- `enableDirectoryPicker` config option (default: `false`)
- `showPicker` per-download option
- File System Access API implementation with try/catch
- Feature detection utility (`supportsFileSystemAccess()`)
- Graceful fallback to standard download
- Error handling for AbortError (silent), NotAllowedError (show error)
- Disabled button on Firefox/Safari with tooltip explaining limitation
- Tests for all code paths

### Must NOT Have (Guardrails)

- IndexedDB persistence for directory handles
- File history or versioning
- Batch exports or progress tracking
- Directory auto-cleanup
- Upload functionality (download-only feature)
- Breaking changes to existing `downloadLogs` API
- Modification of existing download logic for fallback path
- Storing FileSystemDirectoryHandle in localStorage

---

## Verification Strategy

### Test Decision

- **Infrastructure exists**: YES (vitest configured)
- **User wants tests**: YES - detailed error cases required
- **Framework**: vitest (already configured)
- **Coverage target**: Maintain 80%+ overall

### Test Setup

**Browser Mock Updates** (`src/hooks/__mocks__/browser.ts`):

- Add `showDirectoryPicker` mock function
- Add mock for `FileSystemDirectoryHandle`
- Add mock for `getFileHandle` and `createWritable`
- Mock permission states: 'granted', 'prompt', 'denied'

**Test Categories**:

1. Feature detection tests
2. Directory picker success path
3. Permission denied error path
4. User cancellation (AbortError) path
5. Unsupported browser fallback path
6. Config override behavior tests

---

## Task Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        PHASE 1: TYPES & CONFIG                  │
│  1. Update LogRecorderConfig type                               │
│  2. Add DownloadOptions interface                               │
│  3. Update DEFAULT_CONFIG                                       │
│                                                                 │
│  ↓ Parallel (independent)                                       │
│                                                                 │
│  ┌────────────────────┐    ┌────────────────────┐              │
│  │  PHASE 2: CORE     │    │  PHASE 3: UI       │              │
│  │  downloadLogs      │    │  DebugPanel        │              │
│  │  Implementation    │    │  Button            │              │
│  └────────────────────┘    └────────────────────┘              │
│           ↓                        ↓                            │
│           └────────────┬─────────────────┘                      │
│                        ↓                                        │
│                 ┌────────────────────┐                         │
│                 │  PHASE 4: TESTS    │                         │
│                 │  Coverage          │                         │
│                 └────────────────────┘                         │
│                        ↓                                        │
│                 ┌────────────────────┐                         │
│                 │  PHASE 5: VERIFY   │                         │
│                 │  Bundle Size       │                         │
│                 └────────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

## Parallelization

| Group | Tasks | Reason                                    |
| ----- | ----- | ----------------------------------------- |
| A     | 2, 3  | Type definitions independent              |
| B     | 4, 6  | Core hook and mock updates                |
| C     | 5, 7  | UI and tests can be developed in parallel |

| Task | Depends On | Reason                               |
| ---- | ---------- | ------------------------------------ |
| 4    | 1, 2       | Uses new types and interfaces        |
| 5    | 1, 2       | Uses new types                       |
| 6    | 4          | Requires updated hook implementation |
| 7    | 4, 5       | Requires implementation to test      |
| 8    | 5, 7       | Requires tests to verify             |

---

## TODOs

- [ ] 1. Update LogRecorderConfig type with enableDirectoryPicker

  **What to do**:
  - Add `enableDirectoryPicker?: boolean` to `LogRecorderConfig` interface
  - Add comment: "Enable directory picker for downloads (Chrome 86+, Edge 86+ only)"
  - Place alphabetically with other boolean options

  **Must NOT do**:
  - Change existing options or their types
  - Set default value in type (default in DEFAULT_CONFIG only)

  **Parallelizable**: YES (standalone type change)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/types/index.ts:122-138` - LogRecorderConfig interface structure
  - `src/types/index.ts:129` - sanitizeKeys boolean array pattern
  - `src/types/index.ts:130` - excludeUrls string array pattern

  **Type References** (interfaces to extend):
  - `src/types/index.ts:122-138` - LogRecorderConfig interface

  **WHY Each Reference Matters**:
  - LogRecorderConfig shows exact structure for new option
  - Arrays show how to document options with comments
  - TypeScript strict mode requires proper typing

  **Acceptance Criteria**:
  - [ ] File modified: `src/types/index.ts`
  - [ ] New property added: `enableDirectoryPicker?: boolean`
  - [ ] JSDoc comment added for the new property
  - [ ] TypeScript compilation: `npm run typecheck` passes

  **Manual Execution Verification**:
  - [ ] Command: `npm run typecheck` → No errors

  **Commit**: YES
  - Message: `feat(types): add enableDirectoryPicker config option`
  - Files: `src/types/index.ts`

---

- [ ] 2. Add DownloadOptions interface

  **What to do**:
  - Create new interface `DownloadOptions`
  - Add `showPicker?: boolean` property
  - Add JSDoc comment explaining the option
  - Export interface from types/index.ts

  **Must NOT do**:
  - Add any other options to this interface
  - Change existing downloadLogs signature structure

  **Parallelizable**: YES (standalone type)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/types/index.ts:140-149` - UseLogRecorderReturn interface structure
  - `src/types/index.ts:151-163` - FilenamePlaceholder type documentation style

  **Implementation References** (function signature):
  - `src/hooks/useLogRecorder.ts:370` - downloadLogs function signature

  **WHY Each Reference Matters**:
  - UseLogRecorderReturn shows how to document interface options
  - FilenamePlaceholder shows JSDoc style for exports
  - downloadLogs signature shows how options will be used

  **Acceptance Criteria**:
  - [ ] File modified: `src/types/index.ts`
  - [ ] New interface created: `DownloadOptions`
  - [ ] New property: `showPicker?: boolean`
  - [ ] JSDoc comment: "Options for downloadLogs function"
  - [ ] TypeScript compilation passes

  **Manual Execution Verification**:
  - [ ] Command: `npm run typecheck` → No errors

  **Commit**: YES
  - Message: `feat(types): add DownloadOptions interface`
  - Files: `src/types/index.ts`

---

- [ ] 3. Update DEFAULT_CONFIG with enableDirectoryPicker

  **What to do**:
  - Add `enableDirectoryPicker: false` to DEFAULT_CONFIG object
  - Place logically with other boolean options (after captureXHR)
  - Add comment referencing the type documentation

  **Must NOT do**:
  - Change any existing default values
  - Remove or reorder existing options

  **Parallelizable**: YES (standalone config change)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/hooks/useLogRecorder.ts:75-95` - DEFAULT_CONFIG structure
  - `src/hooks/useLogRecorder.ts:90` - captureXHR: true (boolean option pattern)

  **Type References** (interface being extended):
  - `src/types/index.ts:122-138` - LogRecorderConfig interface

  **WHY Each Reference Matters**:
  - DEFAULT_CONFIG shows exact placement and comment style
  - captureXHR shows how boolean options are structured
  - Type interface shows the property name to use

  **Acceptance Criteria**:
  - [ ] File modified: `src/hooks/useLogRecorder.ts`
  - [ ] New config: `enableDirectoryPicker: false`
  - [ ] TypeScript compilation passes

  **Manual Execution Verification**:
  - [ ] Command: `npm run typecheck` → No errors

  **Commit**: YES
  - Message: `feat(hooks): add enableDirectoryPicker to DEFAULT_CONFIG`
  - Files: `src/hooks/useLogRecorder.ts`

---

- [ ] 4. Implement directory picker in downloadLogs

  **What to do**:
  - Create `supportsFileSystemAccess()` utility function
  - Create `saveToDirectory()` helper function
  - Update `downloadLogs` callback signature and implementation
  - Add try/catch for File System Access API errors
  - Handle AbortError (silent cancel), NotAllowedError (show error), SecurityError (fallback)

  **New Function - supportsFileSystemAccess()**:

  ```typescript
  function supportsFileSystemAccess(): boolean {
    return 'showDirectoryPicker' in window;
  }
  ```

  **New Function - saveToDirectory()**:

  ```typescript
  async function saveToDirectory(content: string, filename: string): Promise<void> {
    const dirHandle = await window.showDirectoryPicker();
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }
  ```

  **Updated downloadLogs signature**:

  ```typescript
  downloadLogs: (
    format?: 'json' | 'txt',
    customFilename?: string | null,
    options?: DownloadOptions
  ) => string | null;
  ```

  **Updated implementation logic**:

  ```typescript
  const downloadLogs = useCallback((
    format?: 'json' | 'txt',
    customFilename?: string | null,
    options?: DownloadOptions
  ) => {
    // Generate filename from template or custom
    const filename = customFilename || generateFilename({ /* ... */ });

    // Prepare content
    const content = format === 'json'
      ? JSON.stringify({ metadata, logs }, null, 2)
      : logs.map(l => /* format */).join('\n');

    // Check if should show picker
    const showPicker = options?.showPicker || config.enableDirectoryPicker;

    if (showPicker && supportsFileSystemAccess()) {
      try {
        await saveToDirectory(content, filename);
        return filename;
      } catch (err) {
        if (err instanceof DOMException) {
          if (err.name === 'AbortError') {
            // User cancelled - silent return
            return null;
          }
          if (err.name === 'NotAllowedError') {
            // Permission denied - log error for UI to handle
            console.error('[useLogRecorder] Directory permission denied');
            // Fall through to standard download
          }
        }
        // Other errors - fall through to standard download
      }
    }

    // Fallback: standard download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return filename;
  }, [/* dependencies */]);
  ```

  **Must NOT do**:
  - Store directory handle in state or ref
  - Add IndexedDB persistence
  - Modify existing download logic for fallback path
  - Remove URL.revokeObjectURL cleanup

  **Parallelizable**: NO (depends on types from tasks 1-3)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/hooks/useLogRecorder.ts:370-416` - Current downloadLogs implementation
  - `src/hooks/useLogRecorder.ts:80-90` - DEFAULT_CONFIG usage pattern
  - `src/hooks/useLogRecorder.ts:370` - useCallback with config dependency

  **API References** (File System Access API):
  - MDN: window.showDirectoryPicker()
  - FileSystemFileHandle.createWritable()
  - Error handling: DOMException.name checks

  **Implementation References** (current patterns):
  - `src/hooks/useLogRecorder.ts:380-400` - Blob creation and download pattern
  - `src/hooks/useLogRecorder.ts:410` - URL.revokeObjectURL cleanup

  **WHY Each Reference Matters**:
  - Current downloadLogs shows exact structure to extend
  - Blob pattern must be preserved for fallback
  - Cleanup (revokeObjectURL) must be maintained
  - useCallback dependencies must include new config option

  **Acceptance Criteria**:
  - [ ] File modified: `src/hooks/useLogRecorder.ts`
  - [ ] New function: `supportsFileSystemAccess()` added
  - [ ] New function: `saveToDirectory()` added
  - [ ] Updated: `downloadLogs` signature with third parameter
  - [ ] Implemented: File System Access API call
  - [ ] Implemented: Error handling for AbortError (silent)
  - [ ] Implemented: Error handling for NotAllowedError (log error)
  - [ ] Implemented: Fallback to standard download
  - [ ] Preserved: URL.revokeObjectURL cleanup
  - [ ] TypeScript compilation passes

  **Error Cases to Handle**:
  - AbortError: User cancelled picker → return null, no error logged
  - NotAllowedError: Permission denied → log error, fallback to standard download
  - SecurityError: Not in secure context → fallback to standard download
  - NotFoundError: Directory no longer exists → fallback to standard download
  - Other errors: Log error, fallback to standard download

  **Manual Execution Verification**:
  - [ ] Command: `npm run typecheck` → No errors
  - [ ] Manual: Create test component, verify directory picker opens in Chrome
  - [ ] Manual: Verify fallback to standard download in Firefox

  **Commit**: YES
  - Message: `feat(hooks): add directory picker support to downloadLogs`
  - Files: `src/hooks/useLogRecorder.ts`

---

- [ ] 5. Update browser mocks for testing

  **What to do**:
  - Add `showDirectoryPicker` mock to browser.ts
  - Add mock for `FileSystemDirectoryHandle`
  - Add mock for `getFileHandle` and `createWritable`
  - Add mock for `FileSystemFileHandle`
  - Add helper to set mock permission state

  **New Mocks**:

  ```typescript
  // Directory picker mock
  function createMockDirectoryPicker() {
    return vi.fn(async () => {
      const mockDirHandle = createMockDirectoryHandle();
      return mockDirHandle;
    });
  }

  function createMockDirectoryHandle() {
    const fileHandles = new Map<string, unknown>();
    return {
      kind: 'directory' as const,
      name: '',
      getFileHandle: vi.fn((name: string, _opts?: { create: boolean }) => {
        if (!fileHandles.has(name)) {
          fileHandles.set(name, createMockFileHandle(name));
        }
        return fileHandles.get(name);
      }),
      getDirectoryHandle: vi.fn(),
      removeEntry: vi.fn(),
      resolve: vi.fn(),
      queryPermission: vi.fn(),
      requestPermission: vi.fn(),
    };
  }

  function createMockFileHandle(name: string) {
    let content = '';
    return {
      kind: 'file' as const,
      name,
      createWritable: vi.fn(async () => {
        let closed = false;
        return {
          write: vi.fn((data: string) => {
            content = data;
          }),
          close: vi.fn(() => {
            closed = true;
          }),
          get closed() {
            return closed;
          },
        };
      }),
      getFile: vi.fn(),
    };
  }

  // Add to setupBrowserMocks
  vi.stubGlobal('showDirectoryPicker', createMockDirectoryPicker());
  ```

  **Must NOT do**:
  - Modify existing mock functions
  - Change localStorage or fetch mock behavior

  **Parallelizable**: YES (standalone mock file)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/hooks/__mocks__/browser.ts:1-50` - Current mock setup structure
  - `src/hooks/__mocks__/browser.ts:30-60` - Mock function patterns
  - `src/hooks/__mocks__/browser.ts:145-180` - Export patterns

  **Implementation References** (existing mocks):
  - `src/hooks/__mocks__/browser.ts:56` - XMLHttpRequest mock pattern
  - `src/hooks/__mocks__/browser.ts:63` - Mock element pattern

  **WHY Each Reference Matters**:
  - Current mock setup shows function structure
  - XMLHttpRequest mock shows how to create class-like mocks
  - Mock element shows spyOn pattern usage
  - Exports show how to expose helper functions

  **Acceptance Criteria**:
  - [ ] File modified: `src/hooks/__mocks__/browser.ts`
  - [ ] New mock: `showDirectoryPicker` function
  - [ ] New mock: `FileSystemDirectoryHandle` object
  - [ ] New mock: `FileSystemFileHandle` with createWritable
  - [ ] New helper: `setMockDirectoryPermission(state)` (optional)
  - [ ] Tests can use these mocks

  **Manual Execution Verification**:
  - [ ] Command: `npm run test -- src/hooks/useLogRecorder.test.ts` → Tests use mocks

  **Commit**: YES
  - Message: `test(mocks): add directory picker mocks for testing`
  - Files: `src/hooks/__mocks__/browser.ts`

---

- [ ] 6. Add "Save to Directory" button in DebugPanel

  **What to do**:
  - Add "Save to Directory" button next to existing download buttons
  - Disable button if `!supportsFileSystemAccess()`
  - Add tooltip explaining limitation on unsupported browsers
  - Add error state display for permission denied

  **UI Pattern to Follow**:

  ```typescript
  // Add to handleDownload function or create new handleSaveToDirectory
  const handleSaveToDirectory = async () => {
    try {
      const result = await downloadLogs('json', undefined, { showPicker: true });
      if (result) {
        setStatus({ type: 'success', message: 'Đã lưu vào thư mục' });
      } else {
        // User cancelled
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Không thể lưu. Vui lòng thử lại hoặc chọn vị trí khác.'
      });
    }
  };

  // Button JSX
  <button
    type="button"
    onClick={handleSaveToDirectory}
    disabled={!supportsFileSystemAccess()}
    title={
      supportsFileSystemAccess()
        ? 'Chọn thư mục để lưu file'
        : 'Tính năng chỉ hỗ trợ Chrome/Edge'
    }
  >
    📁 Lưu vào thư mục...
  </button>
  ```

  **Component State**:
  - Add `directoryStatus` state similar to `uploadStatus`
  - Auto-clear after 3 seconds (match uploadStatus pattern)

  **Must NOT do**:
  - Remove or modify existing download buttons
  - Change existing upload functionality
  - Add new dependencies

  **Parallelizable**: NO (depends on updated hook from task 4)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/components/DebugPanel.tsx:355-402` - Download button section
  - `src/components/DebugPanel.tsx:134-145` - handleDownload callback pattern
  - `src/components/DebugPanel.tsx:139-145` - uploadStatus state pattern
  - `src/components/DebugPanel.tsx:29-32` - Status state type definition

  **Component References** (UI structure):
  - `src/components/DebugPanel.tsx:155-180` - Download buttons layout
  - `src/components/DebugPanel.tsx:185-200` - Status message display

  **Implementation References** (status handling):
  - `src/components/DebugPanel.tsx:230-260` - Upload status auto-clear pattern

  **WHY Each Reference Matters**:
  - Download buttons show where to add new button
  - handleDownload shows callback pattern
  - uploadStatus shows state structure and type
  - Status auto-clear shows timer pattern

  **Acceptance Criteria**:
  - [ ] File modified: `src/components/DebugPanel.tsx`
  - [ ] New button: "Lưu vào thư mục..." added
  - [ ] Button disabled: On Firefox/Safari (`!supportsFileSystemAccess()`)
  - [ ] Tooltip: Explains limitation on unsupported browsers
  - [ ] New state: `directoryStatus` added (similar to `uploadStatus`)
  - [ ] Error handling: Shows error message on permission denied
  - [ ] Auto-clear: Status clears after 3 seconds
  - [ ] Accessibility: Proper button type, aria-label
  - [ ] TypeScript compilation passes

  **Error Display Pattern**:
  - Success: "Đã lưu vào thư mục" (Green)
  - Error: "Cần quyền truy cập thư mục. Vui lòng thử lại." (Red)
  - Use same styling as uploadStatus

  **Manual Execution Verification**:
  - [ ] Manual: Button visible in DebugPanel
  - [ ] Manual: Button disabled in Firefox, enabled in Chrome
  - [ ] Manual: Clicking opens directory picker in Chrome
  - [ ] Manual: Permission denied shows error message

  **Commit**: YES
  - Message: `feat(ui): add Save to Directory button in DebugPanel`
  - Files: `src/components/DebugPanel.tsx`

---

- [ ] 7. Add tests for directory picker functionality

  **What to do**:
  - Add tests for `supportsFileSystemAccess()` utility
  - Add tests for `saveToDirectory()` function
  - Add tests for downloadLogs with directory picker option
  - Add tests for error handling (AbortError, NotAllowedError)
  - Add tests for fallback to standard download
  - Add tests for config override behavior

  **Test Cases**:

  **Feature Detection Tests**:

  ```typescript
  describe('supportsFileSystemAccess', () => {
    it('returns true when showDirectoryPicker exists', () => {
      vi.stubGlobal('showDirectoryPicker', vi.fn());
      expect(supportsFileSystemAccess()).toBe(true);
    });
    it('returns false when showDirectoryPicker does not exist', () => {
      vi.stubGlobal('showDirectoryPicker', undefined);
      expect(supportsFileSystemAccess()).toBe(false);
    });
  });
  ```

  **Directory Picker Success Tests**:

  ```typescript
  describe('downloadLogs with directory picker', () => {
    it('saves to directory when showPicker is true', async () => {
      const mockDirHandle = createMockDirectoryHandle();
      vi.stubGlobal('showDirectoryPicker', vi.fn().mockResolvedValue(mockDirHandle));

      const { result } = renderHook(() => useLogRecorder());
      const filename = await result.current.downloadLogs('json', 'test.json', { showPicker: true });

      expect(filename).toBe('test.json');
      expect(mockDirHandle.getFileHandle).toHaveBeenCalledWith('test.json', { create: true });
    });
  });
  ```

  **Error Handling Tests**:

  ```typescript
  describe('downloadLogs error handling', () => {
    it('returns null when user aborts picker', async () => {
      vi.stubGlobal(
        'showDirectoryPicker',
        vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError'))
      );

      const { result } = renderHook(() => useLogRecorder());
      const filename = await result.current.downloadLogs('json', 'test.json', { showPicker: true });

      expect(filename).toBeNull();
    });

    it('falls back to standard download on permission denied', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.stubGlobal(
        'showDirectoryPicker',
        vi.fn().mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'))
      );

      const { result } = renderHook(() => useLogRecorder());
      const filename = await result.current.downloadLogs('json', 'test.json', { showPicker: true });

      expect(consoleErrorSpy).toHaveBeenCalledWith('[useLogRecorder] Directory permission denied');
      expect(filename).toBe('test.json'); // From fallback
      consoleErrorSpy.mockRestore();
    });
  });
  ```

  **Config Override Tests**:

  ```typescript
  describe('config override behavior', () => {
    it('shows picker when config disabled but showPicker: true', async () => {
      const mockDirHandle = createMockDirectoryHandle();
      vi.stubGlobal('showDirectoryPicker', vi.fn().mockResolvedValue(mockDirHandle));

      const { result } = renderHook(() => useLogRecorder({ enableDirectoryPicker: false }));
      const filename = await result.current.downloadLogs('json', 'test.json', { showPicker: true });

      expect(filename).toBe('test.json');
      expect(vi.stubGlobal('showDirectoryPicker')).toHaveBeenCalled();
    });
  });
  ```

  **Must NOT do**:
  - Modify existing test cases
  - Add integration tests requiring full DOM

  **Parallelizable**: NO (depends on implementation from tasks 4-6)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/hooks/useLogRecorder.test.ts` - Current test structure
  - `src/hooks/__mocks__/browser.ts` - Mock functions to use
  - `src/utils.test.ts:1-50` - Test import patterns

  **Test Implementation References**:
  - `src/hooks/useLogRecorder.test.ts:50-80` - Test structure examples
  - `src/utils.test.ts:100-150` - Mock usage examples

  **WHY Each Reference Matters**:
  - Current tests show describe/it patterns
  - Mock file shows available mock functions
  - Utils tests show how to structure test cases

  **Acceptance Criteria**:
  - [ ] File modified: `src/hooks/useLogRecorder.test.ts`
  - [ ] New test: `supportsFileSystemAccess()` returns correct values
  - [ ] New test: Directory picker saves file successfully
  - [ ] New test: AbortError returns null (silent cancel)
  - [ ] New test: NotAllowedError falls back to standard download
  - [ ] New test: Config override works (showPicker overrides enableDirectoryPicker)
  - [ ] New test: Unsupported browser uses standard download
  - [ ] All tests pass: `npm run test -- src/hooks/useLogRecorder.test.ts`

  **Manual Execution Verification**:
  - [ ] Command: `npm run test -- src/hooks/useLogRecorder.test.ts` → All tests pass

  **Commit**: YES
  - Message: `test(hooks): add directory picker tests`
  - Files: `src/hooks/useLogRecorder.test.ts`

---

- [ ] 8. Verify bundle size impact

  **What to do**:
  - Run build to check bundle size
  - Compare before/after size
  - Ensure increase < 3KB

  **Acceptance Criteria**:
  - [ ] Command: `npm run build` completes successfully
  - [ ] Command: `npm run size` or check dist/ size
  - [ ] Bundle size increase < 3KB from original (~20KB)
  - [ ] If > 3KB increase, optimize or reconsider

  **Manual Execution Verification**:
  - [ ] Command: `npm run build` → Build successful
  - [ ] Check: dist/glean-debug-logger.{cjs,esm}.js sizes

  **Commit**: NO (build verification only)

---

## Commit Strategy

| After Task | Message                                                     | Files                              | Verification        |
| ---------- | ----------------------------------------------------------- | ---------------------------------- | ------------------- |
| 1          | `feat(types): add enableDirectoryPicker config option`      | `src/types/index.ts`               | `npm run typecheck` |
| 2          | `feat(types): add DownloadOptions interface`                | `src/types/index.ts`               | `npm run typecheck` |
| 3          | `feat(hooks): add enableDirectoryPicker to DEFAULT_CONFIG`  | `src/hooks/useLogRecorder.ts`      | `npm run typecheck` |
| 4          | `feat(hooks): add directory picker support to downloadLogs` | `src/hooks/useLogRecorder.ts`      | `npm run typecheck` |
| 5          | `test(mocks): add directory picker mocks for testing`       | `src/hooks/__mocks__/browser.ts`   | `npm run test`      |
| 6          | `feat(ui): add Save to Directory button in DebugPanel`      | `src/components/DebugPanel.tsx`    | `npm run typecheck` |
| 7          | `test(hooks): add directory picker tests`                   | `src/hooks/useLogRecorder.test.ts` | `npm run test`      |
| 8          | (Verification only)                                         | -                                  | `npm run build`     |

---

## Success Criteria

### Verification Commands

```bash
# Type checking
npm run typecheck

# Run all tests
npm run test

# Run specific test file
npm run test -- src/hooks/useLogRecorder.test.ts

# Build and check size
npm run build
```

### Final Checklist

- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] `npm run test` passes with 0 failures
- [ ] `npm run typecheck` passes
- [ ] Bundle size increase < 3KB
- [ ] Directory button shows on Chrome/Edge, disabled on Firefox/Safari
- [ ] Error handling works for all error types
- [ ] Backward compatibility maintained
- [ ] No IndexedDB persistence added
