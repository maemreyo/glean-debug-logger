# Network Request Filter Settings

## Context

### Original Request

Add settings options to filter/success failed network requests in the debug panel UI. Update `useSettingsDropdown.ts` to manage these settings, extract `SettingsDropdownContent` into its own component, and update the UI with new filter functionality.

### Interview Summary

**Key Discussions**:

- **Filter UI Style**: Dropdown select sub-menu with options: "All", "Success only", "Failed only"
- **Filter Scope**: Apply to both debug panel display AND exports (download/upload)
- **Show Counts**: Yes, display dynamic counts next to each option (e.g., "All: 142", "Failed: 5")
- **Settings Persistence**: Use localStorage following `useCopyFormat` pattern
- **Test Strategy**: Tests after implementation (vitest), not TDD
- **Component Extraction**: Extract `SettingsDropdownContent` to separate file

**Research Findings**:

- SettingsDropdownContent currently inline in `DebugPanelHeader.tsx` (lines 77-145)
- Network logging tracks success via `FETCH_RES`/`XHR_RES` with status 200-299
- Network failures are `FETCH_ERR`/`XHR_ERR` entries OR responses with status 400-599
- `useCopyFormat.ts` is reference for localStorage-based settings pattern
- Project uses vitest for testing with React Testing Library
- Named exports only constraint (tree-shaking requirement for bundle size)
- Bundle size constraint: < 20KB

### Gap Analysis

**Self-Identified Gaps (addressed)**:

1. **Hook naming**: Decided to create `useNetworkFilter` hook (not extend `useSettingsDropdown`) to maintain separation of concerns - `useSettingsDropdown` manages UI state, `useNetworkFilter` manages persistent settings.
2. **Count calculation**: Need to calculate counts dynamically based on current logs - will implement in `useNetworkFilter` hook with memoization for performance.
3. **Export filtering**: Need to ensure `downloadLogs` and `uploadLogs` in `useLogRecorder` respect the filter setting - this requires passing filter state to those operations.
4. **Display filtering**: DebugPanel needs to filter displayed logs based on network filter setting - requires access to filter state.

**Guardrails Applied**:

- Do NOT modify `useLogRecorder` internal behavior (only pass filter as parameter to export functions)
- Do NOT break existing copy format functionality
- Do NOT increase bundle size significantly (minimal new code)
- Do NOT add external dependencies (use existing Radix UI components)
- Do NOT change existing localStorage keys (only add new key for network filter)

---

## Work Objectives

### Core Objective

Add network request filter functionality to the debug panel settings, allowing users to view and export logs filtered by success/failure status.

### Concrete Deliverables

- `src/hooks/useNetworkFilter.ts` - New hook for network filter state management
- `src/components/SettingsDropdownContent.tsx` - Extracted component with network filter UI
- Updated `DebugPanelHeader.tsx` - Import and use extracted component
- Updated `src/index.ts` - Export new components and hooks
- Tests for `useNetworkFilter` hook
- Manual QA verification for UI functionality

### Definition of Done

- [ ] Network filter dropdown shows 3 options with dynamic counts
- [ ] Filter selection persists to localStorage across sessions
- [ ] DebugPanel display filters network logs based on selection
- [ ] Export operations (download/upload) respect filter setting
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Bundle size still < 20KB

### Must Have

- Filter options: All, Success only, Failed only
- Dynamic count display next to each option
- localStorage persistence with key `debug-panel-network-filter`
- Default value: 'all'
- Named export of new component and hook
- Component extraction maintains existing Radix UI styling

### Must NOT Have (Guardrails)

- Do NOT add new external dependencies (use existing Radix UI)
- Do NOT modify `useLogRecorder` interceptor logic
- Do NOT break existing copy format functionality
- Do NOT exceed 20KB bundle size
- Do NOT change existing localStorage keys (only add new one)
- Do NOT use global state (keep component-level hooks)

---

## Verification Strategy

### Test Decision

- **Infrastructure exists**: YES (vitest)
- **User wants tests**: YES (Tests after implementation)
- **Framework**: vitest
- **QA approach**: Tests after implementation + Manual verification for UI

### Tests After Implementation

**Task Structure**:

1. **Implement feature** first
2. **Add tests** for `useNetworkFilter` hook
3. **Manual QA** for UI using browser automation

**Test Setup** (already exists in project):

