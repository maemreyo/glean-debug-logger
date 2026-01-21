# Work Plan: Add Copy-to-Clipboard Button to DebugPanel

## Context

### Original Request

User wants to add a copy-to-clipboard button to DebugPanel so users can copy logs directly without having to download files first.

### Interview Summary

**Key Discussions**:

- User specifically requested copying logs directly to clipboard
- Current workflow requires: click download → open file → copy content
- New workflow: click "Copy" button → logs are in clipboard
- Must follow existing panel style (neutral palette, consistent with download buttons)

**Research Findings**:

- `useLogRecorder.downloadLogs()` returns only filename, not content
- Use `getLogs()` + `getMetadata()` to get raw data for clipboard
- Content format: `JSON.stringify({ metadata: getMetadata(), logs: getLogs() }, null, 2)`
- Test infrastructure: Vitest + @testing-library/react exists
- Existing tests: `src/components/__tests__/DebugPanel.test.tsx` is a good reference

### Metis Review

**Identified Gaps (addressed)**:

- Test location: Use `DebugPanel.test.tsx` with play functions (existing pattern)
- Button layout: Change `buttonRowStyles` to 4-column grid (`grid-template-columns: repeat(4, 1fr)`)
- Empty logs handling: Disable button when `logCount === 0` (consistent with Folder button)
- Format: Copy as JSON only (consistent with default download behavior)
- Error handling: Try/catch with error message reusing existing `uploadStatus` state
- Success message: 3-second timeout (same pattern as directoryStatus)
- Dark mode: Use existing `downloadButtonStyles` dark mode palette

---

## Work Objectives

### Core Objective

Add a "📋 Copy" button to the DebugPanel that copies logs directly to clipboard, allowing users to quickly share log content without downloading files.

### Concrete Deliverables

- New copy button in DebugPanel button row (4th position)
- Copy functionality that generates JSON content and writes to clipboard
- Success/error feedback message
- Updated button grid layout (3 columns → 4 columns)
- Unit tests for copy functionality

### Definition of Done

- [ ] Clicking "Copy" button copies logs as JSON to clipboard
- [ ] Success message "Copied to clipboard!" appears for 3 seconds
- [ ] Error message appears if clipboard fails
- [ ] Button is disabled when there are no logs (logCount === 0)
- [ ] Button follows existing neutral button styling
- [ ] Dark mode styling matches existing buttons
- [ ] Unit tests pass
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes

### Must Have

- Copy button with consistent styling
- Proper success/error feedback
- Disabled state for empty logs
- Unit tests

### Must NOT Have (Guardrails)

- Don't modify `useLogRecorder` hook (use existing API only)
- Don't change existing download/upload functionality
- Don't add new files outside `src/components/`
- Don't change default format from JSON (what download uses)
- Don't add clipboard fallback for non-HTTPS contexts (document.execCommand is deprecated)

---

## Verification Strategy (Manual QA)

### Test Decision

- **Infrastructure exists**: YES
- **User wants tests**: YES (existing tests pattern)
- **Framework**: Vitest + @testing-library/react
- **Test file**: `src/components/__tests__/DebugPanel.test.tsx`

### Manual Verification Commands

**For UI/Button changes**:

- Navigate to Storybook: `npm run storybook` → Find DebugPanel
- Or use Playwright to interact with DebugPanel
- Verify: Button appears in 4th position of button row
- Verify: Clicking copies to clipboard (check browser clipboard)
- Verify: Success message appears

**For Error Handling**:

- Test with clipboard permission denied (manually revoke in browser)
- Verify: Error message appears

**For Disabled State**:

- Open DebugPanel with 0 logs
- Verify: Copy button is disabled (grayed out)

---

## Task Flow

```
buttonRowStyles (4-col) → handleCopy function → copyButton component → Tests
```

## Parallelization

| Group | Tasks | Reason                     |
| ----- | ----- | -------------------------- |
| A     | 1, 2  | Independent styles updates |

| Task | Depends On | Reason                                  |
| ---- | ---------- | --------------------------------------- |
| 3    | 1, 2       | Needs both styles and component changes |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.

