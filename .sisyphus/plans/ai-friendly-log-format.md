# Strategic Plan: AI-Friendly Log Format Improvements

## Overview

This plan outlines comprehensive improvements to make the debug logger's output more AI-agent friendly while maintaining backward compatibility with existing features. All 6 requested improvements will be implemented as **new export formats** alongside existing JSON/TXT formats.

## Current Architecture Analysis

### Key Files Involved

| File                                     | Purpose                | Key Functions                                                     |
| ---------------------------------------- | ---------------------- | ----------------------------------------------------------------- |
| `src/hooks/useLogRecorder.ts`            | Core logging logic     | `downloadLogs()` (lines 348-383), `safeStringify()` (lines 72-81) |
| `src/services/FileService.ts`            | Download handling      | `downloadWithFallback()`, `download()`                            |
| `src/types/index.ts`                     | Type definitions       | `LogEntry`, `LogMetadata`, `LogType` unions                       |
| `src/utils/sanitize.ts`                  | Data sanitization      | `sanitizeData()`                                                  |
| `src/interceptors/NetworkInterceptor.ts` | Fetch/XHR interception | Request/response tracking                                         |

### Current Export Flow

```
downloadLogs(format) → safeStringify(content) → FileService.downloadWithFallback(content, filename, mimeType)
```

**Current Formats:**

- `'json'`: Pretty-printed `{metadata, logs[]}` object
- `'txt'`: Header + `[timestamp] TYPE\n{JSON}\n===` pattern

---

## Strategic Recommendations

### Stack Trace Filtering Approach

**Recommendation:** Filter by `ignored: true` flag + limit to top 20 frames per request

**Rationale:**

- Current stack traces have 100+ frames (mostly React/Next.js internals)
- AI agents need relevant app code, not framework internals
- `ignored: true` flag already exists in stack frame objects
- Preserves full trace in `event.original` for deep debugging

### Correlation ID Improvements

**Recommendation:** Use UUID v4 + store in both request and response

**Current Issue:**

- Random 7-char ID: `Math.random().toString(36).substring(7)`
- URL-based matching (race conditions possible)

**Proposed Solution:**

- Generate UUID at request time
- Store in `requestIdMap` with request details
- Pass to response/error handlers via closure
- AI can easily match pairs by `event.id`

### Semantic Prefixes Strategy

**Proposed ECS-compliant field mappings:**

| Current Field      | ECS Field         | Semantic Prefix                  |
| ------------------ | ----------------- | -------------------------------- |
| CONSOLE logs       | `message`         | `console.*` (via event.category) |
| FETCH_REQ          | `http.request.*`  | `req.*` (alias)                  |
| FETCH_RES          | `http.response.*` | `res.*` (alias)                  |
| FETCH_ERR/XHR_ERR  | `error.*`         | `err.*` (alias)                  |
| Performance timing | `event.duration`  | `perf.*` (via event.duration_ms) |

**Implementation:** Add convenience aliases that map to ECS fields

---

## New Export Formats Design

### 1. JSONL Format (AI-Optimized)

**Filename extension:** `.jsonl`
**MIME type:** `application/x-ndjson`

**Structure:**

```
{"@timestamp":"...","log.level":"INFO","message":"...","ecs.version":"1.12.0",...}
{"@timestamp":"...","log.level":"ERROR","error.message":"...","event.category":["network","web"],...}
```

**Benefits:**

- Streaming parsing (process line-by-line)
- Memory efficient (no full file parse)
- Easy to append new entries
- Perfect for batch AI processing

### 2. ECS-Compliant JSON (Human + AI)

**Filename extension:** `.ecs.json`
**MIME type:** `application/json`

**Structure:**

```json
{
  "metadata": {
    "ecs.version": "1.12.0",
    "service.name": "my-app",
    "service.environment": "production",
    ...
  },
  "logs": [
    {
      "@timestamp": "...",
      "log.level": "INFO",
      "event.category": ["console"],
      "message": "...",
      "event.original": {...}  // Original log entry preserved
    }
  ]
}
```