- Framework: vitest (in package.json)
- Test location: `src/hooks/__tests__/` or `src/__tests__/`
- Run command: `npm test`

### Manual QA Procedures

**For UI Changes (SettingsDropdownContent):**

- [ ] Using playwright browser automation:
  - Navigate to debug panel URL (or load example page)
  - Click settings gear icon to open dropdown
  - Verify network filter section displays with 3 options
  - Verify each option shows count (e.g., "All: 142", "Success: 137", "Failed: 5")
  - Click "Success only" - verify selection highlights
  - Click "Failed only" - verify selection highlights
  - Refresh page - verify filter selection persists
  - Click export option with different filters - verify exported content matches filter

**For Display Filtering (DebugPanel):**

- [ ] Using playwright browser automation:
  - Generate some network requests (success and failure)
  - Set filter to "Success only"
  - Verify only successful requests appear in log list
  - Set filter to "Failed only"
  - Verify only failed requests appear in log list
  - Set filter to "All"
  - Verify all requests appear

**For Export Filtering:**

- [ ] Using browser automation:
  - Generate network requests (mixed success/failure)
  - Set filter to "Success only"
  - Click export format (e.g., JSON)
  - Download exported file
  - Verify file contains only successful network requests
  - Repeat for "Failed only"
  - Verify file contains only failed network requests

**Evidence Required:**

- [ ] Screenshots of dropdown UI with each filter selected
- [ ] Screenshots of filtered log display
- [ ] Exported file content samples for each filter
- [ ] Console logs showing localStorage persistence

---

## Task Flow

```
Task 1: Create useNetworkFilter hook
  → Task 2: Create useNetworkFilter tests
      ↘ Task 3: Extract SettingsDropdownContent component
  → Task 4: Update DebugPanelHeader to use extracted component
      ↘ Task 5: Update src/index.ts exports
  → Task 6: Update DebugPanel to use network filter for display
      ↘ Task 7: Update export operations to respect filter (if needed)
  → Task 8: Run tests and linting
      ↘ Task 9: Manual QA verification
  → Task 10: Build and verify bundle size
```

## Parallelization

| Group | Tasks | Reason                                                  |
| ----- | ----- | ------------------------------------------------------- |
| A     | 2, 3  | Tests can be written while component extraction happens |

| Task | Depends On    | Reason                                                 |
| ---- | ------------- | ------------------------------------------------------ |
| 4    | 3             | Requires extracted component to import                 |
| 5    | 3, 4          | Requires both component and updated header             |
| 6    | 1             | Requires useNetworkFilter hook for state               |
| 7    | 6             | Requires display filtering logic to understand pattern |
| 8    | 1, 2, 3, 4, 5 | Requires all implementation done                       |
| 9    | 6, 7          | Requires filtering logic in place                      |
| 10   | 8             | Requires clean build                                   |

---

## TODOs

### Phase 1: Hook Implementation

