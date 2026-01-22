# Work Plan: Add Copy Filter Options to DebugPanel

## Context

### Original Request

Add the ability for users to copy LOGS only, ERRORS only, or NETWORK only from the DebugPanel component.

### Interview Summary

**Key Discussions**:

- User wants filtered copy functionality: copy logs only, errors only, or network only
- Current implementation has a single "Copy" button that copies ALL logs
- Existing settings dropdown handles copy FORMAT selection (json, ecs.json, ai.txt)

**Research Findings**:

- `handleCopy` function (lines 219-285) uses `getLogs()` which returns all logs
- Copy format stored in localStorage as `debug-panel-copy-format`
- Log types: CONSOLE, FETCH_REQ, FETCH_RES, FETCH_ERR, XHR_REQ, XHR_RES, XHR_ERR
- Current stats show: logCount (all), errorCount (CONSOLE errors), networkErrorCount (network errors)

### Metis Review

**Identified Gaps (addressed in this plan)**:

- Clarified "Network" category definition (see Defaults Applied below)
- Defined UI pattern (3 new buttons alongside Copy)
- Added accessibility requirements
- Specified error handling for empty filter results

---

## Work Objectives

### Core Objective

Add filter buttons to the DebugPanel allowing users to copy only LOGS, ERRORS, or NETWORK requests (in addition to the existing "Copy All" functionality).

### Concrete Deliverables

- Updated `src/components/DebugPanel.tsx` with filter logic
- 3 new filter buttons: "Copy Logs", "Copy Errors", "Copy Network"
- Enhanced `handleCopy` function with filter parameter
- Updated status messages showing filter type and count
- Accessible button labels and disabled states

### Definition of Done

- [ ] User can click "Copy Logs" to copy only console logs
- [ ] User can click "Copy Errors" to copy only console errors
- [ ] User can click "Copy Network" to copy only network requests
- [ ] Original "Copy" button still works for copying ALL logs
- [ ] All existing copy formats (json, ecs.json, ai.txt) work with filters
- [ ] Status message shows count: "Copied 42 logs to clipboard"
- [ ] Buttons are disabled when no matching logs exist
- [ ] All buttons have proper aria-labels

### Must Have

- Filtered copy functionality for logs, errors, network
- Updated status messages with filter info
- Disabled state when filter has no matches
- No new dependencies (zero runtime deps constraint)

### Must NOT Have (Guardrails)

- No changes to download or upload functionality
- No changes to useLogRecorder.ts API or exports
- No new keyboard shortcuts
- No filter presets or combinations (e.g., "logs + errors")
- No persistence to localStorage (keep session-scoped)

---

## Verification Strategy

### Test Decision

- **Infrastructure exists**: YES (vitest is configured)
- **User wants tests**: NO (manual verification only)
- **Framework**: N/A - Manual verification

### Manual Verification Procedures

**By Deliverable Type:**

| Type                | Tool       | Procedure                                                             |
| ------------------- | ---------- | --------------------------------------------------------------------- |
| **UI changes**      | Playwright | Navigate to test page, click filter buttons, verify clipboard content |
| **Status messages** | Terminal   | Check console for errors, verify status div appears                   |

---

## Task Flow

```
State Management → Filter Logic → UI Components → Status Messages → Testing
```

## Parallelization

| Group | Tasks | Reason                     |
| ----- | ----- | -------------------------- |
| A     | 1, 2  | Independent research tasks |
| B     | 3, 4  | Can be done in parallel    |

| Task | Depends On | Reason                               |
| ---- | ---------- | ------------------------------------ |
| 3    | 1          | Filter logic builds on state changes |
| 4    | 1, 3       | UI uses filter logic                 |
| 5    | 4          | Status messages depend on UI         |

---

## TODOs

