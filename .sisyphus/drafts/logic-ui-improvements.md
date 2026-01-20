# Draft: Logic Separation & UI Improvements

## Project Context

- **Project**: @zaob/glean-debug-logger (React/Next.js debug logging library)
- **Test Framework**: Vitest (infrastructure exists)
- **Export Pattern**: Named exports only
- **Bundle Constraint**: < 20KB

---

## Phase 1: Logic Separation Requirements

### 1.1 Interceptor Classes (New Files)

**ConsoleInterceptor** (`src/interceptors/ConsoleInterceptor.ts`)

- [ ] Extract from useLogRecorder.ts lines ~96-152
- [ ] Class-based with `attach()` and `detach()` methods
- [ ] Preserve original console methods
- [ ] Emit logs via callback: `onLog(level: string, args: unknown[])`

**NetworkInterceptor** (`src/interceptors/NetworkInterceptor.ts`)

- [ ] Extract Fetch interception from useLogRecorder.ts lines ~154-253
- [ ] Handle request/response logging
- [ ] Support excludeUrls config
- [ ] Sanitize sensitive data
- [ ] Callback: `onFetchRequest(url, method, body)`, `onFetchResponse(id, response)`

**XHRInterceptor** (`src/interceptors/XHRInterceptor.ts`)

- [ ] Extract XHR interception from useLogRecorder.ts lines ~254-346
- [ ] Monkey-patch XMLHttpRequest
- [ ] Handle async request/response lifecycle
- [ ] Use WeakMap for request tracking (prevent memory leaks)
- [ ] Callback: `onXHRRequest(url, method, body)`, `onXHRResponse(id, response)`

### 1.2 FileService (`src/services/FileService.ts`)

- [ ] Move download logic from useLogRecorder.ts
- [ ] Move `saveToDirectory()` function
- [ ] Move `supportsFileSystemAccess()` check
- [ ] Move blob creation logic
- [ ] Named exports only
- [ ] Handle browser fallback for unsupported browsers

### 1.3 Auto-Upload Logic

- [ ] Move from DebugPanel.tsx useEffect to useLogRecorder
- [ ] Configurable via `uploadOnErrorCount?: number` option
- [ ] Debounced to prevent multiple uploads
- [ ] Option to enable/disable: `autoUploadOnError?: boolean`

### 1.4 Custom Hook for UI

**useDebugPanelControls** (`src/hooks/useDebugPanelControls.ts`)

- [ ] Keyboard shortcut handler (Ctrl+Shift+D)
- [ ] Panel open/close state
- [ ] Directory picker support detection
- [ ] Toast/notification state management
- [ ] Cleanup on unmount

---

## Phase 2: UI Improvements

### 2.1 Style Extraction

- **Option**: goober (<1KB) - recommended for bundle constraint
- **Alternative**: CSS Modules (zero runtime)
- **Move**: All `style={{...}}` objects to `DebugPanel.styles.ts`
- **Pattern**: Tagged template literals with `css` prop

### 2.2 Accessibility

- [ ] ARIA labels on all buttons (download, clear, upload)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus trap when panel is open
- [ ] Focus return when panel closes
- [ ] Screen reader announcements with aria-live
- [ ] Role attributes (status, alert)

### 2.3 Performance

- [ ] React.memo for LogList items
- [ ] Virtual scrolling for large log sets (>100 logs)
- [ ] Debounced search/filter with 300ms delay
- [ ] Lazy loading for heavy components (if any)

### 2.4 Visual Enhancements

- [ ] Icon-based actions (Lucide React icons)
- [ ] Collapsible sections (console, network, metadata)
- [ ] Search/filter with real-time highlighting
- [ ] Color scheme for log levels:
  - Error: Red (#ef4444)
  - Warn: Orange (#f97316)
  - Info: Blue (#3b82f6)
  - Debug: Gray (#6b7280)
- [ ] Dark mode support (optional)

### 2.5 Duplicate Code to Remove

- [ ] Remove `'showDirectoryPicker' in window` from DebugPanel.tsx
- [ ] Use FileService or useDebugPanelControls instead

---

## Research Findings (from 6 background tasks)

### 1. CSS-in-JS Options

| Library     | Size         | Used By                   | Recommendation               |
| ----------- | ------------ | ------------------------- | ---------------------------- |
| **goober**  | <1KB gzip    | notistack, FlipClock      | ✅ Best for <20KB constraint |
| emotion     | ~3KB gzip    | Storybook, MUI, WordPress | Good but larger              |
| CSS Modules | Zero runtime | Universal                 | Zero bundle impact           |

### 2. Interceptor Patterns (from Reactotron, bugsnag, VSCode)

- **Class-based**: `class ConsoleInterceptor { attach(); detach(); }`
- **Store originals**: `const originalLog = console.log`
- **WeakMap tracking**: Prevent memory leaks in XHR interceptors
- **Callback pattern**: `onLog(level, args)`, `onRequest(url, method)`

### 3. FileSystem Access API (from VSCode, Backstage, PyScript)

```typescript
const isSupported = 'showDirectoryPicker' in window;
const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
const writable = await fileHandle.createWritable();
await writable.write(content);
await writable.close();
```

- **Error types**: AbortError (user cancelled), NotAllowedError (permission denied)
- **Fallback**: Standard download with Blob/URL.createObjectURL

### 4. React Performance

- **React.memo** for LogList items (prevent unnecessary re-renders)
- **Virtual scrolling** with react-window for large log sets (>100 items)
- **Lazy loading** for heavy components
- **Debounced search** (300-500ms) for filter functionality

### 5. Accessibility (WCAG 2.2 AA)

- **Focus trap**: Prevent focus escape from modal
- **ARIA labels**: Icon-only buttons need `aria-label`
- **Keyboard nav**: Tab, Enter, Escape support
- **aria-live**: Status announcements (polite for notifications)

### 6. FileService Patterns (from GitHub)

```typescript
// Basic blob download
const blob = new Blob([content], { type: mimeType });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
a.click();
URL.revokeObjectURL(url);
```

---

## User Preferences (CONFIRMED)

### Test Strategy

- [ ] Infrastructure exists: YES
- [ ] User wants tests: **Tests sau khi implement** ✅

### Style Solution

- [x] **goober (<1KB)** - RECOMMENDED ✅
- [ ] CSS Modules (zero runtime)
- [ ] Keep inline styles (NOT recommended)

### Dark Mode

- [x] **System preference detection** ✅
- [ ] Manual toggle
- [ ] Not needed (always light)

### Auto-Upload Behavior

- [x] **Configurable**: `uploadOnErrorCount?: number` ✅
- [x] **Default**: 5-7 errors ✅

### Virtual Scrolling

- [x] **Giữ nguyên list đơn giản** ✅
- [ ] Virtual scrolling for large log sets

---

## Scope Boundaries

### INCLUDED

- All refactoring tasks for logic separation
- All UI improvements listed above
- Test coverage for new modules
- Accessibility fixes

### EXCLUDED

- Changes to main export API (backward compatible)
- Backend/upload server logic
- Changes to existing utils (sanitize, filename, etc.)
- Changes to types (unless needed for refactoring)

---

## Guardrails (from Metis review - pending)

- [ ] Ensure interceptor classes can be mocked for testing
- [ ] Maintain zero breaking changes to public API
- [ ] Bundle size must stay under 20KB
- [ ] Named exports only pattern must be preserved
- [ ] Tests must pass after refactoring
