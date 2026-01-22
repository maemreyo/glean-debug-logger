# API Reference

Detailed reference for hooks and components in `@zaob/glean-debug-logger`.

## `useLogRecorder` Hook

The primary hook for initializing log capture and managing log state.

### Usage

```tsx
const recorder = useLogRecorder(config);
```

### Configuration Options (`RecorderConfig`)

| Option | Type | Default | Description |
| | :--- | :--- | :--- | :--- |
| `maxLogs` | `number` | `1000` | Maximum number of log entries to store in memory. |
| `enablePersistence` | `boolean` | `true` | If true, logs are saved to `localStorage`. |
| `persistenceKey` | `string` | `'debug_logs'` | The key used for `localStorage` persistence. |
| `captureConsole` | `boolean` | `true` | Whether to intercept `console.*` methods. |
| `captureFetch` | `boolean` | `true` | Whether to intercept global `fetch` requests. |
| `captureXHR` | `boolean` | `true` | Whether to intercept `XMLHttpRequest` requests. |
| `sanitizeKeys` | `string[]` | `[...]` | Additional keys to redact from logs. |
| `excludeUrls` | `string[]` | `[]` | List of URL patterns to ignore for network capture. |
| `fileNameTemplate` | `string` | `'{env}_{userId}_{sessionId}_{timestamp}'` | Template for exported filenames. |
| `environment` | `string` | `'development'` | Current environment name. |
| `userId` | `string \| null` | `null` | Optional user identifier. |
| `sessionId` | `string \| null` | `null` | Optional session identifier (auto-generated if null). |
| `includeMetadata` | `boolean` | `true` | Whether to include system metadata in exports. |
| `uploadEndpoint` | `string \| null` | `null` | Backend endpoint for log uploads. |
| `uploadOnError` | `boolean` | `false` | Automatically upload logs when a `console.error` occurs. |

### Returned Values (`RecorderInstance`)

| Value | Type | Description |
| | :--- | :--- | :--- |
| `logs` | `LogEntry[]` | Reactive array of current logs. |
| `getLogs` | `() => LogEntry[]` | Returns the current array of logs. |
| `getLogCount` | `() => number` | Returns the total number of logs. |
| `getErrorCount` | `() => number` | Returns the number of error logs. |
| `clearLogs` | `() => void` | Clears all logs from memory and `localStorage`. |
| `downloadLogs` | `(format?, filename?) => void` | Triggers a browser download of the logs. |
| `uploadLogs` | `(endpoint?) => Promise<UploadResult>` | Uploads logs to the configured endpoint. |
| `getMetadata` | `() => LogMetadata` | Returns collected system metadata. |
| `sessionId` | `string` | The active session ID. |
| `isCapturing` | `boolean` | Current capture status. |

---

## `GleanDebugger` Component

A wrapper component that provides smart activation and console commands API for the debug panel. This is the **recommended** way to use the library in Next.js applications.

### Usage

For Next.js App Router, use dynamic import with `ssr: false` to prevent hydration issues:

```tsx
// components/GleanDebuggerProvider.tsx
'use client';

import dynamic from 'next/dynamic';

const GleanDebugger = dynamic(
  () => import('@zaob/glean-debug-logger').then((mod) => mod.GleanDebugger),
  { ssr: false }
);

export default function GleanDebuggerProvider() {
  return (
    <GleanDebugger
      environment="development"
      user={{ id: 'user_123', email: 'user@example.com', role: 'admin' }}
      uploadEndpoint="/api/logs/upload"
    />
  );
}
```

Then add to your root layout:

```tsx
// app/layout.tsx
import GleanDebuggerProvider from '@/components/GleanDebuggerProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GleanDebuggerProvider />
        {children}
      </body>
    </html>
  );
}
```

### Props

| Prop | Type | Default | Description |
| | :--- | :--- | :--- | :--- |
| `environment` | `string` | `'development'` | Current environment name. |
| `user` | `User` | `undefined` | User object with optional `id`, `email`, `role`. |
| `uploadEndpoint` | `string` | `undefined` | Backend URL for log uploads. |
| `fileNameTemplate` | `string` | `undefined` | Custom filename template for exports. |
| `maxLogs` | `number` | `1000` | Maximum logs to store. |
| `showInProduction` | `boolean` | `false` | If true, panel is visible in production environments. |

### Activation Logic

The `GleanDebugger` component automatically activates (renders the debug panel) when ANY of the following conditions are true:

1. `showInProduction={true}` - Always show in production
2. `environment === "development"` - Always show in development
3. `user?.role === "admin"` - Show for admin users
4. `?debug=true` URL parameter - Show when `?debug=true` is in the URL
5. `localStorage.getItem('glean-debug-enabled') === 'true'` - Show when localStorage flag is set

### Console Commands API

When `GleanDebugger` is mounted, it exposes a global API for controlling the debugger from the browser console:

```typescript
interface GleanConsoleAPI {
  show(): void; // Show the debug panel
  hide(): void; // Hide the debug panel
  toggle(): void; // Toggle visibility
  isEnabled(): boolean; // Returns current enabled state
}

// Access via:
window.glean.show();
window.glean.hide();
window.glean.toggle();
window.glean.isEnabled();
```

**Note**: In production mode, the API methods show warnings instead of performing actions.

---

## `DebugPanel` Component

A full-featured UI component for interacting with the log recorder.

### Usage

```tsx
<DebugPanel environment="production" userId="user-123" uploadEndpoint="/api/logs/upload" />
```

### Props

| Prop               | Type        | Default         | Description                                   |
| :----------------- | :---------- | :-------------- | :-------------------------------------------- |
| `environment`      | `string`    | `'development'` | Passed to `useLogRecorder`.                   |
| `userId`           | `string`    | `'anonymous'`   | Passed to `useLogRecorder`.                   |
| `uploadEndpoint`   | `string`    | `undefined`     | Backend URL for the upload button.            |
| `fileNameTemplate` | `string`    | `undefined`     | Custom filename template.                     |
| `maxLogs`          | `number`    | `1000`          | Maximum logs to display.                      |
| `showInProduction` | `boolean`   | `false`         | If false, panel is hidden in production envs. |
| `customActions`    | `ReactNode` | `undefined`     | Additional buttons to show in the panel.      |

**Keyboard Shortcut**: `Ctrl + Shift + D` toggles the panel visibility.

---

## `DebugPanelMinimal` Component

A lightweight, unobtrusive version of the debug panel.

### Usage

```tsx
<DebugPanelMinimal />
```

### Props

| Prop       | Type                                                           | Default          | Description               |
| :--------- | :------------------------------------------------------------- | :--------------- | :------------------------ |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Panel position on screen. |
| `format`   | `'json' \| 'txt'`                                              | `'json'`         | Default download format.  |

---

## Types

### `LogEntry`

```typescript
interface LogEntry {
  id: string;
  type: 'CONSOLE' | 'FETCH_REQ' | 'FETCH_RES' | 'XHR_REQ' | 'XHR_RES' | 'ERROR';
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'LOG';
  time: string; // ISO 8601
  data?: any;
  method?: string;
  url?: string;
  status?: number;
  duration?: number;
  headers?: Record<string, string>;
  error?: string;
  stack?: string;
}
```

### `LogMetadata`

```typescript
interface LogMetadata {
  sessionId: string;
  userId: string | null;
  environment: string;
  url: string;
  userAgent: string;
  browser: string;
  platform: string;
  language: string;
  screen: string; // e.g., "1920x1080"
  timezone: string;
  timestamp: string;
}
```
