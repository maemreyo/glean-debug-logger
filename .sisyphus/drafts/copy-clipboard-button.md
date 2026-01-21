# Draft: Add Copy-to-Clipboard Button to DebugPanel

## Requirements (confirmed)

- User wants to add a "Copy" button to DebugPanel that copies logs directly to clipboard
- Currently, users must download logs (JSON/TXT) to get the content
- The new button should provide a faster way to copy logs for sharing
- Must follow existing panel style (neutral palette, consistent with download buttons)

## Technical Decisions

- **Content generation**: Since downloadLogs() only returns filename, not content, I'll replicate the logic:
  - JSON format: `JSON.stringify({ metadata: getMetadata(), logs: getLogs() }, null, 2)`
  - This is the same format used in downloadLogs
- **Clipboard API**: Use `navigator.clipboard.writeText()` for copying
- **UI placement**: Add as a 4th button in the existing button row (after JSON, TXT, Folder)
- **Styling**: Use same neutral palette as downloadButtonStyles (light gray background)

## Research Findings

- **useLogRecorder API**:
  - `getLogs()`: Returns `LogEntry[]` - raw log data
  - `getMetadata()`: Returns `LogMetadata` - session info
  - `downloadLogs()`: Only returns filename, not content
- **Test infrastructure exists**:
  - Framework: Vitest + @testing-library/react
  - Test command: `npm run test`
  - Existing tests: useDebugPanelControls.test.ts (good reference)

## Open Questions

- None - all requirements clear from user's request

## Scope Boundaries

- **INCLUDE**:
  - Add copyToClipboard function in DebugPanel.tsx
  - Add copy button to the button row (3rd group of buttons)
  - Add copyButtonStyles in DebugPanel.styles.ts
  - Add success/error feedback message for copy operation
  - Add unit tests for copy functionality
- **EXCLUDE**:
  - Don't modify useLogRecorder hook
  - Don't add new files outside src/components/
  - Don't change existing download functionality
