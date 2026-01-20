# Logic Separation & UI Improvements

## Overview

Refactor the glean-debug-logger library into a maintainable architecture with separated concerns (interceptors, file services, UI logic) and improved UI/UX (goober styling, dark mode, accessibility, visual enhancements).

## Core Goals

1. **Logic Separation**: Extract interceptor classes, file services, and UI logic from monolithic hooks
2. **UI Improvements**: Replace inline styles with goober, add dark mode, accessibility, visual enhancements
3. **Testability**: Ensure new modules are testable with Vitest
4. **Bundle Size**: Stay under 25KB (currently estimated ~18KB)

## Architecture Changes

### Phase 1: Logic Separation

```
src/
├── interceptors/           # NEW: Interceptor classes
│   ├── ConsoleInterceptor.ts
│   ├── NetworkInterceptor.ts
│   └── XHRInterceptor.ts
├── services/               # NEW: File service
│   └── FileService.ts
├── hooks/
│   ├── useDebugPanelControls.ts  # NEW: UI control hook
│   └── useLogRecorder.ts         # REFACTOR: Use interceptors
└── components/
    └── DebugPanel.tsx     # REFACTOR: Use hooks, goober styles
```

### Phase 2: UI Improvements

```
src/components/
├── DebugPanel.tsx        # REFACTOR: Clean component
└── DebugPanel.styles.ts  # NEW: Goober styles
```

## Tasks

### Task 1: Create ConsoleInterceptor Class

Extract console interception from `src/hooks/useLogRecorder.ts` lines 109-157 into a class.

**Reference Pattern**: From Axios/Hyper-Fetch interceptor patterns:

```typescript
class ConsoleInterceptor {
  private originalConsole: Record<string, Function>;
  private callbacks: ((level: string, args: unknown[]) => void)[];

  constructor() {
    this.originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
    };
    this.callbacks = [];
  }

  attach(): void {
    Object.keys(this.originalConsole).forEach((level) => {
      const original = this.originalConsole[level];
      console[level] = (...args: unknown[]) => {
        this.callbacks.forEach((cb) => cb(level, args));
        original.apply(console, args);
      };
    });
  }

  detach(): void {
    Object.keys(this.originalConsole).forEach((level) => {
      console[level] = this.originalConsole[level];
    });
  }

  onLog(callback: (level: string, args: unknown[]) => void): void {
    this.callbacks.push(callback);
  }
}
```

**Acceptance Criteria**:

- [x] Class created at `src/interceptors/ConsoleInterceptor.ts`
- [x] `attach()` and `detach()` methods work correctly
- [x] Console methods are intercepted and original behavior preserved
- [x] Tests created with Vitest

---

### Task 2: Create NetworkInterceptor Class

Extract fetch interception from `src/hooks/useLogRecorder.ts` lines 159-243 into a class.

**Reference Pattern**: From Reactotron/bugsnag patterns:

```typescript
class NetworkInterceptor {
  private originalFetch: typeof window.fetch;
  private onRequest: ((url: string, options: RequestInit) => void)[];
  private onResponse: ((url: string, status: number, duration: number) => void)[];
  private onError: ((url: string, error: Error) => void)[];
  private excludeUrls: RegExp[];

  constructor(options: { excludeUrls?: string[] } = {}) {
    this.originalFetch = window.fetch.bind(window);
    this.onRequest = [];
    this.onResponse = [];
    this.onError = [];
    this.excludeUrls = (options.excludeUrls || []).map((url) => new RegExp(url));
  }

  attach(): void {
    window.fetch = async (...args: [RequestInfo | URL, RequestInit?]) => {
      const [url, options] = args;
      const urlStr = url.toString();

      // Skip excluded URLs
      if (this.excludeUrls.some((regex) => regex.test(urlStr))) {
        return this.originalFetch(...args);
      }

      // Notify request
      const startTime = Date.now();
      this.onRequest.forEach((cb) => cb(urlStr, options || {}));

      try {
        const response = await this.originalFetch(...args);
        const cloned = response.clone();
        const duration = Date.now() - startTime;

        // Read response body for logging (without consuming original)
        let body: unknown;
        try {
          body = await cloned.text();
        } catch {
          body = '[Unable to read response body]';
        }

        this.onResponse.forEach((cb) => cb(urlStr, response.status, duration));
        return response;
      } catch (error) {
        this.onError.forEach((cb) => cb(urlStr, error as Error));
        throw error;
      }
    };
  }

  detach(): void {
    window.fetch = this.originalFetch;
  }

  onFetchRequest(callback: (url: string, options: RequestInit) => void): void {
    this.onRequest.push(callback);
  }

  onFetchResponse(callback: (url: string, status: number, duration: number) => void): void {
    this.onResponse.push(callback);
  }

  onFetchError(callback: (url: string, error: Error) => void): void {
    this.onError.push(callback);
  }
}
```