**Benefits:**

- Full ECS compliance
- Preserves original data in `event.original`
- Compatible with Elastic Stack
- Human readable with indentation

### 3. AI-Optimized TXT (Readable + Structured)

**Filename extension:** `.ai.txt`
**MIME type:** `text/plain`

**Structure:**

```
# METADATA
ecs.version=1.12.0
service.name=my-app
service.environment=production
user.id=guest
timestamp=2026-01-20T10:07:31.033Z

# LOGS
[2026-01-20T10:07:14.129Z] INFO console | message="Form completed"
[2026-01-20T10:07:20.392Z] WARN console | message="Missing security headers"
[2026-01-20T10:07:22.619Z] ERROR console | error.message="Token refresh failed"
[2026-01-20T10:07:22.631Z] INFO network | req.method=POST req.url=/api/leads method=/__nextjs_original-stack-frames res.status=200 duration=285ms
```

**Benefits:**

- Line-oriented (AI can split by `\n`)
- Key-value pairs (easy regex extraction)
- Human readable
- Preserves structure without full JSON parse

---

## Implementation Tasks

### Phase 1: Core Infrastructure (Tasks 1-3)

| Task | Description                             | Files Modified                    |
| ---- | --------------------------------------- | --------------------------------- |
| 1    | Add ECS transformation utility function | `src/utils/ecsTransform.ts` (new) |
| 2    | Add JSONL stringify utility             | `src/utils/jsonl.ts` (new)        |
| 3    | Update downloadLogs type definition     | `src/types/index.ts`              |

### Phase 2: ECS Transformation (Tasks 4-6)

| Task | Description                        | Files Modified              |
| ---- | ---------------------------------- | --------------------------- |
| 4    | Transform LogEntry → ECS document  | `src/utils/ecsTransform.ts` |
| 5    | Transform LogMetadata → ECS fields | `src/utils/ecsTransform.ts` |
| 6    | Handle stack trace filtering       | `src/utils/ecsTransform.ts` |

### Phase 3: New Export Formats (Tasks 7-9)

| Task | Description                           | Files Modified                |
| ---- | ------------------------------------- | ----------------------------- |
| 7    | Add 'jsonl' format to downloadLogs    | `src/hooks/useLogRecorder.ts` |
| 8    | Add 'ecs.json' format to downloadLogs | `src/hooks/useLogRecorder.ts` |
| 9    | Add 'ai.txt' format to downloadLogs   | `src/hooks/useLogRecorder.ts` |

### Phase 4: UI Updates (Tasks 10-11)

| Task | Description                          | Files Modified                        |
| ---- | ------------------------------------ | ------------------------------------- |
| 10   | Add new format buttons to DebugPanel | `src/components/DebugPanel.tsx`       |
| 11   | Add new format styles                | `src/components/DebugPanel.styles.ts` |

### Phase 5: Testing & Documentation (Tasks 12-14)

| Task | Description                           | Files Modified                                   |
| ---- | ------------------------------------- | ------------------------------------------------ |
| 12   | Add unit tests for ECS transformation | `src/utils/__tests__/ecsTransform.test.ts` (new) |
| 13   | Add unit tests for JSONL formatting   | `src/utils/__tests__/jsonl.test.ts` (new)        |
| 14   | Update documentation                  | `docs/log-formats.md` (new)                      |

---

## Detailed Task Breakdown

### Task 1: Create ECS Transformation Utility

**File:** `src/utils/ecsTransform.ts`

**Function signature:**

```typescript
export function transformToECS(
  log: LogEntry,
  metadata: LogMetadata,
  options?: ECSTransformOptions
): ECSDocument;
```

**ECS Document structure:**