- [ ] 1. Create `useNetworkFilter` hook

  **What to do**:
  - Create new file: `src/hooks/useNetworkFilter.ts`
  - Define type: `NetworkFilter = 'all' | 'success' | 'failed'`
  - Implement localStorage key: `debug-panel-network-filter`
  - State management following `useCopyFormat` pattern
  - Calculate and return counts: `allCount`, `successCount`, `failedCount`
  - Memoize count calculations for performance

  **Must NOT do**:
  - Do NOT use global state or Context
  - Do NOT modify existing localStorage keys
  - Do NOT add external dependencies

  **Parallelizable**: NO (foundation task)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `src/hooks/useCopyFormat.ts:1-31` - localStorage-based settings hook pattern (state initialization, useEffect for persistence, return value/setter)
  - `src/hooks/useCopyFormat.ts:14-22` - Default value pattern from localStorage with fallback
  - `src/hooks/useCopyFormat.ts:24-27` - localStorage sync in useEffect

  **Type References** (contracts to implement against):
  - `src/types/index.ts:92-99` - LogEntry union type (use for filtering logic)
  - `src/types/index.ts:36-46` - FetchResponseEntry and FetchErrorEntry (check status codes)
  - `src/types/index.ts:69-89` - XHRResponseEntry and XHRErrorEntry (check status codes)

  **Filtering Logic References** (from explore agent research):

  ```typescript
  // Success: FETCH_RES/XHR_RES with status 200-299
  const successfulRequests = logs.filter(
    (log) =>
      (log.type === 'FETCH_RES' || log.type === 'XHR_RES') && log.status >= 200 && log.status < 300
  );

  // Failed: FETCH_ERR/XHR_ERR OR status >= 400
  const failedRequests = logs.filter(
    (log) =>
      log.type === 'FETCH_ERR' ||
      log.type === 'XHR_ERR' ||
      ((log.type === 'FETCH_RES' || log.type === 'XHR_RES') && log.status >= 400)
  );
  ```

  **Test References** (testing patterns to follow):
  - Find existing vitest tests in `src/__tests__/` or `src/hooks/__tests__/`
  - Look for patterns testing React hooks with @testing-library/react

  **Documentation References** (specs and requirements):
  - `src/hooks/AGENTS.md` - Hook conventions and patterns
  - `AGENTS.md:CONVENTIONS` - Global interception patterns

  **External References** (libraries and frameworks):
  - React hooks official docs: https://react.dev/reference/react (useState, useEffect, useMemo)
  - localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

  **WHY Each Reference Matters** (explain the relevance):
  - `useCopyFormat.ts`: Shows exact pattern for localStorage-based settings hook - copy state initialization, persistence logic, and return value/setter structure
  - LogEntry types: Need to know exact structure to write correct filtering logic for success/failure status
  - Filtering logic: From explore agent - shows how to detect success (2xx) vs failure (4xx/5xx + error entries)
  - Hook conventions: Understand prefix naming, cleanup requirements, and state mutation rules

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test file created: `src/hooks/__tests__/useNetworkFilter.test.ts` (or similar location)
  - [ ] Test covers: state initialization, localStorage persistence, count calculations
  - [ ] `npm test` → PASS (all hook tests pass)

  **Manual Execution Verification (ALWAYS include, even with tests):**

  _For Hook Logic:_
  - [ ] REPL verification (or create test file):
    ```
    > import { useNetworkFilter } from './useNetworkFilter'
    > Test component using React Testing Library
    > Verify: Initial value loads from localStorage or defaults to 'all'
    > Verify: Setting filter saves to localStorage
    > Verify: Counts calculated correctly for sample log data
    ```

  **For localStorage Persistence:**
  - [ ] Verify: Set filter to 'success'
  - [ ] Check: localStorage contains `'debug-panel-network-filter' = 'success'`
  - [ ] Verify: Reload page - filter remains 'success'

  **For Count Calculations:**
  - [ ] Given sample logs (success, failed, console logs)
  - [ ] Verify: allCount = total network requests (success + failed)
  - [ ] Verify: successCount = count of 2xx responses
  - [ ] Verify: failedCount = count of error entries + 4xx/5xx responses

  **Evidence Required:**
  - [ ] Test output showing all tests pass
  - [ ] Console output showing localStorage key/value pairs
  - [ ] Screenshots or console logs verifying count calculations

  **Commit**: YES
  - Message: `feat(hooks): add useNetworkFilter hook for network request filtering`
  - Files: `src/hooks/useNetworkFilter.ts`, `src/hooks/__tests__/useNetworkFilter.test.ts`
  - Pre-commit: `npm test`

---

### Phase 2: Component Extraction