- [ ] 1. Add copy filter state and helper functions

  **What to do**:
  - Add `copyFilter` state with values: 'all' | 'logs' | 'errors' | 'network' | 'networkErrors'
  - Create helper function `filterLogs(logs, filter)` that returns filtered array
  - Define filter category logic:
    - logs: CONSOLE entries (any level)
    - errors: CONSOLE entries with level === 'ERROR'
    - network: FETCH_REQ, FETCH_RES, XHR_REQ, XHR_RES (all network requests + responses)
    - networkErrors: FETCH_ERR, XHR_ERR only

  **Must NOT do**:
  - Don't modify getLogs() or any useLogRecorder exports
  - Don't add localStorage persistence for filter

  **Parallelizable**: YES (with 2) | NO

  **References**:

  **Pattern References**:
  - `src/components/DebugPanel.tsx:77-85` - copyFormat state pattern (localStorage-backed state)
  - `src/components/DebugPanel.tsx:219-285` - handleCopy function pattern

  **Type References**:
  - `src/types/index.ts:6-13` - LogType union (CONSOLE, FETCH_REQ, etc.)
  - `src/types/index.ts:17-23` - ConsoleLogEntry interface

  **Test References**:
  - `src/hooks/useLogRecorder.ts:162-179` - updateMetadata function showing how to count by type

  **Acceptance Criteria**:
  - [ ] `filterLogs` function exists and returns correct counts
  - [ ] filterLogs([CONSOLE log], 'logs') returns 1 entry
  - [ ] filterLogs([CONSOLE error], 'logs') returns 1 entry
  - [ ] filterLogs([CONSOLE error], 'errors') returns 1 entry
  - [ ] filterLogs([CONSOLE log], 'errors') returns 0 entries
  - [ ] filterLogs([FETCH_REQ], 'network') returns 1 entry
  - [ ] filterLogs([FETCH_ERR], 'network') returns 0 entries (network = requests/responses only)
  - [ ] filterLogs([FETCH_ERR], 'networkErrors') returns 1 entry

  **Manual Execution Verification**:
  - [ ] Using playwright browser automation:
    - Navigate to test page with debug panel
    - Open debug panel (Ctrl+Shift+D)
    - Open browser console
    - Manually trigger console.log and console.error
    - Click "Copy Logs" button
    - Paste clipboard content
    - Verify: pasted content contains console.log but NOT console.error
    - Click "Copy Errors" button
    - Paste clipboard content
    - Verify: pasted content contains console.error but NOT console.log

  **Evidence Required**:
  - [ ] Screenshot of pasted clipboard content for "Copy Logs"
  - [ ] Screenshot of pasted clipboard content for "Copy Errors"

  **Commit**: YES
  - Message: `feat(panel): add copy filter state and helper functions`
  - Files: `src/components/DebugPanel.tsx`
  - Pre-commit: N/A

- [ ] 2. Create filter-specific handleCopyFiltered function

  **What to do**:
  - Create `handleCopyFiltered(filter: CopyFilter)` function
  - Takes filter parameter, applies filtering before generating content
  - Updates status message to include filter type and count
  - Handle empty results with appropriate message

  **Must NOT do**:
  - Don't duplicate handleCopy logic - refactor to share

  **Parallelizable**: YES (with 1) | NO

  **References**:

  **Pattern References**:
  - `src/components/DebugPanel.tsx:219-285` - handleCopy function showing format handling
  - `src/components/DebugPanel.tsx:274-285` - clipboard write and status update pattern

  **Acceptance Criteria**:
  - [ ] handleCopyFiltered('logs') copies only logs
  - [ ] handleCopyFiltered('errors') copies only errors
  - [ ] handleCopyFiltered('network') copies only network requests
  - [ ] handleCopyFiltered('networkErrors') copies only network errors
  - [ ] Status message shows: "Copied X logs to clipboard"
  - [ ] Status message shows: "Copied Y errors to clipboard"
  - [ ] Status message shows: "Copied Z network requests to clipboard"
  - [ ] Status message shows: "No logs to copy" when filter matches 0

  **Manual Execution Verification**:
  - [ ] Using playwright browser automation:
    - Navigate to test page with debug panel
    - Open debug panel (Ctrl+Shift+D)
    - Make some network requests (fetch calls)
    - Click "Copy Network" button
    - Paste clipboard content
    - Verify: pasted content contains fetch requests/responses only

  **Evidence Required**:
  - [ ] Screenshot of pasted clipboard content for "Copy Network"

  **Commit**: YES
  - Message: `feat(panel): add handleCopyFiltered function`
  - Files: `src/components/DebugPanel.tsx`
  - Pre-commit: N/A

- [ ] 3. Add filter button UI components

  **What to do**:
  - Add 3 new buttons in the action button grid:
    - "📋 Logs" - copies only console logs
    - "⚠️ Errors" - copies only errors
    - "🌐 Network" - copies only network requests
  - Keep existing "Copy" button as "Copy All"
  - Add disabled state based on filter match count
  - Add descriptive aria-labels

  **Must NOT do**:
  - Don't change the stats grid layout
  - Don't modify download buttons

  **Parallelizable**: NO (depends on 1) | YES (with 4)

  **References**:

  **Pattern References**:
  - `src/components/DebugPanel.tsx:461-519` - existing button grid structure
  - `src/components/DebugPanel.styles.ts:459-490` - actionButtonStyles

  **Style References**:
  - `src/components/DebugPanel.styles.ts:229-233` - buttonGrid3Styles for 3-column layout

  **Acceptance Criteria**:
  - [ ] "Copy Logs" button appears in button grid
  - [ ] "Copy Errors" button appears in button grid
  - [ ] "Copy Network" button appears in button grid
  - [ ] Existing "Copy" button still present (now acts as "Copy All")
  - [ ] Buttons are disabled when logCount === 0
  - [ ] Filter buttons disabled when matching count === 0
  - [ ] All buttons have aria-label describing action
  - [ ] Button grid remains 3 columns (matches existing pattern)

  **Manual Execution Verification**:
  - [ ] Using playwright browser automation:
    - Navigate to test page with debug panel
    - Open debug panel (Ctrl+Shift+D)
    - Verify 4 copy-related buttons visible: Copy, Logs, Errors, Network
    - Click each button in sequence
    - Verify status message updates for each

  **Evidence Required**:
  - [ ] Screenshot of debug panel showing 4 copy buttons

  **Commit**: YES
  - Message: `feat(panel): add filter button UI components`
  - Files: `src/components/DebugPanel.tsx`
  - Pre-commit: N/A

