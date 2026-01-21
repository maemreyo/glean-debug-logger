# DX Improvement Analysis: GleanDebugger Component

## Executive Summary

This document provides a comprehensive analysis of the current codebase and research findings for creating a drop-in `GleanDebugger` component that enables 1-line integration with smart activation patterns.

**Target Goal:**

```tsx
import { GleanDebugger } from '@zaob/glean-debug-logger';
<GleanDebugger />;
```

---

## Part 1: Current Codebase Analysis

### 1.1 Export Patterns (src/index.ts)

**Current State:**

```typescript
// Hooks
export { useLogRecorder } from './hooks/useLogRecorder';

// Components
export { DebugPanel } from './components/DebugPanel';
export { DebugPanelMinimal } from './components/DebugPanelMinimal';

// Utils
export * from './utils/sanitize';
export * from './utils/filename';
export { transformToECS, filterStackTrace, transformMetadataToECS } from './utils/ecsTransform';

// Types
export * from './types';
```

**Key Findings:**

- Named exports only (tree-shaking requirement)
- No default exports currently
- Barrel file pattern used at src/index.ts and src/components/index.ts
- Types exported separately for external consumption

### 1.2 DebugPanel Component (src/components/DebugPanel.tsx)

**Structure:**

```typescript
'use client'; // Line 1 - Already client-side only!

interface DebugPanelProps {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
  environment?: string;
  uploadEndpoint?: string;
  fileNameTemplate?: string;
  maxLogs?: number;
  showInProduction?: boolean;
}

export function DebugPanel({
  user,
  environment = process.env.NODE_ENV || 'development',
  uploadEndpoint,
  fileNameTemplate = '{env}_{date}_{time}_{userId}_{errorCount}errors',
  maxLogs = 2000,
  showInProduction = false,
}: DebugPanelProps) {
  // State, refs, effects, callbacks...
}
```

**Current shouldShow Logic:**
The DebugPanel doesn't have explicit visibility logic - it's mounted and controls its own visibility through internal state (isOpen). However, the activation decision should be made BEFORE rendering.

### 1.3 useLogRecorder Hook (src/hooks/useLogRecorder.ts)

**SSR Safety Patterns:**

```typescript
// Line 151-157: Try/catch with SSR guard
if (cfg.enablePersistence && typeof window !== 'undefined') {
  try {
    localStorage.setItem(cfg.persistenceKey, safeStringify(logsRef.current));
  } catch {
    console.warn('[useLogRecorder] Failed to persist logs');
  }
}

// Line 183: SSR guard for initialization
if (typeof window === 'undefined' || isInitialized.current) return;
```

**Error Handling:**

```typescript
// Line 144-146: Silent fail for auto-upload
}).catch(() => {
  // Silently fail auto-upload
});

// Line 155, 195, 493, 495, 512: Console warnings with prefix
console.warn('[useLogRecorder] Failed to ...');
console.error('[useLogRecorder] Failed to upload logs:', error);
```

**Environment Detection:**

```typescript
// Line 54: Default environment
environment = process.env.NODE_ENV || 'development',

// Lines 74, 118: Development-only checks
if (process.env.NODE_ENV === 'development') {
  // ...
}
```

### 1.4 TypeScript Patterns (src/types/index.ts)

**Component Props Interface:**

```typescript
interface DebugPanelProps {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
  environment?: string;
  uploadEndpoint?: string;
  fileNameTemplate?: string;
  maxLogs?: number;
  showInProduction?: boolean;
}
```

**Config Interface:**

```typescript
export interface LogRecorderConfig {
  maxLogs?: number;
  enablePersistence?: boolean;
  persistenceKey?: string;
  captureConsole?: boolean;
  captureFetch?: boolean;
  captureXHR?: boolean;
  // ... more options
}
```

---

## Part 2: Research Findings

### 2.1 Global API Exposure Patterns (Sentry, LogRocket, TrackJS)

**Sentry Pattern:**

```html
<script src="https://js.sentry-cdn.com/___PUBLIC_KEY___.min.js"></script>
<script>
  window.Sentry &&
    Sentry.init({
      dsn: '___PUBLIC_DSN___',
    });
</script>
```

**LogRocket Pattern:**

```javascript
// Direct global assignment with safety check
window.LogRocket && window.LogRocket.init(YOUR_APP_ID);
```

**TrackJS Pattern:**

```javascript
// Safety guards before method calls
window.TrackJS && TrackJS.install({ token: 'YOUR_TOKEN' });
```

**Key Patterns:**

1. Safety guards: `window.LibraryName &&` before calling methods
2. SSR checks: `typeof window !== 'undefined'` for server-side rendering
3. TypeScript: Extend `Window` interface in global declarations
4. Lazy loading: Libraries often buffer events until fully loaded