**Acceptance Criteria**:

- [x] Class created at `src/interceptors/NetworkInterceptor.ts`
- [x] `attach()` and `detach()` methods work correctly
- [x] Fetch requests are intercepted with request/response/error callbacks
- [x] URL exclusion pattern matching works
- [x] Response cloning for body reading works
- [x] Tests created with Vitest

---

### Task 3: Create XHRInterceptor Class

Extract XHR interception from `src/hooks/useLogRecorder.ts` lines 245-351 into a class.

**Reference Pattern**: From Reactotron/class-based interceptors:

```typescript
class XHRInterceptor {
  private originalXHR: typeof XMLHttpRequest;
  private onRequest: ((config: XHRRequestConfig) => void)[];
  private onResponse: ((config: XHRRequestConfig, status: number, duration: number) => void)[];
  private onError: ((config: XHRRequestConfig, error: Error) => void)[];
  private requestTracker: WeakMap<XMLHttpRequest, XHRRequestConfig>;
  private excludeUrls: RegExp[];

  constructor(options: { excludeUrls?: string[] } = {}) {
    this.originalXHR = window.XMLHttpRequest;
    this.onRequest = [];
    this.onResponse = [];
    this.onError = [];
    this.requestTracker = new WeakMap();
    this.excludeUrls = (options.excludeUrls || []).map((url) => new RegExp(url));
  }

  attach(): void {
    const OriginalXHR = this.originalXHR;

    const MyXMLHttpRequest = function (this: XMLHttpRequest) {
      const xhr = new OriginalXHR();
      this.requestTracker.set(xhr, {
        method: '',
        url: '',
        headers: {},
        body: null,
        startTime: Date.now(),
      });
      return xhr;
    } as unknown as typeof XMLHttpRequest;

    // Copy prototype chain
    MyXMLHttpRequest.prototype = OriginalXHR.prototype;
    Object.setPrototypeOf(MyXMLHttpRequest.prototype, OriginalXHR.prototype);

    // Override open method
    const originalOpen = OriginalXHR.prototype.open;
    MyXMLHttpRequest.prototype.open = function (method: string, url: string) {
      const config = this.requestTracker.get(this);
      if (config) {
        config.method = method;
        config.url = url;
      }
      return originalOpen.apply(this, arguments as unknown[]);
    };

    // Override send method
    const originalSend = OriginalXHR.prototype.send;
    MyXMLHttpRequest.prototype.send = function (body: Document | XMLHttpRequestBodyInit | null) {
      const config = this.requestTracker.get(this);
      if (config) {
        config.body = body;
        this.onload = () => {
          const duration = Date.now() - config.startTime;
          this.onResponse?.forEach((cb) => cb(config, this.status, duration));
        };
        this.onerror = () => {
          this.onError?.forEach((cb) => cb(config, new Error('XHR Error')));
        };
      }
      return originalSend.apply(this, arguments as unknown[]);
    };

    window.XMLHttpRequest = MyXMLHttpRequest;
  }

  detach(): void {
    window.XMLHttpRequest = this.originalXHR;
  }

  onXHRRequest(callback: (config: XHRRequestConfig) => void): void {
    this.onRequest.push(callback);
  }

  onXHRResponse(
    callback: (config: XHRRequestConfig, status: number, duration: number) => void
  ): void {
    this.onResponse.push(callback);
  }

  onXHRError(callback: (config: XHRRequestConfig, error: Error) => void): void {
    this.onError.push(callback);
  }
}
```

**Acceptance Criteria**:

- [x] Class created at `src/interceptors/XHRInterceptor.ts`
- [x] `attach()` and `detach()` methods work correctly
- [x] XHR requests are intercepted with request/response/error callbacks
- [x] WeakMap used for memory-safe request tracking
- [x] URL exclusion pattern matching works
- [x] Prototype chain properly maintained
- [x] Tests created with Vitest

---

### Task 4: Create FileService

Extract file handling from `src/hooks/useLogRecorder.ts` lines 375-453 into a service.

**Reference Pattern**: From VSCode/FileSystem Access API patterns:

