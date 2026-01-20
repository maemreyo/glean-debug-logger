# Learnings - Custom Download Directory Feature

## Task 3: Add enableDirectoryPicker to DEFAULT_CONFIG

### Implementation Details
- Added `enableDirectoryPicker: false` to DEFAULT_CONFIG in `src/hooks/useLogRecorder.ts` (line 22)
- Placed after `captureXHR` to maintain logical grouping of boolean options
- Added documentation comment: `// Enable directory picker for downloads (Chrome 86+, Edge 86+ only)`

### Expected TypeScript Error
Type error occurs because type definition (Task 1) is added in parallel:
```
error TS2353: Object literal may only specify known properties, and 'enableDirectoryPicker' does not exist in type 'LogRecorderConfig'.
```
This is expected and will resolve once type definitions are merged.

### Pattern Observed
Boolean options in DEFAULT_CONFIG are grouped together:
- enablePersistence (line 17)
- captureConsole (line 19)
- captureFetch (line 20)
- captureXHR (line 21)
- enableDirectoryPicker (line 22) ← newly added

### Configuration Location
DEFAULT_CONFIG spans lines 15-32 in `src/hooks/useLogRecorder.ts`
