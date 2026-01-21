# Log Export Formats

The debug logger supports 5 export formats, each optimized for different use cases.

## Overview

| Format | File Extension | MIME Type | Best For |
|--------|---------------|-----------|----------|
| JSON | `.json` | `application/json` | Original format, human readable |
| TXT | `.txt` | `text/plain` | Simple text export |
| JSONL | `.jsonl` | `application/x-ndjson` | AI agents, streaming, batch processing |
| ECS JSON | `.ecs.json` | `application/json` | Enterprise tools, Elastic Stack |
| AI-TXT | `.ai.txt` | `text/plain` | Human debugging with structured data |

## JSON Format

**File Extension:** `.json`
**MIME Type:** `application/json`

Original format with full structure.

```json
{
  "metadata": {
    "sessionId": "abc123",
    "userId": "guest",
    "environment": "development",
    ...
  },
  "logs": [
    {
      "type": "CONSOLE",
      "level": "log",
      "time": "2026-01-20T10:07:14.129Z",
      "data": "Form completed",
      ...
    }
  ]
}
```

## TXT Format

**File Extension:** `.txt`
**MIME Type:** `text/plain`

Simple text format with embedded JSON.

```
# Debug Logger Export
# Generated: 2026-01-20T10:07:31.033Z
# Session: abc123

[2026-01-20T10:07:14.129Z] CONSOLE
{"type":"CONSOLE","level":"DEBUG","time":"...","data":"..."}

[2026-01-20T10:07:22.619Z] CONSOLE ERROR
{"type":"CONSOLE","level":"ERROR","time":"...","error":"..."}
```

## JSONL Format (AI-Optimized)

**File Extension:** `.jsonl`
**MIME Type:** `application/x-ndjson`

Line-delimited JSON, one JSON object per line. Optimized for AI agents.

```jsonl
{"@timestamp":"2026-01-20T10:07:14.129Z","log.level":"info","event.category":["console"],"message":"Form completed","event.id":"log-1"}
{"@timestamp":"2026-01-20T10:07:22.619Z","log.level":"error","event.category":["console"],"error":{"message":"Token refresh failed"},"event.id":"log-2"}
{"@timestamp":"2026-01-20T10:07:25.000Z","log.level":"info","event.category":["network","web"],"event.action":"request","http.request.method":"POST","url.full":"https://api.example.com/leads","event.id":"req-1"}
{"@timestamp":"2026-01-20T10:07:25.285Z","log.level":"info","event.category":["network","web"],"event.action":"response","http.response.status_code":200,"event.duration":285000000,"event.id":"req-1"}
```

### Benefits for AI Agents
- Process one record at a time (streaming)
- Memory efficient for large logs
- Easy to parallelize
- No parsing of full file needed

## ECS JSON Format

**File Extension:** `.ecs.json`
**MIME Type:** `application/json`

Elastic Common Schema (ECS) 1.12.0 compliant format.

```json
{
  "metadata": {
    "ecs.version": "1.12.0",
    "service.environment": "production",
    "user.id": "user-123",
    "host.name": "Chrome",
    "host.type": "MacIntel",
    "url.full": "https://example.com"
  },
  "logs": [
    {
      "@timestamp": "2026-01-20T10:07:14.129Z",
      "log.level": "info",
      "event.category": ["console"],
      "message": "Form completed",
      "event.id": "log-1",
      "event.original": {
        "type": "CONSOLE",
        "level": "log",
        ...
      }
    }
  ]
}
```

### ECS Field Reference

| Field | Description |
|-------|-------------|
| `@timestamp` | ISO 8601 timestamp |
| `log.level` | Log level (debug, info, warn, error) |
| `event.category` | Event category (console, network, web) |
| `event.action` | Action type (request, response, error) |
| `event.duration` | Duration in nanoseconds |
| `http.request.method` | HTTP method (GET, POST, etc.) |
| `http.response.status_code` | HTTP status code |
| `url.full` | Full URL |
| `error.message` | Error message |
| `error.stack_trace` | Filtered stack trace (max 20 frames) |

**Reference:** [ECS 1.12.0 Specification](https://www.elastic.co/guide/en/ecs/1.12/)

## AI-TXT Format

**File Extension:** `.ai.txt`
**MIME Type:** `text/plain`

AI-optimized text format with key-value pairs.

```txt
# METADATA
service.name=production
user.id=user-123
timestamp=2026-01-20T10:07:31.033Z

# LOGS
[2026-01-20T10:07:14.129Z] INFO console | message="Form completed"
[2026-01-20T10:07:22.619Z] ERROR console | error="Token refresh failed"
[2026-01-20T10:07:25.000Z] INFO network | req.method=POST | url=https://api.example.com/leads | req.body={"name":"Test"}
[2026-01-20T10:07:25.285Z] INFO network | res.status=200 | duration=285ms
```

### Format Specification
- Metadata section: `# KEY=VALUE` format
- Log lines: `[timestamp] LEVEL category | key=value ...`
- Easy to parse with regex: `\[(.*?)\] (\w+) (\w+) \| (.*)`

## Stack Trace Filtering

Stack traces are filtered to include only relevant frames:
- Maximum 20 frames
- Frames with `ignored: true` are excluded
- Original unfiltered trace available in `event.original`

## Correlation IDs

Request/response pairs are linked by `event.id`:
- FETCH_REQ and FETCH_RES share the same `event.id`
- Easy to match requests with responses
- Enables request tracing across logs

## Quick Reference

```typescript
// Export using different formats
downloadLogs('json');     // Original JSON
downloadLogs('txt');      // Plain text
downloadLogs('jsonl');    // JSON Lines (AI-optimized)
downloadLogs('ecs.json'); // ECS-compliant JSON
downloadLogs('ai.txt');   // AI-optimized text
```
