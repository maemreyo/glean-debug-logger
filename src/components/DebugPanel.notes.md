# DebugPanel Component

## Overview

A debug logging panel that intercepts console logs, network requests, and provides export capabilities for React applications.

## Features

- **Console Log Interception**: Captures `console.log`, `console.error`, `console.warn`, `console.info`, and `console.debug` messages
- **Fetch/XHR Request Tracking**: Monitors all network requests and responses
- **Log Export**: Download logs in JSON or TXT format
- **Directory Picker**: Save files directly to local directory (Chrome/Edge 86+)
- **Auto-Upload**: Automatically upload logs to server on consecutive errors
- **Dark Mode**: Automatic theme based on system preference
- **Accessibility**: Full keyboard navigation and screen reader support

## Installation

```bash
npm install @zaob/glean-debug-logger
```

## Usage

### Basic Usage

```tsx
import { DebugPanel } from '@zaob/glean-debug-logger';

function App() {
  return (
    <div className="app">
      {/* Your app content */}
      <DebugPanel />
    </div>
  );
}
```

### With User Context

```tsx
import { DebugPanel } from '@zaob/glean-debug-logger';

function App() {
  return (
    <div className="app">
      <DebugPanel
        user={{
          id: 'user-123',
          email: 'user@example.com',
          role: 'admin'
        }}
        environment="development"
      />
    </div>
  );
}
```

### With Auto-Upload

```tsx
import { DebugPanel } from '@zaob/glean-debug-logger';

function App() {
  return (
    <div className="app">
      <DebugPanel
        uploadEndpoint="https://api.example.com/logs/upload"
        fileNameTemplate="{env}_{date}_{time}_{userId}_{errorCount}errors"
        environment="production"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `user` | `object` | - | No | User info object with `{id?, email?, role?}` |
| `environment` | `string` | `process.env.NODE_ENV \|\| 'development'` | No | Environment name for log context |
| `uploadEndpoint` | `string` | - | No | Server endpoint for log uploads |
| `fileNameTemplate` | `string` | See below | No | Template for exported filenames |
| `maxLogs` | `number` | `2000` | No | Maximum logs to keep in memory |
| `showInProduction` | `boolean` | `false` | No | Whether to show panel in production |

### Default fileNameTemplate

```typescript
'{env}_{date}_{time}_{userId}_{errorCount}errors'
```

#### Template Placeholders

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{env}` | Environment name | `development` |
| `{date}` | Current date (YYYY-MM-DD) | `2024-01-20` |
| `{time}` | Current time (HH-mm-ss) | `15-30-45` |
| `{timestamp}` | Unix timestamp | `1705776645` |
| `{userId}` | User ID or 'anonymous' | `user-123` |
| `{errorCount}` | Number of errors | `5` |
| `{logCount}` | Total log count | `100` |
| `{browser}` | Browser name | `Chrome` |
| `{platform}` | Platform/OS | `MacIntel` |
| `{url}` | Current page URL | `/dashboard` |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+D` | Toggle debug panel |
| `Escape` | Close debug panel |

## Accessibility

The DebugPanel is designed with accessibility in mind:

- **ARIA Roles**: `dialog` for the panel, `status` for status messages
- **Keyboard Navigation**: Full keyboard support for all actions
- **Focus Management**: Focus returns to toggle button when panel closes
- **Screen Reader Support**: All interactive elements have appropriate labels
- **Color Contrast**: Meets WCAG 2.1 AA standards

## Configuration Options

### Environment-specific Settings

```tsx
<DebugPanel
  environment={
    process.env.NODE_ENV === 'production'
      ? 'production'
      : 'development'
  }
  showInProduction={false} // Hidden in production by default
/>
```

### Custom Filename Template

```tsx
<DebugPanel
  fileNameTemplate="debug_{env}_{userId}_{date}_{time}"
  uploadEndpoint="https://your-api.com/logs"
/>
```

## Integration with Existing Code

### React (Next.js App Router)

```tsx
// app/layout.tsx
import { DebugPanel } from '@zaob/glean-debug-logger';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <DebugPanel
          user={session?.user}
          environment={process.env.NODE_ENV}
        />
      </body>
    </html>
  );
}
```

### Custom Hook Usage

The component uses the `useLogRecorder` hook internally. For advanced use cases:

```tsx
import { useLogRecorder } from '@zaob/glean-debug-logger';

function CustomDebugComponent() {
  const { downloadLogs, uploadLogs, clearLogs, getLogs, getMetadata } = useLogRecorder({
    maxLogs: 1000,
    captureConsole: true,
    captureFetch: true,
    environment: 'development',
  });
  
  // Custom UI implementation...
}
```

## API Reference

### useLogRecorder Hook

```typescript
interface UseLogRecorderReturn {
  downloadLogs: (format: 'json' | 'txt', customFilename?: string | null) => string | null;
  uploadLogs: (customEndpoint?: string | null) => Promise<{ success: boolean; data?: unknown; error?: string }>;
  clearLogs: () => void;
  getLogs: () => LogEntry[];
  getLogCount: () => number;
  getMetadata: () => LogMetadata;
  sessionId: string;
}
```

## Examples

### With Dark Mode Support

```tsx
<DebugPanel
  environment="development"
  // Dark mode is automatic based on system preference
  // @media (prefers-color-scheme: dark) in DebugPanel.styles.ts
/>
```

### With Error Tracking

```tsx
<DebugPanel
  uploadEndpoint="https://api.example.com/logs"
  // Automatically uploads logs when 5 consecutive errors occur
  environment="production"
/>
```

## Troubleshooting

### Panel Not Showing

- Ensure `showInProduction` is set to `true` in production
- Check browser console for errors
- Verify React version is 17.0.0 or higher

### Logs Not Capturing

- Ensure no conflicting console overrides
- Check `maxLogs` is not set to 0
- Verify localStorage is not disabled

### Upload Fails

- Check CORS configuration on server
- Verify `uploadEndpoint` is correct
- Check server accepts POST requests with JSON body

## Changelog

### v1.0.0

- Initial release
- Console, Fetch, XHR interception
- JSON/TXT export
- Directory picker support
- Auto-upload on errors
- Dark mode support
- Accessibility features