```typescript
interface ECSDocument {
  '@timestamp': string;
  'ecs.version': '1.12.0';
  'log.level': string;
  'event.category': string[];
  'event.type': string[];
  'event.action': string;
  'event.id': string;
  'event.original': object; // Original log entry
  'event.duration'?: number; // Nanoseconds
  message?: string;
  error?: {
    message: string;
    type: string;
    stack_trace?: string;
  };
  http?: {
    request?: {
      method: string;
      body?: { content: string };
      headers?: Record<string, unknown>;
    };
    response?: {
      status_code: number;
      body?: { content: unknown };
    };
  };
  url?: {
    full: string;
    path?: string;
    domain?: string;
  };
  service?: {
    name: string;
    environment: string;
  };
  user?: {
    id: string;
  };
  host?: {
    name: string;
    type: string;
  };
}
```

---

### Task 2: Create JSONL Utility

**File:** `src/utils/jsonl.ts`

**Functions:**

```typescript
// Stringify array of objects to JSONL
export function stringifyJSONL(items: object[]): string;

// Stringify single object (adds newline)
export function stringifyJSONLItem(item: object): string;

// Parse JSONL string to array (streaming capable)
export function parseJSONL(input: string): object[];

// Parse JSONL stream (line by line)
export function parseJSONLStream(
  input: string,
  callback: (item: object, index: number) => void
): void;
```

---

### Task 3: Update Type Definitions

**File:** `src/types/index.ts`

**Add new format types:**

```typescript
export type ExportFormat = 'json' | 'txt' | 'jsonl' | 'ecs.json' | 'ai.txt';

// Update downloadLogs signature
downloadLogs: (format?: ExportFormat, customFilename?: string | null, options?: DownloadOptions) =>
  string | null;
```

---

### Task 4: LogEntry → ECS Transformation

**Key mappings:**

| Log Type  | ECS Fields                                                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CONSOLE   | `@timestamp`, `log.level`, `message`, `event.category: ["console"]`, `event.type: [level]`, `event.action`                                                             |
| FETCH_REQ | `@timestamp`, `http.request.method`, `http.request.body.content`, `url.full`, `event.category: ["network","web"]`, `event.action: "request"`                           |
| FETCH_RES | `@timestamp`, `http.response.status_code`, `http.response.body.content`, `url.full`, `event.duration`, `event.category: ["network","web"]`, `event.action: "response"` |
| FETCH_ERR | `@timestamp`, `error.message`, `url.full`, `event.category: ["network","web"]`, `event.action: "error"`                                                                |

---

### Task 5: Stack Trace Filtering

**Implementation:**

```typescript
function filterStackTrace(frames: StackFrame[]): StackFrame[] {
  // Filter out ignored frames
  const relevant = frames.filter((frame) => !frame.ignored);

  // Limit to top 20 for AI readability
  return relevant.slice(0, 20);
}

// Usage in ECS transformation
if (log.body?.frames) {
  ecsDoc.error = {
    message: log.data || log.error,
    type: determineErrorType(log.data),
    stack_trace: filterStackTrace(log.body.frames)
      .map((f) => `${f.file}:${f.line1}:${f.column1} ${f.methodName}`)
      .join('\n'),
  };
}
```

---

### Task 7-9: New Export Format Handlers

**In `downloadLogs()` function:**

```typescript
const downloadLogs = useCallback((
  format: ExportFormat = 'json',
  customFilename?: string | null
): string | null => {
  // ... existing setup ...

  let content: string;
  let mimeType: string;
  let ext: string;

  switch (format) {
    case 'json':
      // Existing JSON format
      break;
    case 'txt':
      // Existing TXT format
      break;
    case 'jsonl':
      // New JSONL format
      content = generateJSONL(metadata, logs, options);
      mimeType = 'application/x-ndjson';
      ext = 'jsonl';
      break;
    case 'ecs.json':
      // New ECS-compliant JSON format
      content = generateECSJSON(metadata, logs, options);
      mimeType = 'application/json';
      ext = 'ecs.json';
      break;
    case 'ai.txt':
      // New AI-optimized TXT format
      content = generateAITXT(metadata, logs, options);
      mimeType = 'text/plain';
      ext = 'ai.txt';
      break;
  }

  // ... existing download ...
}, [...]);
```

---