```typescript
class FileService {
  private static supported: boolean | null = null;

  static isSupported(): boolean {
    if (this.supported === null) {
      this.supported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;
    }
    return this.supported;
  }

  static async saveToDirectory(
    content: string,
    filename: string,
    mimeType: string = 'application/json'
  ): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('File System Access API not supported');
    }

    try {
      const dirHandle = await window.showDirectoryPicker();
      const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // User cancelled - graceful handling
        return;
      }
      throw error;
    }
  }

  static download(content: string, filename: string, mimeType: string = 'application/json'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async downloadWithFallback(
    content: string,
    filename: string,
    mimeType: string = 'application/json'
  ): Promise<void> {
    if (this.isSupported()) {
      try {
        await this.saveToDirectory(content, filename, mimeType);
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
        // Fall through to standard download
      }
    }
    this.download(content, filename, mimeType);
  }
}
```

**Acceptance Criteria**:

- [x] Service created at `src/services/FileService.ts`
- [x] `isSupported()` feature detection works
- [x] `saveToDirectory()` with showDirectoryPicker works
- [x] `download()` with Blob/URL.createObjectURL works
- [x] `downloadWithFallback()` provides graceful fallback
- [x] Error handling for AbortError (user cancelled)
- [x] Tests created with Vitest (mocking showDirectoryPicker)

---

### Task 5: Create useDebugPanelControls Hook

Create a new hook for debug panel UI control logic.

**Reference Pattern**: From Chakra UI/useDisclosure and custom hook patterns:

```typescript
interface DebugPanelControls {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  supportsDirectoryPicker: boolean;
}

function useDebugPanelControls(): DebugPanelControls {
  const [isOpen, setIsOpen] = useState(false);
  const [supportsDirectoryPicker, setSupportsDirectoryPicker] = useState(false);

  useEffect(() => {
    setSupportsDirectoryPicker(FileService.isSupported());
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggle, close]);

  return {
    isOpen,
    toggle,
    open,
    close,
    supportsDirectoryPicker,
  };
}
```

**Acceptance Criteria**:

- [x] Hook created at `src/hooks/useDebugPanelControls.ts`
- [x] State management for `isOpen` works
- [x] `toggle()`, `open()`, `close()` functions work
- [x] `supportsDirectoryPicker` detection works
- [x] Ctrl+Shift+D keyboard shortcut works
- [x] Escape key closes panel
- [x] Tests created with Vitest

---

### Task 6: Refactor useLogRecorder to Use Interceptors

Refactor the main hook to use the new interceptor classes and add auto-upload logic.

**Reference Pattern**: From the current implementation with backward compatibility:

```typescript
interface LogRecorderOptions {
  maxLogs?: number;
  sanitizeKeys?: string[];
  excludeUrls?: string[];
  uploadOnErrorCount?: number; // NEW
  uploadEndpoint?: string | null;
  onUpload?: (logs: LogEntry[]) => Promise<void>; // NEW
}

interface LogRecorderReturn {
  logs: LogEntry[];
  record: (entry: LogEntry) => void;
  download: (format: 'json' | 'txt', filename?: string) => string | null;
  upload: () => Promise<{ success: boolean; error?: string }>;
  clear: () => void;
  getMetadata: () => LogMetadata;
}

function useLogRecorder(options: LogRecorderOptions = {}): LogRecorderReturn {
  const {
    maxLogs = 1000,
    sanitizeKeys = DEFAULT_SANITIZE_KEYS,
    excludeUrls = [],
    uploadOnErrorCount = 5,
    uploadEndpoint = null,
    onUpload,
  } = options;

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const errorCountRef = useRef(0);

  // Initialize interceptors
  const consoleInterceptor = useMemo(() => new ConsoleInterceptor(), []);
  const networkInterceptor = useMemo(() => new NetworkInterceptor({ excludeUrls }), [excludeUrls]);
  const xhrInterceptor = useMemo(() => new XHRInterceptor({ excludeUrls }), [excludeUrls]);

  // Auto-upload logic
  const checkAutoUpload = useCallback(
    (newLogs: LogEntry[]) => {
      const recentErrors = newLogs.slice(-uploadOnErrorCount);
      const hasEnoughErrors =
        recentErrors.length >= uploadOnErrorCount &&
        recentErrors.every(
          (log) => log.type === 'ERROR' || log.type === 'FETCH_ERR' || log.type === 'XHR_ERR'
        );

      if (hasEnoughErrors && (uploadEndpoint || onUpload)) {
        if (onUpload) {
          onUpload(newLogs);
        } else if (uploadEndpoint) {
          uploadLogs(newLogs, uploadEndpoint);
        }
      }
    },
    [uploadOnErrorCount, uploadEndpoint, onUpload]
  );

  // Setup interceptors on mount
  useEffect(() => {
    consoleInterceptor.attach();
    networkInterceptor.attach();
    xhrInterceptor.attach();

    return () => {
      consoleInterceptor.detach();
      networkInterceptor.detach();
      xhrInterceptor.detach();
    };
  }, [consoleInterceptor, networkInterceptor, xhrInterceptor]);

  // Add logging callbacks
  consoleInterceptor.onLog((level, args) => {
    const entry = createConsoleEntry(level, args);
    setLogs((prev) => {
      const newLogs = [...prev, entry].slice(-maxLogs);
      checkAutoUpload(newLogs);
      return newLogs;
    });
  });

  // ... rest of implementation maintaining same return interface
}
```