- [ ] 3. Extract `SettingsDropdownContent` to separate file

  **What to do**:
  - Create new file: `src/components/SettingsDropdownContent.tsx`
  - Extract component from `DebugPanelHeader.tsx` lines 77-145
  - Maintain all existing props: `copyFormat`, `setCopyFormat`, `onSaveToDirectory`, `onCloseDropdown`
  - Add new props for network filter: `networkFilter`, `setNetworkFilter`, counts
  - Add new UI section: "Network Filter" with dropdown options
  - Each option shows count: "All: {allCount}", "Success: {successCount}", "Failed: {failedCount}"
  - Maintain Radix UI styling consistency

  **Must NOT do**:
  - Do NOT break existing export format functionality
  - Do NOT change existing Radix UI dropdown structure
  - Do NOT add new external dependencies

  **Parallelizable**: YES (with 2)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `src/components/DebugPanelHeader.tsx:77-145` - Current SettingsDropdownContent implementation (copy entire structure)
  - `src/components/DebugPanelHeader.tsx:96-127` - Format options pattern (map over options, conditional styling for selected item)
  - `src/components/DebugPanelHeader.tsx:98-127` - Dropdown item button pattern (icon + label + checkmark)
  - `src/components/DebugPanelHeader.tsx:147-267` - DebugPanelHeader component (how to consume SettingsDropdownContent)

  **Style References** (styling patterns to follow):
  - `src/components/DebugPanel.styles.ts` - All dropdown styling classes
  - `src/components/DebugPanelHeader.tsx:4-19` - Import pattern for styles

  **Component Structure References** (React patterns):
  - `src/components/DebugPanelHeader.tsx:38-73` - SessionDetailsDropdownContent component (similar standalone component pattern in same file)
  - `src/components/DebugPanelHeader.tsx:77-145` - Current SettingsDropdownContent (what we're extracting)

  **External References** (libraries and frameworks):
  - Radix UI Dropdown Menu: https://www.radix-ui.com/primitives/docs/components/dropdown-menu
  - Radix UI styling patterns: https://www.radix-ui.com/primitives/docs/guides/styling
  - Lucide React icons: https://lucide.dev/docs (for filter section icons if needed)

  **WHY Each Reference Matters** (explain the relevance):
  - DebugPanelHeader.tsx:77-145: Exact code to extract - copy structure, props, and styling
  - Format options pattern (lines 96-127): Shows how to render selectable items with icons, conditional highlighting, and checkmarks - reuse this for filter options
  - SessionDetailsDropdownContent: Shows how inline components are structured in this file - maintain same pattern after extraction
  - DebugPanel.styles.ts: All CSS classes needed for dropdown items, sections, and dividers

  **Acceptance Criteria**:

  **Manual Execution Verification:**

  _For Component Extraction:_
  - [ ] Verify: Component renders without errors in example app
  - [ ] Verify: Existing "Export format" section works (JSON, ECS JSON, AI-TXT)
  - [ ] Verify: Existing "Actions" section works (Save to folder button)
  - [ ] Verify: New "Network Filter" section displays below divider

  _For Network Filter UI:_
  - [ ] Using playwright browser automation:
    - Navigate to debug panel with sample logs
    - Open settings dropdown
    - Verify: 3 filter options display: "All", "Success only", "Failed only"
    - Verify: Each option shows count (e.g., "All: 142", "Success: 137", "Failed: 5")
    - Verify: Current filter option is highlighted (background + checkmark)
    - Click "Success only" - verify: option highlights, dropdown closes
    - Click "Failed only" - verify: option highlights, dropdown closes
    - Click "All" - verify: option highlights, dropdown closes

  _For Styling:_
  - [ ] Verify: Dropdown items use correct spacing (gap: 2px)
  - [ ] Verify: Selected item has background: 'rgba(0, 0, 0, 0.06)' and color: 'rgba(0, 0, 0, 0.9)'
  - [ ] Verify: Checkmark (✓) appears next to selected option
  - [ ] Verify: Section headers use dropdownSectionStyles
  - [ ] Verify: Divider uses dropdownDividerStyles

  **Evidence Required:**
  - [ ] Screenshots of dropdown with "All" selected
  - [ ] Screenshots of dropdown with "Success only" selected
  - [ ] Screenshots of dropdown with "Failed only" selected
  - [ ] Screenshots showing dynamic counts changing based on log data

  **Commit**: YES (with 4)
  - Message: `refactor(components): extract SettingsDropdownContent to separate file`
  - Files: `src/components/SettingsDropdownContent.tsx`
  - Pre-commit: `npm run lint`

---

### Phase 3: Integration Updates

- [ ] 4. Update `DebugPanelHeader` to use extracted component

  **What to do**:
  - Import `SettingsDropdownContent` from new file
  - Remove inline `SettingsDropdownContent` function (lines 77-145)
  - Pass `networkFilter`, `setNetworkFilter`, `counts` props to extracted component
  - Import and use `useNetworkFilter` hook
  - Ensure no styling or functionality breaks

  **Must NOT do**:
  - Do NOT change any existing functionality beyond using extracted component
  - Do NOT modify existing dropdown triggers or Radix UI structure

  **Parallelizable**: NO (depends on 3)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `src/components/DebugPanelHeader.tsx:147-267` - DebugPanelHeader component structure (where to add useNetworkFilter)
  - `src/components/DebugPanelHeader.tsx:163` - Current pattern: `const { copyFormat, setCopyFormat } = useCopyFormat()` (add useNetworkFilter alongside)
  - `src/components/DebugPanelHeader.tsx:245-250` - Current SettingsDropdownContent usage (update to pass new props)

  **External References** (libraries and frameworks):
  - React hooks patterns: https://react.dev/reference/react (calling multiple hooks)

  **WHY Each Reference Matters** (explain the relevance):
  - DebugPanelHeader.tsx:147-267: Main component structure - need to add useNetworkFilter hook call alongside useCopyFormat
  - Line 163: Shows pattern for hook usage - add `const { networkFilter, setNetworkFilter, counts } = useNetworkFilter()`
  - Lines 245-250: Current component usage - update props to include networkFilter, setNetworkFilter, counts

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [ ] Verify: DebugPanelHeader renders without errors
  - [ ] Verify: Settings dropdown opens/closes correctly
  - [ ] Verify: Network filter section displays in dropdown
  - [ ] Verify: Export format section still works
  - [ ] Verify: Actions section still works
  - [ ] Verify: Filter selection persists (localStorage check)

  **Evidence Required:**
  - [ ] Screenshot of updated settings dropdown
  - [ ] Console output showing no errors
  - [ ] Browser devtools React component tree showing props passed correctly

  **Commit**: YES
  - Message: `refactor(components): update DebugPanelHeader to use extracted SettingsDropdownContent`
  - Files: `src/components/DebugPanelHeader.tsx`
  - Pre-commit: `npm run lint`

---

- [ ] 5. Update `src/index.ts` exports

  **What to do**:
  - Add named export: `export { SettingsDropdownContent } from './components/SettingsDropdownContent'`
  - Add named export: `export { useNetworkFilter } from './hooks/useNetworkFilter'`
  - Ensure no default exports (only named exports per project convention)
  - Verify export order/format consistency

  **Must NOT do**:
  - Do NOT add default exports
  - Do NOT export internal implementation details

  **Parallelizable**: NO (depends on 3, 4)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `src/index.ts` - Current export structure (all named exports)
  - Look for patterns like: `export { X } from './components/X'`

  **Documentation References** (specs and requirements):
  - `AGENTS.md:CONVENTIONS` - Named exports only requirement (tree-shaking)
  - Project README: "Zero runtime dependencies", "Bundle < 20KB" (export patterns affect tree-shaking)

  **WHY Each Reference Matters** (explain the relevance):
  - src/index.ts: Shows current export format - follow same pattern for new exports
  - Named exports only: Critical for tree-shaking - default exports prevent bundler from removing unused code

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: Can import from package root: `import { SettingsDropdownContent, useNetworkFilter } from '@zaob/glean-debug-logger'`
  - [ ] Test: TypeScript types resolve correctly
  - [ ] `npm run build` → Success (exports resolve correctly)

  **Manual Execution Verification:**
  - [ ] Build project: `npm run build`
  - [ ] Check dist/index.d.ts for new exports
  - [ ] Create test file: `import { SettingsDropdownContent, useNetworkFilter } from '../src/index'`
  - [ ] Run: `npm test` → PASS (no import errors)

  **Evidence Required:**
  - [ ] dist/index.d.ts content showing new exports
  - [ ] Build output showing successful compilation
  - [ ] Test output showing no import errors

  **Commit**: YES
  - Message: `feat(index): export SettingsDropdownContent and useNetworkFilter`
  - Files: `src/index.ts`
  - Pre-commit: `npm run build`

---

### Phase 4: Display Filtering

- [ ] 6. Update `DebugPanel` to use network filter for display

  **What to do**:
  - Import `useNetworkFilter` hook in `DebugPanel.tsx`
  - Use `networkFilter` value to filter logs displayed in the panel
  - Filter network logs based on selection ('all', 'success', 'failed')
  - Keep console logs always visible (filter only applies to network)
  - Update filtered logs count display (if any)

  **Must NOT do**:
  - Do NOT filter out console logs
  - Do NOT change how logs are captured
  - Do NOT affect export functionality directly (that's task 7)

  **Parallelizable**: NO (depends on 1)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - Find `DebugPanel.tsx` component structure
  - Look for how logs are currently rendered/filtered
  - Look for any existing filter logic (filter by log type, etc.)

  **Type References** (contracts to implement against):
  - `src/types/index.ts:92-99` - LogEntry union type (filter on type property)
  - `src/types/index.ts:18-89` - All log entry types (determine which are network)

  **Filtering Logic References** (from explore agent):

  ```typescript
  // Filter displayed logs based on networkFilter setting
  const displayedLogs = logs.filter((log) => {
    // Always show console logs
    if (log.type === 'CONSOLE') return true;

    // Apply network filter
    if (networkFilter === 'all') return true;
    if (networkFilter === 'success') {
      return (
        (log.type === 'FETCH_RES' || log.type === 'XHR_RES') &&
        log.status >= 200 &&
        log.status < 300
      );
    }
    if (networkFilter === 'failed') {
      return (
        log.type === 'FETCH_ERR' ||
        log.type === 'XHR_ERR' ||
        ((log.type === 'FETCH_RES' || log.type === 'XHR_RES') && log.status >= 400)
      );
    }
  });
  ```

  **Test References** (testing patterns to follow):
  - Look for existing DebugPanel tests in `src/components/__tests__/`
  - Study patterns for testing filtered data display

  **Documentation References** (specs and requirements):
  - `AGENTS.md` - Project conventions for filtering and state management
  - User requirement: "Filter Scope: Both display & exports"

  **WHY Each Reference Matters** (explain the relevance):
  - LogEntry types: Need to check log.type to identify network vs console logs
  - Filtering logic: From explore agent - shows exact conditions for success/failure detection
  - DebugPanel structure: Need to find where logs are mapped/rendered to insert filter logic

  **Acceptance Criteria**:

  **Manual Execution Verification:**

  _For Display Filtering:_
  - [ ] Using playwright browser automation:
    - Generate mixed logs (console.log, successful fetch, failed fetch)
    - Open debug panel
    - Verify: All logs display initially (networkFilter = 'all')
    - Change network filter to "Success only"
    - Verify: Only successful network requests display (console logs still visible)
    - Change network filter to "Failed only"
    - Verify: Only failed network requests display (console logs still visible)
    - Change network filter back to "All"
    - Verify: All logs display again

  _For Count Display:_
  - [ ] Verify: Log count updates based on filter
  - [ ] Verify: Console logs count remains unchanged (not affected by network filter)

  _For Console Logs:_
  - [ ] Verify: Console logs always visible regardless of network filter
  - [ ] Generate only console.log entries - verify they display with all filter settings

  **Evidence Required:**
  - [ ] Screenshots of DebugPanel with each filter setting
  - [ ] Screenshots showing console logs always visible
  - [ ] Console output showing filtered log array
  - [ ] Counters showing correct numbers

  **Commit**: YES
  - Message: `feat(components): apply network filter to DebugPanel display`
  - Files: `src/components/DebugPanel.tsx`
  - Pre-commit: `npm run lint`

---

### Phase 5: Export Filtering

- [ ] 7. Update export operations to respect network filter (if needed)

  **What to do**:
  - Investigate `useLogRecorder` export functions: `downloadLogs`, `uploadLogs`
  - Determine if filter state needs to be passed to these functions
  - If export functions accept filter parameters: Update DebugPanel to pass networkFilter value
  - If export functions don't support filtering: Document this limitation or extend if necessary
  - Ensure exported logs match displayed logs (same filter applied)

  **Must NOT do**:
  - Do NOT modify interceptor logic in useLogRecorder
  - Do NOT change export format logic
  - Do NOT break existing export functionality

  **Parallelizable**: NO (depends on 6)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `src/hooks/useLogRecorder/index.ts` - Main hook with export functions
  - Look for `downloadLogs` function signature and implementation
  - Look for `uploadLogs` function signature and implementation
  - Check if these functions accept filter parameters or operate on all logs

  **Type References** (contracts to implement against):
  - `src/types/index.ts:147-163` - UseLogRecorderReturn interface (downloadLogs, uploadLogs signatures)
  - `src/types/index.ts:147-152` - downloadLogs function signature (check for format/options params)

  **Documentation References** (specs and requirements):
  - User requirement: "Filter Scope: Both display & exports"
  - API docs (if exist): Check export function capabilities

  **External References** (libraries and frameworks):
  - Project documentation on download/upload: Check current behavior

  **WHY Each Reference Matters** (explain the relevance):
  - useLogRecorder export functions: Need to understand current implementation to determine if filter support exists or needs to be added
  - Type signatures: Show if filter parameter is already supported or if we need to extend the interface

  **Acceptance Criteria**:

  **Manual Execution Verification:**

  _For Export Filtering:_
  - [ ] Using playwright browser automation:
    - Generate mixed logs (10 success, 5 failed, 3 console)
    - Set network filter to "Success only"
    - Click export (e.g., JSON format)
    - Download exported file
    - Verify: File contains only 10 successful network requests (no failed, no console)
    - Set network filter to "Failed only"
    - Export again
    - Verify: File contains only 5 failed network requests
    - Set network filter to "All"
    - Export again
    - Verify: File contains all 15 network requests + 3 console logs

  _For Upload Filtering:_
  - [ ] If upload functionality exists:
    - Set network filter
    - Trigger upload
    - Verify: Server receives filtered logs (check network tab for payload)

  **Evidence Required:**
  - [ ] Downloaded file contents (JSON) for each filter setting
  - [ ] Network tab screenshot showing upload payload
  - [ ] Console logs showing filtered data being exported

  **Commit**: YES (if changes needed) | NO (if export already supports filtering)
  - Message: `feat(hooks): add network filter support to export operations`
  - Files: `src/hooks/useLogRecorder/index.ts`
  - Pre-commit: `npm test`

---

### Phase 6: Testing & Verification

- [ ] 8. Run tests and linting

  **What to do**:
  - Run: `npm test` → Ensure all tests pass
  - Run: `npm run lint` → Ensure no linting errors
  - Fix any failing tests or linting issues
  - Run: `npm run format` → Ensure code formatting (optional but good practice)

  **Must NOT do**:
  - Do NOT skip linting or tests
  - Do NOT suppress warnings without justification

  **Parallelizable**: NO (depends on 1, 2, 3, 4, 5, 6, 7)

  **References** (CRITICAL - Be Exhaustive):

  **Test References** (testing patterns to follow):
  - `package.json:70` - Test script: `"test": "vitest"`
  - `package.json:71` - Lint script: `"lint": "eslint src --ext .ts,.tsx"`
  - Find existing test patterns in `src/__tests__/`

  **Documentation References** (specs and requirements):
  - Project README: Build/test/lint scripts
  - Development guide (if exists): Test and lint conventions

  **External References** (libraries and frameworks):
  - Vitest documentation: https://vitest.dev/
  - ESLint documentation: https://eslint.org/docs/latest/

  **WHY Each Reference Matters** (explain the relevance):
  - Test and lint scripts: Know exact commands to run and what constitutes success/failure
  - Existing test patterns: Follow same patterns for new tests (describe, it/expect structure)

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [ ] Run: `npm test`
  - [ ] Verify: All tests pass (e.g., "Test Files 3 passed")
  - [ ] Run: `npm run lint`
  - [ ] Verify: No linting errors
  - [ ] If errors exist: Fix and re-run until clean

  **Evidence Required:**
  - [ ] Terminal output of `npm test` showing all tests pass
  - [ ] Terminal output of `npm run lint` showing no errors

  **Commit**: YES (only if fixes needed)
  - Message: `test: fix failing tests and linting issues`
  - Files: Any files with test/lint fixes
  - Pre-commit: `npm test && npm run lint`

---

- [ ] 9. Manual QA verification

  **What to do**:
  - Run comprehensive manual QA following procedures in tasks 1-7
  - Test all filter combinations (all, success, failed)
  - Test persistence across page refreshes
  - Test export filtering for all options
  - Test UI responsiveness and accessibility
  - Document any edge cases or issues found

  **Must NOT do**:
  - Do NOT skip manual verification
  - Do NOT assume automated tests catch all UI issues

  **Parallelizable**: NO (depends on 6, 7)

  **References** (CRITICAL - Be Exhaustive):

  **QA References** (verification procedures from tasks):
  - Task 1: Hook manual verification procedures
  - Task 3: Component UI verification procedures
  - Task 6: Display filtering verification procedures
  - Task 7: Export filtering verification procedures

  **External References** (libraries and frameworks):
  - Playwright documentation: https://playwright.dev/
  - React Testing Library: https://testing-library.com/docs/react-testing-library/intro

  **WHY Each Reference Matters** (explain the relevance):
  - Previous task verification procedures: Need to systematically go through each and verify all acceptance criteria
  - Browser automation: Use Playwright for consistent UI testing

  **Acceptance Criteria**:

  **Manual Execution Verification:**

  _Comprehensive QA Checklist:_
  - [ ] Settings dropdown opens and displays correctly
  - [ ] Network filter section shows 3 options with dynamic counts
  - [ ] Selecting filter highlights option and closes dropdown
  - [ ] Filter selection persists to localStorage
  - [ ] Refreshing page preserves filter selection
  - [ ] DebugPanel display updates to match filter
  - [ ] Console logs always visible regardless of filter
  - [ ] Exported content matches displayed logs
  - [ ] No console errors or warnings
  - [ ] UI styling consistent with existing design
  - [ ] Bundle size still < 20KB

  **Evidence Required:**
  - [ ] Screenshot album showing all UI states (each filter selection)
  - [ ] Video or screenshots of filtering in action
  - [ ] Exported file samples for each filter
  - [ ] localStorage inspection showing persistence
  - [ ] Bundle size output: `npm run build` → Check dist file sizes

  **Commit**: NO (QA task, no code changes)
  - If bugs found: Create new task/plan for fixes

---

- [ ] 10. Build and verify bundle size

  **What to do**:
  - Run: `npm run build` → Generate dist/ folder
  - Check bundle sizes in dist/ folder
  - Verify: Bundle < 20KB (project constraint)
  - If bundle exceeds limit: Investigate and optimize

  **Must NOT do**:
  - Do NOT skip bundle size verification
  - Do NOT proceed if bundle exceeds limit

  **Parallelizable**: NO (depends on 8)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `package.json:69` - Build script: `"build": "tsup"`
  - `tsup.config.ts` (if exists) - Bundle configuration
  - Project README: "Bundle < 20KB" constraint

  **Documentation References** (specs and requirements):
  - README.md: "minzipped" badge and bundle size requirement
  - Development guide: Build process and bundle optimization

  **External References** (libraries and frameworks):
  - tsup documentation: https://tsup.egoist.dev/
  - Bundlephobia: https://bundlephobia.com/result?p=@zaob/glean-debug-logger

  **WHY Each Reference Matters** (explain the relevance):
  - Build script: Know exact command to run and where output goes
  - Bundle constraint: This is a hard requirement - cannot proceed if exceeded
  - tsup config: May need to adjust if bundle too large

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [ ] Run: `npm run build`
  - [ ] Check: dist/ folder created
  - [ ] Check: dist/index.mjs size < 20KB
  - [ ] Check: dist/index.js size < 20KB
  - [ ] If bundle > 20KB: Investigate and fix

  **Evidence Required:**
  - [ ] Terminal output showing successful build
  - [ ] File size output: `ls -lh dist/`
  - [ ] If optimization needed: Diff showing what was removed

  **Commit**: YES (only if optimization needed)
  - Message: `perf: optimize bundle size to meet 20KB constraint`
  - Files: Build configuration or optimized code
  - Pre-commit: `npm run build`

---

## Commit Strategy

| Phase | After Task                                                                 | Message                        | Files                    | Verification |
| ----- | -------------------------------------------------------------------------- | ------------------------------ | ------------------------ | ------------ |
| 1     | `feat(hooks): add useNetworkFilter hook`                                   | useNetworkFilter.ts, test file | npm test                 |
| 2-3   | `refactor(components): extract SettingsDropdownContent`                    | SettingsDropdownContent.tsx    | npm run lint             |
| 4     | `refactor(components): update DebugPanelHeader to use extracted component` | DebugPanelHeader.tsx           | npm run lint             |
| 5     | `feat(index): export SettingsDropdownContent and useNetworkFilter`         | src/index.ts                   | npm run build            |
| 6     | `feat(components): apply network filter to DebugPanel display`             | DebugPanel.tsx                 | npm test                 |
| 7     | `feat(hooks): add network filter support to export operations`             | useLogRecorder/index.ts        | npm test                 |
| 8     | `test: fix failing tests and linting issues`                               | Various                        | npm test && npm run lint |
| 9     | (QA task - no commit if clean)                                             | -                              | Manual verification      |
| 10    | (build verification - only commit if optimization needed)                  | Build config                   | npm run build            |

---

## Success Criteria

### Verification Commands

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Build project
npm run build

# Check bundle sizes
ls -lh dist/
```

### Final Checklist

- [ ] Network filter dropdown shows 3 options with dynamic counts
- [ ] Filter selection persists to localStorage across sessions
- [ ] DebugPanel display filters network logs based on selection
- [ ] Export operations respect filter setting
- [ ] Console logs always visible regardless of network filter
- [ ] All tests pass
- [ ] No linting errors
- [ ] Bundle size < 20KB
- [ ] Named exports only (no default exports)
- [ ] No external dependencies added
- [ ] Existing functionality not broken (copy format, save to folder, etc.)