- [ ] 1. Update buttonRowStyles to 4-column grid in DebugPanel.styles.ts

  **What to do**:
  - Change `grid-template-columns: repeat(3, 1fr)` to `repeat(4, 1fr)` in `buttonRowStyles`
  - This accommodates the new 4th button (Copy)

  **Must NOT do**:
  - Don't change any other grid-related styles

  **Parallelizable**: YES (with 2)

  **References**:
  - `src/components/DebugPanel.styles.ts:221-225` - Existing `buttonRowStyles` definition

  **Acceptance Criteria**:
  - [ ] `grid-template-columns: repeat(4, 1fr)` is applied
  - [ ] `npm run lint` passes
  - [ ] `npm run build` succeeds

  **Commit**: YES | NO
  - Message: `refactor(components): update button row to 4 columns for copy button`
  - Files: `src/components/DebugPanel.styles.ts`

- [ ] 2. Add handleCopy function and copy status state in DebugPanel.tsx

  **What to do**:
  - Add `copyStatus` state (same structure as `uploadStatus`: `{ type: 'success' | 'error', message: string }`)
  - Add `handleCopy` function:
    ```typescript
    const handleCopy = useCallback(async () => {
      setCopyStatus(null);
      try {
        const logs = getLogs();
        const metadata = getMetadata();
        const content = JSON.stringify({ metadata, logs }, null, 2);
        await navigator.clipboard.writeText(content);
        setCopyStatus({
          type: 'success',
          message: 'Copied to clipboard!',
        });
      } catch {
        setCopyStatus({
          type: 'error',
          message: 'Failed to copy. Check clipboard permissions.',
        });
      }
    }, [getLogs, getMetadata]);
    ```
  - Add 3-second timeout effect for copyStatus (reuse pattern from directoryStatus)
  - Add button in JSX (after Folder button in button row):
    ```tsx
    <button
      type="button"
      onClick={handleCopy}
      disabled={logCount === 0}
      className={downloadButtonStyles}
      aria-label="Copy logs to clipboard"
      title="Copy logs as JSON to clipboard"
    >
      📋 Copy
    </button>
    ```

  **Must NOT do**:
  - Don't modify downloadLogs or uploadLogs functionality
  - Don't add new imports (reuse existing)

  **Parallelizable**: YES (with 1)

  **References**:
  - `src/components/DebugPanel.tsx:170-195` - `handleSaveToDirectory` pattern (try/catch, status state, 3-second timeout)
  - `src/components/DebugPanel.tsx:65-68` - `directoryStatus` state definition
  - `src/components/DebugPanel.tsx:197-205` - `directoryStatus` timeout effect
  - `src/hooks/useLogRecorder.ts` - `getLogs()` and `getMetadata()` return types

  **Acceptance Criteria**:
  - [ ] `handleCopy` function is added with try/catch
  - [ ] `copyStatus` state is defined (reusing uploadStatus or new state)
  - [ ] Success message "Copied to clipboard!" appears for 3 seconds
  - [ ] Error message appears on clipboard failure
  - [ ] Button is disabled when `logCount === 0`
  - [ ] Button appears in 4th position of button row
  - [ ] `npm run lint` passes
  - [ ] `npm run build` succeeds

  **Commit**: YES | NO
  - Message: `feat(components): add copy-to-clipboard button to DebugPanel`
  - Files: `src/components/DebugPanel.tsx`

- [ ] 3. Add copy status message display in DebugPanel.tsx

  **What to do**:
  - Add copyStatus display (reuse existing status display pattern):
    ```tsx
    {
      copyStatus && (
        <div
          role="status"
          aria-live="polite"
          className={copyStatus.type === 'success' ? successMessageStyles : errorMessageStyles}
        >
          {copyStatus.message}
        </div>
      );
    }
    ```
  - Place it after the uploadStatus display (around line 373)

  **Must NOT do**:
  - Don't change existing uploadStatus or directoryStatus displays

  **Parallelizable**: NO (depends on 2)

  **References**:
  - `src/components/DebugPanel.tsx:363-373` - `uploadStatus` display pattern
  - `src/components/DebugPanel.tsx:375-385` - `directoryStatus` display pattern

  **Acceptance Criteria**:
  - [ ] Copy status message appears when copyStatus is set
  - [ ] Green success style for success, red error style for errors
  - [ ] ARIA attributes for accessibility (role="status", aria-live="polite")
  - [ ] `npm run lint` passes

  **Commit**: YES | NO
  - Message: `feat(components): add copy status message display`
  - Files: `src/components/DebugPanel.tsx`