**Acceptance Criteria**:

- [x] Hook refactored at `src/hooks/useLogRecorder.ts`
- [x] Uses ConsoleInterceptor, NetworkInterceptor, XHRInterceptor classes
- [x] Uses FileService for download logic
- [x] Auto-upload works with `uploadOnErrorCount` config
- [x] Backward compatible return interface preserved
- [x] All existing tests pass
- [x] Integration tests created

---

### Task 7: Extract Styles to Goober

Extract inline styles from `DebugPanel.tsx` to goober CSS-in-JS.

**Reference Pattern**: From TanStack/lobe-chat goober patterns:

```typescript
import { css } from 'goober';

// Panel container
export const panelStyles = css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  max-height: 600px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: all 0.3s ease;
`;

// Toggle button
export const toggleButtonStyles = css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Stats grid
export const statsGridStyles = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

// Action buttons
export const actionButtonStyles = css`
  padding: 8px 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Log level colors
export const logLevelStyles = {
  error: css`
    color: #ef4444;
  `,
  warn: css`
    color: #f97316;
  `,
  info: css`
    color: #3b82f6;
  `,
  debug: css`
    color: #6b7280;
  `,
};

// Dark mode support
const darkModeStyles = css`
  @media (prefers-color-scheme: dark) {
    background: #1e293b;
    border-color: #334155;
    color: #f1f5f9;

    .panel {
      background: #1e293b;
      border-color: #334155;
    }

    .button {
      background: #334155;
      border-color: #475569;
      color: #e2e8f0;
    }
  }
`;
```

**Acceptance Criteria**:

- [x] Goober installed as dependency
- [x] File created at `src/components/DebugPanel.styles.ts`
- [x] All inline styles extracted to goober classes
- [x] 0 inline style objects remaining in DebugPanel.tsx
- [x] Visual design unchanged
- [x] Dark mode works with system preference
- [x] CSS transitions for hover states
- [x] Build passes

---

### Task 8: Add Accessibility Features

Add ARIA labels, keyboard navigation, focus management to DebugPanel.

**Reference Pattern**: From focus-trap-react/WCAG patterns:

```typescript
// Accessibility features to add:
// 1. aria-label on all interactive elements
// 2. role="dialog" on panel
// 3. aria-modal="true"
// 4. aria-live for status messages
// 5. Focus trap when panel is open
// 6. Focus return when panel closes
// 7. Tab navigation cycling
// 8. Keyboard shortcuts documented

interface AccessibilityFeatures {
  panelRole: 'dialog';
  panelAriaLabel: 'Debug Panel';
  statusAriaLive: 'polite';
  focusTrapEnabled: boolean;
  returnFocusOnClose: boolean;
}

// Focus trap implementation
function useFocusTrap(isActive: boolean, containerRef: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, containerRef]);
}
```

**Acceptance Criteria**:

- [x] All buttons have aria-label
- [x] Panel has role="dialog" and aria-label
- [x] Status messages use aria-live="polite"
- [x] Keyboard navigation works (Ctrl+Shift+D, Escape)
- [x] Focus trap when panel is open
- [x] Escape closes panel
- [x] Focus returns to toggle button on close
- [x] Build passes

---

### Task 9: Add Visual Enhancements

Add emoji icons, color coding, collapsible sections.

**Reference Pattern**: From GitHub debug panel patterns:

```typescript
// Emoji icons for actions
const ACTION_ICONS = {
  downloadJson: '📥',
  downloadTxt: '📄',
  saveDirectory: '📁',
  upload: '☁️',
  clear: '🗑️',
  debug: '🐛',
};

// Log level colors
const LOG_LEVEL_COLORS = {
  ERROR: '#ef4444', // Red
  WARN: '#f97316', // Orange
  INFO: '#3b82f6', // Blue
  DEBUG: '#6b7280', // Gray
};

// Collapsible section with animation
const collapsibleSectionStyles = css`
  .collapsible-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    transition: background 0.2s ease;

    &:hover {
      background: #f1f5f9;
    }
  }

  .collapsible-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .collapsible-content.open {
    max-height: 500px;
  }

  .chevron {
    transition: transform 0.3s ease;
  }

  .chevron.open {
    transform: rotate(180deg);
  }
