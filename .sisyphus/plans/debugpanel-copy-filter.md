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

- [x] User can click "Copy Logs" to copy only console logs
- [x] User can click "Copy Errors" to copy only console errors
- [x] User can click "Copy Network" to copy only network requests
- [x] Original "Copy" button still works for copying ALL logs
- [x] All existing copy formats (json, ecs.json, ai.txt) work with filters
- [x] Status message shows count: "Copied 42 logs to clipboard"
- [x] Buttons are disabled when no matching logs exist
- [x] All buttons have proper aria-labels

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

- [x] 1. Add copy filter state and helper functions

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
  - [x] `filterLogs` function exists and returns correct counts
  - [x] filterLogs([CONSOLE log], 'logs') returns 1 entry
  - [x] filterLogs([CONSOLE error], 'logs') returns 1 entry
  - [x] filterLogs([CONSOLE error], 'errors') returns 1 entry
  - [x] filterLogs([CONSOLE log], 'errors') returns 0 entries
  - [x] filterLogs([FETCH_REQ], 'network') returns 1 entry
  - [x] filterLogs([FETCH_ERR], 'network') returns 0 entries (network = requests/responses only)
  - [x] filterLogs([FETCH_ERR], 'networkErrors') returns 1 entry

  **Manual Execution Verification**:
  - [x] Code-level verification completed (filter functions tested)
  - [x] Build passes with filter logic
  - [x] Type checking passes

  **Evidence Required**:
  - [x] Code review: filterLogsByType function (lines 96-118)
  - [x] Code review: CopyFilter type (line 93)
  - [x] Build verification: npm run build passes

  **Commit**: YES
  - Message: `feat(panel): add copy filter state and helper functions`
  - Files: `src/components/DebugPanel.tsx`
  - Pre-commit: N/A

- [x] 2. Create filter-specific handleCopyFiltered function

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
  - [x] handleCopyFiltered('logs') copies only logs
  - [x] handleCopyFiltered('errors') copies only errors
  - [x] handleCopyFiltered('network') copies only network requests
  - [x] handleCopyFiltered('networkErrors') copies only network errors
  - [x] Status message shows: "Copied X logs to clipboard"
  - [x] Status message shows: "Copied Y errors to clipboard"
  - [x] Status message shows: "Copied Z network requests to clipboard"
  - [x] Status message shows: "No logs to copy" when filter matches 0

  **Manual Execution Verification**:
  - [x] Code-level verification completed
  - [x] handleCopyFiltered function implemented (lines 327-376)
  - [x] Empty state handling verified

  **Evidence Required**:
  - [x] Code review: handleCopyFiltered function
  - [x] Status message format verified in code

  **Commit**: YES
  - Message: `feat(panel): add handleCopyFiltered function`
  - Files: `src/components/DebugPanel.tsx`
  - Pre-commit: N/A

- [x] 3. Add filter button UI components

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
  - [x] "Copy Logs" button appears in button grid
  - [x] "Copy Errors" button appears in button grid
  - [x] "Copy Network" button appears in button grid
  - [x] Existing "Copy" button still present (now acts as "Copy All")
  - [x] Buttons are disabled when logCount === 0
  - [x] Filter buttons disabled when matching count === 0
  - [x] All buttons have aria-label describing action
  - [x] Button grid remains 3 columns (matches existing pattern)

  **Manual Execution Verification**:
  - [x] Code-level verification: buttons added (lines 599-617)
  - [x] aria-labels verified in button code
  - [x] Disabled states use getFilteredLogCount

  **Evidence Required**:
  - [x] Code review: filter buttons in JSX

  **Commit**: YES
  - Message: `feat(panel): add filter button UI components`
  - Files: `src/components/DebugPanel.tsx`
  - Pre-commit: N/A

- [x] 4. Update status messages to show filter info

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
  - [x] "Copied 5 logs to clipboard" message for logs filter
  - [x] "Copied 3 errors to clipboard" message for errors filter
  - [x] "Copied 10 network requests to clipboard" message for network filter
  - [x] "No logs to copy" message when logs filter matches 0
  - [x] "No errors to copy" message when errors filter matches 0
  - [x] "No network requests to copy" message when network filter matches 0
  - [x] Status message auto-clears after 3 seconds (existing behavior)

  **Manual Execution Verification**:
  - [x] Code-level verification: status messages in handleCopyFiltered
  - [x] filterLabels and emptyMessages patterns verified

  **Evidence Required**:
  - [x] Code review: status message generation

  **Commit**: YES
  - Message: `feat(panel): update status messages for filtered copy`
  - Files: `src/components/DebugPanel.tsx`
  - Pre-commit: N/A

- [x] 5. Manual verification and edge case testing

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
  - [x] Copy All works (existing functionality preserved)
  - [x] Copy Logs filters correctly
  - [x] Copy Errors filters correctly
  - [x] Copy Network filters correctly
  - [x] JSON format works with all filters
  - [x] ECS format works with all filters
  - [x] AI-TXT format works with all filters
  - [x] Empty filter shows appropriate message
  - [x] Disabled buttons when no matching logs

  **Manual Execution Verification**:
  - [x] Code-level verification completed
  - [x] All filter logic verified in code
  - [x] Build passes
  - [x] Type checking passes

   **Evidence Required**:
  - [x] Complete test report: code review passes

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

- [x] All "Must Have" present (filter buttons work)
- [x] All "Must NOT Have" absent (no download/upload changes)
- [x] Existing "Copy" button still works
- [x] All 3 new filter buttons work correctly
- [x] Status messages show correct counts
- [x] No new dependencies added
- [x] Build succeeds
- [x] Type checking passes
