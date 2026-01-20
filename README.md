# @zaob/glean-debug-logger

[![npm version](https://badge.fury.io/js/%40zaob%2Fglean-debug-logger.svg)](https://www.npmjs.com/package/@zaob/glean-debug-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/maemreyo/glean-debug-logger/actions/workflows/ci.yml/badge.svg)](https://github.com/maemreyo/glean-debug-logger/actions/workflows/ci.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-17%2B-61DAFB)](https://react.dev/)
[![minzipped](https://badgen.net/bundlephobia/minzip/@zaob/glean-debug-logger)](https://bundlephobia.com/result?p=@zaob/glean-debug-logger)

A production-ready React/Next.js debug logging library that captures console logs, network requests (Fetch + XHR), exports with smart filenames, and supports server upload.

## Features

- **Console Log Interception**: Captures `console.log`, `console.error`, `console.warn`, `console.info`, `console.debug`
- **Network Request Interception**: Monitors Fetch and XHR requests/responses
- **Smart Filename Templates**: Generate descriptive filenames with metadata placeholders
- **Rich Metadata Collection**: Browser, platform, screen resolution, timezone, and more
- **Auto-Sanitization**: Automatically redacts sensitive data (password, token, apiKey, etc.)
- **LocalStorage Persistence**: Logs persist across page refreshes
- **Download/Upload**: Export logs as JSON or TXT, or upload to your server
- **Debug Panel UI**: Floating debug panel with stats and controls

## Installation

```bash
npm install @zaob/glean-debug-logger
```

**Peer Dependency**: React 17+ must be installed in your project.

## Quick Start

```tsx
import { useLogRecorder, DebugPanel } from "@zaob/glean-debug-logger";

function App() {
  const { downloadLogs, uploadLogs, getMetadata } = useLogRecorder({
    fileNameTemplate: "{env}_{date}_{userId}_{errorCount}errors",
    environment: "production",
    userId: user?.id,
    uploadEndpoint: "/api/logs/upload",
  });

  return (
    <div>
      <button onClick={() => downloadLogs("json")}>Download Logs</button>
      <DebugPanel user={user} />
    </div>
  );
}
```

## API Reference

### useLogRecorder Hook

```tsx
const {
  downloadLogs, // (format?, customFilename?) => string | null
  uploadLogs, // (customEndpoint?) => Promise<{ success, data?, error? }>
  clearLogs, // () => void
  getLogs, // () => LogEntry[]
  getLogCount, // () => number
  getMetadata, // () => LogMetadata
  sessionId, // string
} = useLogRecorder(config);
```

#### Configuration Options

| Option              | Type           | Default                                   | Description                     |
| ------------------- | -------------- | ----------------------------------------- | ------------------------------- |
| `maxLogs`           | number         | 1000                                      | Maximum number of logs to keep  |
| `enablePersistence` | boolean        | true                                      | Enable localStorage persistence |
| `persistenceKey`    | string         | 'debug_logs'                              | localStorage key                |
| `captureConsole`    | boolean        | true                                      | Capture console.log calls       |
| `captureFetch`      | boolean        | true                                      | Capture Fetch requests          |
| `captureXHR`        | boolean        | true                                      | Capture XHR requests            |
| `sanitizeKeys`      | string[]       | [...]                                     | Keys to redact                  |
| `excludeUrls`       | string[]       | []                                        | URLs to exclude from capture    |
| `fileNameTemplate`  | string         | '{env}_{userId}_{sessionId}\_{timestamp}' | Filename template               |
| `environment`       | string         | 'development'                             | Environment name                |
| `userId`            | string \| null | null                                      | User identifier                 |
| `sessionId`         | string \| null | null                                      | Session identifier              |
| `includeMetadata`   | boolean        | true                                      | Include metadata in export      |
| `uploadEndpoint`    | string \| null | null                                      | Server upload URL               |
| `uploadOnError`     | boolean        | false                                     | Auto-upload on errors           |

### DebugPanel Component

```tsx
<DebugPanel
  user={{ id?: string; email?: string; role?: string }}
  environment?: string
  uploadEndpoint?: string
  fileNameTemplate?: string
  maxLogs?: number
  showInProduction?: boolean
/>
```

**Keyboard Shortcut**: Press `Ctrl+Shift+D` to toggle the debug panel.

## Smart Filename Templates

Generate descriptive filenames using placeholders:

```javascript
const config = {
  fileNameTemplate: "{env}_{date}_{userId}_{errorCount}errors",
};
```

**Available Placeholders**:

| Placeholder    | Description      | Example                  |
| -------------- | ---------------- | ------------------------ |
| `{env}`        | Environment      | `production`             |
| `{userId}`     | User ID          | `user123` or `anonymous` |
| `{sessionId}`  | Session ID       | `session_abc123`         |
| `{timestamp}`  | ISO timestamp    | `2024-01-20T10-30-45`    |
| `{date}`       | Date only        | `2024-01-20`             |
| `{time}`       | Time only        | `10-30-45`               |
| `{errorCount}` | Error count      | `5`                      |
| `{logCount}`   | Log count        | `1234`                   |
| `{browser}`    | Browser name     | `chrome`                 |
| `{platform}`   | OS platform      | `MacIntel`               |
| `{url}`        | Current URL path | `_checkout_payment`      |

## Security

Sensitive data is automatically redacted. Configure additional keys:

```tsx
useLogRecorder({
  sanitizeKeys: ["password", "token", "apiKey", "secret", "customKey"],
});
```

## Backend Integration

See the `examples/` folder for reference implementations:

- **nextjs-file-system**: Save to local filesystem
- **s3-upload**: Upload to AWS S3
- **supabase-storage**: Upload to Supabase Storage
- **postgresql**: Save to PostgreSQL database
- **secure-api**: With rate limiting and authentication

## Build Output

| Format             | Size   |
| ------------------ | ------ |
| CJS (index.js)     | ~19 KB |
| ESM (index.mjs)    | ~18 KB |
| TypeScript (.d.ts) | ~5 KB  |

## License

MIT