- [ ] 4. Update status messages to show filter info

  **What to do**:
  - Modify copyStatus state to include filter type
  - Update status message format to include count and filter
  - Handle empty filter results with appropriate message

  **Must NOT do**:
  - Don't change uploadStatus or directoryStatus handling

  **Parallelizable**: NO (depends on 2, 3)

  **References**:

  **Pattern References**:
  - `src/components/DebugPanel.tsx:70-73` - copyStatus state definition
  - `src/components/DebugPanel.tsx:287-305` - copyStatus auto-clear useEffect
  - `src/components/DebugPanel.tsx:547-557` - copyStatus display in JSX

  **Acceptance Criteria**:
  - [ ] "Copied 5 logs to clipboard" message for logs filter
  - [ ] "Copied 3 errors to clipboard" message for errors filter
  - [ ] "Copied 10 network requests to clipboard" message for network filter
  - [ ] "No logs to copy" message when logs filter matches 0
  - [ ] "No errors to copy" message when errors filter matches 0
  - [ ] "No network requests to copy" message when network filter matches 0
  - [ ] Status message auto-clears after 3 seconds (existing behavior)

  **Manual Execution Verification**:
  - [ ] Using playwright browser automation:
    - Navigate to test page with debug panel
    - Open debug panel (Ctrl+Shift+D)
    - Trigger various log types (log, error, fetch)
    - Click each filter button
    - Observe status message for each

  **Evidence Required**:
  - [ ] Screenshot showing "Copied X logs to clipboard" message
  - [ ] Screenshot showing "Copied Y errors to clipboard" message
  - [ ] Screenshot showing "Copied Z network requests to clipboard" message

  **Commit**: YES
  - Message: `feat(panel): update status messages for filtered copy`
  - Files: `src/components/DebugPanel.tsx`
  - Pre-commit: N/A

- [ ] 5. Manual verification and edge case testing

  **What to do**:
  - Test all filter combinations
  - Test empty state handling
  - Verify all copy formats work with filters
  - Test disabled states

  **Must NOT do**:
  - Don't modify any code during testing

  **Parallelizable**: NO (depends on 4)

  **References**:
  - N/A

  **Acceptance Criteria**:
  - [ ] Copy All works (existing functionality preserved)
  - [ ] Copy Logs filters correctly
  - [ ] Copy Errors filters correctly
  - [ ] Copy Network filters correctly
  - [ ] JSON format works with all filters
  - [ ] ECS format works with all filters
  - [ ] AI-TXT format works with all filters
  - [ ] Empty filter shows appropriate message
  - [ ] Disabled buttons when no matching logs

  **Manual Execution Verification**:
  - [ ] Using playwright browser automation:
    - Full workflow test with all filter combinations
    - Verify clipboard content for each filter
    - Verify status messages
    - Verify disabled states

  **Evidence Required**:
  - [ ] Complete test report with screenshots for each scenario

  **Commit**: YES
  - Message: `test(panel): verify copy filter functionality`
  - Files: N/A (verification only)
  - Pre-commit: N/A

---

## Commit Strategy

| After Task | Message                                                   | Files          | Verification    |
| ---------- | --------------------------------------------------------- | -------------- | --------------- |
| 1          | `feat(panel): add copy filter state and helper functions` | DebugPanel.tsx | Function tests  |
| 2          | `feat(panel): add handleCopyFiltered function`            | DebugPanel.tsx | Function tests  |
| 3          | `feat(panel): add filter button UI components`            | DebugPanel.tsx | Visual test     |
| 4          | `feat(panel): update status messages for filtered copy`   | DebugPanel.tsx | Status messages |
| 5          | `test(panel): verify copy filter functionality`           | N/A            | Full workflow   |

---

## Success Criteria

### Verification Commands

```bash
# Run existing tests (should still pass)
npm test

# Build should succeed
npm run build
```

### Final Checklist

- [ ] All "Must Have" present (filter buttons work)
- [ ] All "Must NOT Have" absent (no download/upload changes)
- [ ] Existing "Copy" button still works
- [ ] All 3 new filter buttons work correctly
- [ ] Status messages show correct counts
- [ ] No new dependencies added
- [ ] Build succeeds
- [ ] Type checking passes
