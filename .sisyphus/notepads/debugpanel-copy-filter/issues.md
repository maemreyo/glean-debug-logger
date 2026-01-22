# DebugPanel Copy Filter - Issues & Gotchas

## Known Issues

### Pre-existing (not caused by this task)

1. **LSP errors in DebugPanel.tsx** (lines 525, 537, 549)
   - Elements with role can be changed to different elements
   - These are existing issues, not introduced by copy filter changes

2. **LSP errors in useLogRecorder.ts** (multiple)
   - Config changes on every re-render
   - Hook dependency issues
   - Pre-existing issues in the codebase

## Gotchas to Avoid

1. **Don't modify getLogs() or useLogRecorder exports**
   - The plan explicitly says NOT to change the useLogRecorder API
   - Filter logic should be client-side in DebugPanel.tsx

2. **Don't add localStorage persistence for filter selection**
   - Filter is session-scoped only
   - Different from copyFormat which persists

3. **Don't change download or upload functionality**
   - These should remain unchanged
   - Only copy functionality is being modified

4. **Don't add filter combinations (e.g., "logs + errors")**
   - Plan explicitly forbids this
   - Keep it simple: all, logs, errors, network, networkErrors

## Technical Gotchas

1. **Filter counting**: Need to count matches before filtering to show correct counts
2. **Disabled states**: Buttons need to check if matching entries exist
3. **Empty results**: Handle gracefully with appropriate status message
4. **Type safety**: Use proper TypeScript types for filter values

## Scope Boundaries

### IN scope:

- Copy filter state and helper functions
- handleCopyFiltered function
- Filter button UI components
- Status message updates
- Manual verification

### OUT of scope:

- Download filter functionality
- Upload filter functionality
- New keyboard shortcuts
- localStorage persistence for filter
- Filter combinations/presets