- [ ] 4. Add unit tests for copy functionality in DebugPanel.test.tsx

  **What to do**:
  - Add tests using existing test patterns (play functions):

    ```typescript
    test('copy button copies logs to clipboard', async () => {
      const user = userEvent.setup();
      const mockClipboard = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText: mockClipboard } });

      render(<DebugPanel />);
      await user.click(screen.getByRole('button', { name: /Debug/i }));

      // Copy button should be visible
      const copyButton = screen.getByRole('button', { name: /Copy logs to clipboard/i });
      expect(copyButton).toBeInTheDocument();

      // Click copy
      await user.click(copyButton);

      // Verify clipboard was called with JSON
      expect(mockClipboard).toHaveBeenCalledWith(
        expect.stringContaining('"metadata"')
      );
      expect(mockClipboard).toHaveBeenCalledWith(
        expect.stringContaining('"logs"')
      );

      // Verify success message appears
      expect(screen.getByText('Copied to clipboard!')).toBeInTheDocument();
    });

    test('copy button is disabled when no logs', async () => {
      const user = userEvent.setup();
      vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn() } });

      render(<DebugPanel />);
      await user.click(screen.getByRole('button', { name: /Debug/i }));

      const copyButton = screen.getByRole('button', { name: /Copy logs to clipboard/i });
      expect(copyButton).toBeDisabled();
    });

    test('copy button shows error on clipboard failure', async () => {
      const user = userEvent.setup();
      vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Clipboard error')) } });

      render(<DebugPanel />);
      await user.click(screen.getByRole('button', { name: /Debug/i }));

      const copyButton = screen.getByRole('button', { name: /Copy logs to clipboard/i });
      await user.click(copyButton);

      expect(screen.getByText('Failed to copy')).toBeInTheDocument();
    });
    ```

  **Must NOT do**:
  - Don't create new test file (add to existing DebugPanel.test.tsx)
  - Don't use testing-library/user-event v14 syntax (existing codebase uses v13)

  **Parallelizable**: NO (depends on 2, 3)

  **References**:
  - `src/components/__tests__/DebugPanel.test.tsx` - Existing test patterns, imports, and setup
  - `src/components/__tests__/useDebugPanelControls.test.tsx` - Example of testing button interactions

  **Acceptance Criteria**:
  - [ ] `npm run test` passes (all existing + new tests)
  - [ ] Tests cover: successful copy, empty logs disabled state, clipboard failure error
  - [ ] Tests use existing pattern (play functions, userEvent.setup)
  - [ ] Tests mock navigator.clipboard properly

  **Commit**: YES | NO
  - Message: `test(components): add tests for copy-to-clipboard functionality`
  - Files: `src/components/__tests__/DebugPanel.test.tsx`

- [ ] 5. Run full verification

  **What to do**:
  - Run `npm run test` - all tests pass
  - Run `npm run build` - build succeeds
  - Run `npm run lint` - lint passes
  - Run `npm run format` - formatting is correct

  **Must NOT do**:
  - Don't modify any files in this step (only run commands)

  **Parallelizable**: NO (depends on 1-4)

  **References**:
  - `package.json:59-63` - Available scripts

  **Acceptance Criteria**:
  - [ ] `npm run test` → all tests pass
  - [ ] `npm run build` → successful build
  - [ ] `npm run lint` → no errors
  - [ ] `npm run format` → no changes needed

  **Commit**: YES | NO
  - Files: (none - verification only)

---

## Commit Strategy

| After Task | Message                                                                | Files                                          | Verification        |
| ---------- | ---------------------------------------------------------------------- | ---------------------------------------------- | ------------------- |
| 1          | `refactor(components): update button row to 4 columns for copy button` | `src/components/DebugPanel.styles.ts`          | npm run lint        |
| 2          | `feat(components): add copy-to-clipboard button to DebugPanel`         | `src/components/DebugPanel.tsx`                | npm run lint, build |
| 3          | `feat(components): add copy status message display`                    | `src/components/DebugPanel.tsx`                | npm run lint        |
| 4          | `test(components): add tests for copy-to-clipboard functionality`      | `src/components/__tests__/DebugPanel.test.tsx` | npm run test        |

---

## Success Criteria

### Verification Commands

```bash
npm run test                    # All tests pass (including new copy tests)
npm run build                   # Build succeeds
npm run lint                    # No ESLint errors
npm run format -- --check       # Formatting is correct
```

### Final Checklist

- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Lint passes