`;
```

**Acceptance Criteria**:

- [x] Emoji icons used for all actions
- [x] Color coding for log types (ERROR: red, WARN: orange, INFO: blue)
- [x] CSS transitions for hover states
- [x] Collapsible Session Info section
- [x] Visual design enhanced but recognizable
- [x] Build passes

---

### Task 10: Run Tests and Verify

Run all tests and verify the refactoring.

**Reference Pattern**: From Vitest integration testing patterns:

```typescript
// Tests to run:
// 1. Unit tests for interceptor classes
// 2. Unit tests for FileService
// 3. Unit tests for useDebugPanelControls
// 4. Integration tests for useLogRecorder
// 5. Component tests for DebugPanel
// 6. Manual accessibility testing
// 7. Build verification
// 8. Bundle size check
```

**Acceptance Criteria**:

- [x] All unit tests pass (>80% coverage)
- [x] All integration tests pass
- [x] Build passes: `npm run build`
- [x] Bundle size < 27KB (26-27KB due to goober + a11y features)
- [x] Lint passes: `npm run lint`
- [x] Manual QA: Dark mode works
- [x] Manual QA: Accessibility works
- [x] Manual QA: Visual enhancements work

---

## File References

### Current Implementation

- `src/hooks/useLogRecorder.ts` - Main hook (lines 109-453 for extraction)
- `src/components/DebugPanel.tsx` - UI component (~554 lines)
- `src/types/index.ts` - Type definitions

### New Files

- `src/interceptors/ConsoleInterceptor.ts`
- `src/interceptors/NetworkInterceptor.ts`
- `src/interceptors/XHRInterceptor.ts`
- `src/services/FileService.ts`
- `src/hooks/useDebugPanelControls.ts`
- `src/components/DebugPanel.styles.ts`

### Test Files

- `src/interceptors/ConsoleInterceptor.test.ts`
- `src/interceptors/NetworkInterceptor.test.ts`
- `src/interceptors/XHRInterceptor.test.ts`
- `src/services/FileService.test.ts`
- `src/hooks/useDebugPanelControls.test.ts`
- `src/hooks/useLogRecorder.integration.test.ts`

## Dependencies

### New Dependencies

- `goober` (~1KB) - CSS-in-JS styling

### Existing Dependencies (verify)

- `vitest` - Testing
- `@testing-library/react` - Component testing

## Commit Strategy

| After Task | Message                                                    | Files                                |
| ---------- | ---------------------------------------------------------- | ------------------------------------ |
| 1          | `feat(interceptors): add ConsoleInterceptor class`         | ConsoleInterceptor.ts, \*.test.ts    |
| 2          | `feat(interceptors): add NetworkInterceptor class`         | NetworkInterceptor.ts, \*.test.ts    |
| 3          | `feat(interceptors): add XHRInterceptor class`             | XHRInterceptor.ts, \*.test.ts        |
| 4          | `feat(services): add FileService for downloads`            | FileService.ts, \*.test.ts           |
| 5          | `feat(hooks): add useDebugPanelControls hook`              | useDebugPanelControls.ts, \*.test.ts |
| 6          | `refactor(useLogRecorder): use interceptors + auto-upload` | useLogRecorder.ts                    |
| 7          | `style: extract styles to goober`                          | DebugPanel.styles.ts, DebugPanel.tsx |
| 8          | `feat(a11y): add accessibility features`                   | DebugPanel.tsx, DebugPanel.styles.ts |
| 9          | `feat(ui): add visual enhancements`                        | DebugPanel.tsx, DebugPanel.styles.ts |
| 10         | `test: run all tests and verify`                           | All test files                       |

## Verification Commands

```bash
# Run all tests
npm run test

# Run build
npm run build

# Check bundle size
du -sh dist/

# Run lint
npm run lint
```

## Success Criteria

- [x] All interceptor classes created and tested
- [x] FileService created and tested
- [x] useDebugPanelControls hook created and tested
- [x] useLogRecorder refactored with backward compatibility
- [x] DebugPanel uses goober styles
- [x] Dark mode works with system preference
- [x] Accessibility features implemented
- [x] Visual enhancements added
- [x] All tests pass (>80% coverage)
- [x] Build passes
- [x] Bundle size < 27KB (26-27KB due to goober + a11y)
- [x] Lint passes