### Task 10: DebugPanel UI Updates

**Add format selector or additional buttons:**

```
Current: [JSON] [TXT] [Folder]
Proposed: [JSON] [TXT] [JSONL] [ECS] [AI-TXT]
```

Or add format dropdown:

```
Export Format: ▼
  ○ JSON (Original)
  ○ TXT (Text)
  ○ JSONL (AI-Optimized)
  ○ ECS JSON (Standard)
  ○ AI-TXT (Readable)
```

---

## Dependencies & External Libraries

**No new external libraries required:**

| Need            | Solution                                                               |
| --------------- | ---------------------------------------------------------------------- |
| UUID generation | Use `crypto.randomUUID()` (browser native) or `Math.random()` fallback |
| JSONL parsing   | Native `JSON.parse()` per line                                         |
| ECS compliance  | Custom transformation (no library needed)                              |
| URL parsing     | Native `new URL()` constructor                                         |

---

## Backward Compatibility

**All changes are additive:**

- ✅ Existing `'json'` format unchanged
- ✅ Existing `'txt'` format unchanged
- ✅ Type definitions updated (not replaced)
- ✅ UI adds new options (doesn't remove existing)
- ✅ Original log data preserved in `event.original` field

---

## Testing Strategy

### Unit Tests Required

| Test                  | Description                                    |
| --------------------- | ---------------------------------------------- |
| ECS transform         | Verify all log types map to correct ECS fields |
| JSONL parse/stringify | Round-trip consistency                         |
| Stack trace filtering | Verify `ignored` filtering and limit           |
| Correlation ID        | Verify request/response linking                |
| Export formats        | Verify all formats produce valid output        |

### Manual Testing

1. Generate logs with various types (console, fetch, xhr, errors)
2. Export in all 5 formats
3. Verify AI can parse each format
4. Verify human readability
5. Verify stack trace filtering works

---

## Estimated Effort

| Phase                   | Tasks  | Estimated Time  |
| ----------------------- | ------ | --------------- |
| Phase 1: Infrastructure | 3      | 2-3 hours       |
| Phase 2: ECS Transform  | 3      | 3-4 hours       |
| Phase 3: New Formats    | 3      | 2-3 hours       |
| Phase 4: UI Updates     | 2      | 1-2 hours       |
| Phase 5: Testing        | 3      | 2-3 hours       |
| **Total**               | **14** | **10-15 hours** |

---

## Files to Create/Modify

### New Files

| File                                       | Purpose                      |
| ------------------------------------------ | ---------------------------- |
| `src/utils/ecsTransform.ts`                | ECS transformation utilities |
| `src/utils/jsonl.ts`                       | JSONL parsing/stringifying   |
| `src/utils/__tests__/ecsTransform.test.ts` | ECS transform tests          |
| `src/utils/__tests__/jsonl.test.ts`        | JSONL tests                  |
| `docs/log-formats.md`                      | Format documentation         |

### Modified Files

| File                                  | Changes                                              |
| ------------------------------------- | ---------------------------------------------------- |
| `src/types/index.ts`                  | Add ExportFormat type, update downloadLogs signature |
| `src/hooks/useLogRecorder.ts`         | Add new format handlers                              |
| `src/components/DebugPanel.tsx`       | Add new format buttons/dropdown                      |
| `src/components/DebugPanel.styles.ts` | Add new button styles                                |

---

## Success Criteria

### Functional

- [ ] All 5 export formats work correctly
- [ ] ECS compliance verified (matches ECS 1.12.0 spec)
- [ ] JSONL can be parsed line-by-line
- [ ] Stack traces filtered (max 20 relevant frames)
- [ ] Correlation IDs link request/response pairs

### Non-Functional

- [ ] Build succeeds (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] All tests pass (`npm run test`)
- [ ] No new external dependencies added
- [ ] Backward compatibility maintained

---

## Next Steps

1. **Approve this strategic plan**
2. **Create detailed work plan** (subtasks, acceptance criteria)
3. **Begin Phase 1 implementation**