### 2.2 Debug Tool Console APIs (Eruda, VConsole, React DevTools)

**Eruda Console API:**

```javascript
window.eruda = {
  init: function () {
    /* ... */
  },
  destroy: function () {
    /* ... */
  },
  scale: function () {
    /* ... */
  },
  position: function () {
    /* ... */
  },
  get: function (name) {
    /* ... */
  },
  add: function (plugin) {
    /* ... */
  },
  remove: function (name) {
    /* ... */
  },
};
```

**Key Features:**

- All methods use safety checks
- Namespace collision handling
- Cleanup/destroy methods
- Production mode detection

### 2.3 React SSR-Safe Patterns

**Client-Only Code:**

```typescript
// Check for window before browser APIs
if (typeof window !== 'undefined') {
  // Safe to access window globals
}

// useEffect for client-only initialization
useEffect(() => {
  // This runs only on client
  window.glean = {
    /* ... */
  };

  return () => {
    // Cleanup
    delete window.glean;
  };
}, []);
```

**TypeScript Augmentation:**

```typescript
declare global {
  interface Window {
    glean: {
      show: () => void;
      hide: () => void;
      toggle: () => void;
      isEnabled: () => boolean;
    };
  }
}
```

---

## Part 3: Implementation Strategy

### 3.1 GleanDebugger Component Structure

```typescript
// src/components/GleanDebugger.tsx
'use client';

import { useMemo, useEffect, useState } from 'react';
import { DebugPanel } from './DebugPanel';

interface GleanDebuggerProps {
  environment?: string;
  maxLogs?: number;
  showInProduction?: boolean;
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}

export function GleanDebugger(props: GleanDebuggerProps) {
  // Activation detection
  const isActivated = useMemo(() => {
    // Check original conditions
    const original = props.showInProduction ||
                     props.environment === 'development' ||
                     props.user?.role === 'admin';

    if (original) return true;

    // Check URL param (?debug=true)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('debug') === 'true') return true;

      // Check localStorage (key: 'glean-debug')
      try {
        if (localStorage.getItem('glean-debug') === 'true') return true;
      } catch {
        // localStorage might be unavailable (private browsing)
      }
    }

    return false;
  }, [props.showInProduction, props.environment, props.user]);

  // Don't render if not activated
  if (!isActivated) return null;

  // Console commands API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isProduction = process.env.NODE_ENV === 'production';

    // Production: console.warn only
    const noop = () => console.warn('[GleanDebugger] Debug mode is disabled in production');

    const commands = isProduction ? {
      show: noop,
      hide: noop,
      toggle: noop,
      isEnabled: () => false,
    } : {
      show: () => localStorage.setItem('glean-debug', 'true'),
      hide: () => localStorage.removeItem('glean-debug'),
      toggle: () => {
        const enabled = localStorage.getItem('glean-debug') === 'true';
        if (enabled) {
          localStorage.removeItem('glean-debug');
        } else {
          localStorage.setItem('glean-debug', 'true');
        }
      },
      isEnabled: () => true,
    };

    // Check for namespace collision
    if (window.glean !== undefined) {
      console.warn('[GleanDebugger] window.glean already exists. Skipping registration.');
      return;
    }

    // Register API
    window.glean = commands;

    // Cleanup on unmount
    return () => {
      if (window.glean === commands) {
        delete window.glean;
      }
    };
  }, []);

  return <DebugPanel {...props} />;
}
```

### 3.2 Export Pattern (src/index.ts)

```typescript
// Add this line to existing exports
export { default as GleanDebugger } from './components/GleanDebugger';
```

### 3.3 Usage Examples

**Basic Usage:**

```tsx
import { GleanDebugger } from '@zaob/glean-debug-logger';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GleanDebugger />
      </body>
    </html>
  );
}
```

**With Custom Config:**

```tsx
<GleanDebugger environment="development" maxLogs={500} showInProduction={false} />
```

**Activation Methods:**

```bash
# URL activation
http://localhost:3000?debug=true

# localStorage activation
localStorage.setItem('glean-debug', 'true')

# Console commands (development only)
> window.glean.show()
> window.glean.hide()
> window.glean.toggle()
> window.glean.isEnabled()
```

---

## Part 4: Comparison: Before vs After

| Aspect             | Before (Current) | After (Proposed)           |
| ------------------ | ---------------- | -------------------------- |
| Files needed       | 3+               | 0                          |
| Lines of code      | ~50+             | 1                          |
| Imports            | Complex          | `@zaob/glean-debug-logger` |
| SSR handling       | Manual           | Automatic                  |
| Production hiding  | Needs config     | Default                    |
| Conditional enable | None             | URL/localStorage/console   |
| Console API        | None             | window.glean.\*            |
| TypeScript support | Manual           | Built-in                   |

