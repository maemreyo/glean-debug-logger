# Feature: Custom Download Directory (CONFIRMED)

## User Requirements (Confirmed)

1. **Use case**: Auto-save to project folder
2. **Environment**: Browser-only web app
3. **User experience**: Directory Picker with config + per-download option
4. **Browser support**: All modern browsers (Chrome + Firefox critical) with fallback
5. **Priority**: Critical

## Confirmed API Design

```typescript
// Config
interface LogRecorderConfig {
  enableDirectoryPicker?: boolean; // NEW: Enable directory picker feature
}

// Download options
interface DownloadOptions {
  showPicker?: boolean; // NEW: Override, show picker this time
}

// Updated signature
downloadLogs: (
  format?: 'json' | 'txt',
  customFilename?: string | null,
  options?: DownloadOptions
) => string | null;
```

## Critical Questions from Metis Review

### Q1: Permission Persistence

**Directory selection - per-session or persistent?**

- A. Per-session only (re-select each time)
- B. Persist across sessions (use IndexedDB to store handle)

### Q2: Override Behavior

**If `enableDirectoryPicker: false` in config, can `showPicker: true` override it?**

- A. No, config takes precedence
- B. Yes, per-download option overrides config

### Q3: Filename in Directory

**When saving to directory, which filename is used?**

- A. `fileNameTemplate` (existing behavior)
- B. Fixed filename, directory picker is just for location
- C. Both: Template generates name, saved to picked directory

### Q4: Fallback UX (Firefox/Safari)

**What happens when unsupported browser user clicks directory button?**

- A. Silent auto-fallback to browser download
- B. Show warning/toast, then fallback
- C. Disable button completely on unsupported browsers

### Q5: Permission Denied

**What happens if user denies directory permission?**

- A. Silent fallback to browser download
- B. Show error message, allow retry
- C. Throw error to caller

### Q6: User Cancellation

**What happens if user closes directory picker without selecting?**

- A. Silent cancel, no file downloaded
- B. Show confirmation dialog
- C. Throw AbortError

---

## Metis Guardrails (Must Follow)

### MUST

- Feature detect File System Access API before use
- Handle AbortError as "user cancelled" (not error state)
- Preserve existing downloadLogs API signature (extend, don't break)
- Follow LogRecorderConfig extension pattern from src/types/index.ts
- Add `enableDirectoryPicker: false` to DEFAULT_CONFIG (zero breaking change)
- Test on Firefox/Safari to verify fallback works

### MUST NOT

- Store FileSystemDirectoryHandle in localStorage (not serializable)
- Modify existing download logic for fallback path
- Break existing DebugPanel download UI (extend, don't replace)
- Add IndexedDB persistence for directory handles

### Scope Exclusions

- No file history or versioning
- No batch exports or progress tracking
- No directory auto-cleanup
- No upload functionality (download-only)

---

## Acceptance Criteria (Draft)

### Functional

- [ ] AC1: Chrome/Edge - File saved directly to selected directory
- [ ] AC2: Firefox/Safari - Falls back to browser download with UI indicator
- [ ] AC3: User cancels picker - Silent cancel, no error
- [ ] AC4: Permission denied - Show error, allow retry
- [ ] AC5: Backward compatibility - Existing `downloadLogs('json')` works unchanged
- [ ] AC6: Override works - `showPicker: true` overrides `enableDirectoryPicker: false`

### Non-Functional

- [ ] Bundle size increase < 3KB
- [ ] Directory button hidden on unsupported browsers
- [ ] HTTPS context detection

---

## Implementation Tasks (Draft)

### Phase 1: Foundation

1. Add `enableDirectoryPicker` to LogRecorderConfig type
2. Add `DownloadOptions` interface
3. Implement `supportsFileSystemAccess()` utility
4. Update downloadLogs signature

### Phase 2: Integration

5. Implement File System Access API with try/catch
6. Add fallback to standard download
7. Handle all error types (AbortError, SecurityError, NotAllowedError)

### Phase 3: UI & Testing

8. Update DebugPanel with directory button
9. Add tests for all error cases
10. Verify bundle size impact

---

## Awaiting User Answers to Critical Questions

## Confirmed User Experience

1. User configures: `enableDirectoryPicker: true`
2. User calls: `downloadLogs('json', 'logs.json', { showPicker: true })`
3. Browser shows directory picker dialog
4. User selects directory
5. File saved to that location
6. Browser may remember choice for next time

## Browser Support Strategy

| Browser    | With Feature Enabled   | Fallback (Feature Disabled) |
| ---------- | ---------------------- | --------------------------- |
| Chrome 86+ | ✅ showDirectoryPicker | ✅ Standard download        |
| Edge 86+   | ✅ showDirectoryPicker | ✅ Standard download        |
| Firefox    | ❌ Not supported       | ✅ Standard download        |
| Safari     | ❌ Not supported       | ✅ Standard download        |

## Implementation Tasks (From Analysis)

### Phase 1: Core Implementation

- [ ] Add `enableDirectoryPicker` to `LogRecorderConfig`
- [ ] Add `DownloadOptions` interface
- [ ] Update `downloadLogs` signature
- [ ] Implement File System Access API
- [ ] Add fallback to standard download

### Phase 2: DebugPanel Integration

- [ ] Add "Save to Directory" button
- [ ] Update UI with directory picker option

### Phase 3: Testing

- [ ] Unit tests for new config option
- [ ] Unit tests for directory picker flow
- [ ] Verify fallback behavior
- [ ] Cross-browser testing

## Technical Notes

### File System Access API Pattern

```typescript
const handle = await window.showDirectoryPicker();
const fileHandle = await handle.getFileHandle(filename, { create: true });
const writable = await fileHandle.createWritable();
await writable.write(content);
await writable.close();
```

### Fallback Pattern

```typescript
if (options.showPicker && 'showDirectoryPicker' in window) {
  // Try directory picker
  try {
    await saveWithDirectoryPicker(content, filename);
    return filename;
  } catch (err) {
    // User cancelled or error - fallback to standard
  }
}
// Standard download
return standardDownload(content, filename);
```


