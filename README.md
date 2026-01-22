# @zaob/glean-debug-logger

[![npm version](https://badge.fury.io/js/%40zaob%2Fglean-debug-logger.svg)](https://www.npmjs.com/package/@zaob/glean-debug-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/maemreyo/glean-debug-logger/actions/workflows/ci.yml/badge.svg)](https://github.com/maemreyo/glean-debug-logger/actions/workflows/ci.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-17%2B-61DAFB)](https://react.dev/)
[![minzipped](https://badgen.net/bundlephobia/minzip/@zaob/glean-debug-logger)](https://bundlephobia.com/result?p=@zaob/glean-debug-logger)

A production-ready React/Next.js debug logging library that intercepts console logs, network requests (Fetch/XHR), and exports them with smart filenames. Designed for both manual debugging and automated analysis by AI agents.

---

## Quick Setup: One-Line Command

To install and setup @zaob/glean-debug-logger in your project with a single command:

```bash
curl -sL https://raw.githubusercontent.com/maemreyo/glean-debug-logger/refs/heads/main/AI_INSTALLATION_PROMPT.md | bash
```

This command will:

1. Fetch the latest installation prompt from the repository
2. Execute the installation steps for your package manager
3. Provide integration code

**Note:** This command requires the user to:

- Have curl installed
- Be in a React/Next.js project directory
- Have internet access to fetch the raw file

---

## 🚀 Features

- **Console Log Interception**: Automatically captures `console.log`, `console.error`, `console.warn`, `console.info`, and `console.debug`.
- **Network Request Interception**: Monitors both `Fetch API` and `XMLHttpRequest` (XHR) requests and responses.
- **Smart Filename Templates**: Generate descriptive filenames with metadata placeholders (env, date, userId, errorCount, etc.).
- **Rich Metadata Collection**: Gathers browser info, platform, screen resolution, timezone, and current URL.
- **Auto-Sanitization**: Automatically redacts sensitive data (passwords, tokens, API keys, credit card numbers, etc.).
- **LocalStorage Persistence**: Logs persist across page refreshes so you don't lose data on navigation.
- **Multiple Export Formats**: Export logs as JSON, TXT, JSONL (AI-optimized), ECS-compliant JSON, or AI-friendly TXT.
- **Debug Panel UI**: A floating debug panel with real-time stats, format-aware clipboard copy, and server upload capability.
- **Zero Runtime Dependencies**: Only React is required as a peer dependency. Bundle size < 20KB.

## 📦 Installation

```bash
npm install @zaob/glean-debug-logger
```

**Peer Dependency**: React 17+ must be installed in your project.

## 🏁 Quick Start

### Option 1: GleanDebugger Component (Recommended)

The simplest way to add debug logging to your Next.js app. Just add the provider and it handles everything automatically:

```tsx
// app/providers.tsx
'use client';

import dynamic from 'next/dynamic';

// Client-only dynamic import - prevents SSR hydration issues
const GleanDebugger = dynamic(
  () => import('@zaob/glean-debug-logger').then((mod) => mod.GleanDebugger),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GleanDebugger
        environment="development"
        user={{ id: 'user_123', email: 'user@example.com', role: 'admin' }}
        uploadEndpoint="/api/logs/upload"
      />
    </>
  );
}
```

Then wrap your app in `layout.tsx`:

```tsx
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

The `GleanDebugger` component provides:

- **Auto-activation** based on environment, user role, or URL params
- **Console commands API** via `window.glean` (`show()`, `hide()`, `toggle()`, `isEnabled()`)
- **Smart visibility** - hidden by default in production unless explicitly enabled

### Option 2: useLogRecorder Hook + DebugPanel (Advanced)

For more control, use the hook and component separately. This is an advanced option for custom use cases:

```tsx
import { useLogRecorder, DebugPanel } from '@zaob/glean-debug-logger';

function App() {
  const { downloadLogs, uploadLogs } = useLogRecorder({
    fileNameTemplate: '{env}_{date}_{userId}_{errorCount}errors',
    environment: 'production',
    userId: 'user_123',
    uploadEndpoint: '/api/logs/upload',
  });

  return (
    <div>
      <h1>My Awesome App</h1>
      <button onClick={() => downloadLogs('json')}>Download Logs</button>

      {/* Fixed-position debug panel (Ctrl+Shift+D to toggle) */}
      <DebugPanel environment="production" userId="user_123" uploadEndpoint="/api/logs/upload" />
    </div>
  );
}
```

## 🔧 Activation Methods

When using `GleanDebugger`, the debug panel activates automatically when ANY of these conditions are met:

| Condition                          | How to Enable                                                         |
| :--------------------------------- | :-------------------------------------------------------------------- |
| Development mode                   | `environment="development"`                                           |
| Production with `showInProduction` | `showInProduction={true}`                                             |
| Admin user                         | `user={{ role: "admin" }}`                                            |
| URL parameter                      | Add `?debug=true` to your URL                                         |
| localStorage                       | Run in console: `localStorage.setItem('glean-debug-enabled', 'true')` |

### Console Commands API

When `GleanDebugger` is loaded, you can control it from the browser console:

```javascript
window.glean.show(); // Show the debug panel
window.glean.hide(); // Hide the debug panel
window.glean.toggle(); // Toggle visibility
window.glean.isEnabled(); // Returns true/false
```

**Note**: In production mode, these commands warn that debug mode is disabled.

## 📖 Detailed Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md) - Deep dive into interceptors and data flow.
- [API Reference](./docs/API.md) - Full details on `useLogRecorder` and components.
- [Log Export Formats](./docs/log-formats.md) - Details on JSON, JSONL, ECS, and AI-TXT formats.
- [Security & Sanitization](./docs/SECURITY.md) - How we protect your sensitive data.
- [Integration Examples](./docs/INTEGRATIONS.md) - Next.js, S3, Supabase, and PostgreSQL.
- [Development Guide](./docs/DEVELOPMENT.md) - Conventions, build process, and contributing.

## 🛠 Usage Patterns

### Smart Filename Templates

Placeholders are replaced with real values at the time of export:

```typescript
const config = {
  fileNameTemplate: '{env}_{date}_{userId}_{errorCount}errors_{browser}',
};
// Result: production_2026-01-20_user123_5errors_chrome.json
```

### AI-Optimized Exports

For use with AI coding assistants or automated analysis tools:

```typescript
downloadLogs('jsonl'); // Line-delimited JSON (NDJSON)
downloadLogs('ai.txt'); // Human-readable structured text
```

### Server Upload Integration

The library can POST logs directly to your backend for persistence:

```typescript
const { uploadLogs } = useLogRecorder({
  uploadEndpoint: '/api/logs/upload',
  uploadOnError: true, // Auto-upload when a console.error occurs
});
```

## 🛡 Security

Sensitive keys are automatically redacted from all captured logs. The default list includes:
`password`, `token`, `apiKey`, `secret`, `authorization`, `creditCard`, `cardNumber`, `cvv`, `ssn`.

You can customize this list:

```tsx
useLogRecorder({
  sanitizeKeys: ['custom_secret_key', 'session_id'],
});
```

## 📄 License

MIT © [zaob](https://github.com/maemreyo)