---

## Part 5: Implementation Tasks

### Task 1: Create GleanDebugger.tsx

- [ ] Create component with 'use client' directive
- [ ] Implement URL param detection (?debug=true)
- [ ] Implement localStorage detection (glean-debug key)
- [ ] Implement console commands API (window.glean)
- [ ] Add SSR safety guards
- [ ] Add production mode handling
- [ ] Add namespace collision handling
- [ ] Add cleanup on unmount

### Task 2: Update index.ts exports

- [ ] Add GleanDebugger export
- [ ] Verify tree-shaking still works

### Task 3: Testing

- [ ] Test URL param activation
- [ ] Test localStorage activation
- [ ] Test console commands (dev mode)
- [ ] Test console warnings (production mode)
- [ ] Test SSR safety
- [ ] Test namespace collision
- [ ] Test cleanup on unmount

---

## Part 6: Research Status Summary

### Completed Tasks

| Task                      | Status      | Key Findings                                          |
| ------------------------- | ----------- | ----------------------------------------------------- |
| Component export patterns | ✅ Complete | Named exports only, barrel file pattern               |
| Hook patterns             | ✅ Complete | useState, useEffect, useCallback, useRef, useMemo     |
| Type patterns             | ✅ Complete | Interface definitions for props and config            |
| Error handling            | ✅ Complete | try/catch, console.warn, no console.log in production |
| Console API patterns      | ✅ Complete | window.glean API structure                            |
| SSR safe patterns         | ✅ Complete | typeof window guards, try/catch for localStorage      |
| Global API patterns       | ✅ Complete | Sentry, LogRocket, TrackJS patterns                   |
| Testing patterns          | ✅ Complete | vitest, mock patterns                                 |

### In Progress Tasks

| Task               | Status       | Notes                     |
| ------------------ | ------------ | ------------------------- |
| Import patterns    | 🔄 Gathering | React hooks, type imports |
| Lifecycle patterns | 🔄 Gathering | useEffect cleanup returns |

---

## Part 7: Open Questions

### 7.1 Naming Conventions

1. **Activation URL param**: `?debug=true` or `?glean-debug`?
2. **LocalStorage key**: `glean-debug` or `glean-debug-enabled`?
3. **Console namespace**: `window.glean` or `window.__glean__`?

### 7.2 Behavior Decisions

4. **Production console commands**: No-op or console.warn?
5. **Namespace collision**: Merge, warn + skip, or throw?
6. **Multiple instances**: Allow or warn?

### 7.3 Technical Details

7. **Bundle size budget**: <5KB acceptable?
8. **TypeScript declarations**: Separate file or inline?
9. **Backward compatibility**: Any breaking changes?

---

## Part 8: Recommendations

Based on the research and analysis, I recommend:

### 8.1 Immediate Actions

1. Create `GleanDebugger.tsx` with activation detection
2. Export from `index.ts` using named export pattern
3. Add comprehensive TypeScript types

### 8.2 Best Practices to Follow

1. **SSR Safety**: Always use `typeof window !== 'undefined'` guards
2. **Error Handling**: Try/catch for localStorage operations
3. **Console Usage**: console.warn for warnings, console.error for errors
4. **Production Mode**: Console commands should warn, not silently fail
5. **Cleanup**: Always remove window.glean on unmount

### 8.3 Anti-Patterns to Avoid

1. No console.log in production code
2. No blocking operations in interceptors
3. No direct window/document access without guards
4. No state mutations outside React hooks
5. No missing cleanup functions

---

## References

### Codebase References

- `src/index.ts`: Export patterns
- `src/components/DebugPanel.tsx`: Component structure, props interface
- `src/hooks/useLogRecorder.ts`: Hook patterns, SSR safety, error handling
- `src/types/index.ts`: TypeScript patterns

### External References

- Sentry Loader: https://docs.sentry.io/platforms/javascript/install/loader/
- LogRocket Quickstart: https://docs.logrocket.com/docs/quickstart
- TrackJS Installation: https://docs.trackjs.com/browser-agent/installation/
- TypeScript Window Augmentation: https://www.codefixeshub.com/typescript/typing-global-variables-extending-the-window-object/

---

## Next Steps

1. **Confirm naming conventions** (Part 7.1)
2. **Confirm behavior decisions** (Part 7.2)
3. **Confirm technical details** (Part 7.3)
4. **Create implementation tasks** (Part 5)
5. **Generate work plan**
6. **Execute implementation**
