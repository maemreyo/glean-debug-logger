You are helping integrate @zaob/glean-debug-logger into a React/Next.js project.

@zaob/glean-debug-logger is a debug logging library that intercepts console logs, network requests (Fetch/XHR), and exports logs with smart filenames.

YOUR TASTS:

## 1. READ THIS DOCUMENT FIRST (MANDATORY)
Read the following files in order - DO NOT proceed without understanding them:
- README.md (project overview and basic usage)
- AI_INSTALLATION_PROMPT.md (this file - setup requirements and installation steps)
- Any API documentation or guides in docs/
- package.json (peer dependencies, version requirements)
- CHANGELOG.md (if exists)

## 2. CHECK USER'S ENVIRONMENT
Ask the user (if not already clear):
- What framework are they using? (React, Next.js, Vite, Remix, etc.)
- What is their package manager? (npm, yarn, pnpm, bun)
- What is their TypeScript version? (check package.json devDependencies)
- What is their React version? (18, 19, etc.)

## 3. CHECK PROJECT REQUIREMENTS
Before installation, verify the user's project has:
- React >= 17.0.0 (peer dependency - must be installed by user)
- TypeScript >= 5.3.0 (for type definitions)
- Node.js >= 18.0.0

Note: The library has ONE runtime dependency: `goober` (^2.1.18) for CSS-in-JS styling

## 4. INSTALLATION STEPS
Provide the user with these steps:

### For npm users:
```bash
npm install @zaob/glean-debug-logger
```

### For yarn users:
```bash
yarn add @zaob/glean-debug-logger
```

### For pnpm users:
```bash
pnpm add @zaob/glean-debug-logger
```

### For bun users:
```bash
bun add @zaob/glean-debug-logger
```

## 5. BASIC INTEGRATION CODE
After installation, help the user add this to their project:

```tsx
// Option 1: Basic usage with default settings
import { DebugPanel } from '@zaob/glean-debug-logger';

// Add <DebugPanel /> anywhere in your app (usually at the root)
function App() {
  return (
    <>
      <DebugPanel />
      {/* your app content */}
    </>
  );
}

// Option 2: With custom configuration
import { DebugPanel, useLogRecorder } from '@zaob/glean-debug-logger';

function App() {
  useLogRecorder({
    // Configuration options here
    maxLogs: 1000,
    autoSave: true,
    // ... other options
  });

  return (
    <>
      <DebugPanel />
      {/* your app content */}
    </>
  );
}
```

## 6. VERIFICATION CHECKLIST
After helping the user install, verify:
- [ ] Package installed successfully (check node_modules/@zaob/glean-debug-logger)
- [ ] TypeScript types are available
- [ ] No peer dependency warnings
- [ ] Build passes without errors
- [ ] DebugPanel renders without errors

## 7. COMMON ISSUES & SOLUTIONS

### Issue: Missing peer dependency (React)
```
Solution: User must install React separately
npm install react react-dom
```

### Issue: TypeScript errors
```
Solution: Ensure TypeScript >= 5.3.0 is installed
npm install -D typescript@latest
```

### Issue: Build errors
```
Solution: Check that @ts-nocheck is NOT in build artifacts
This is handled automatically by the library's build process
```

### Issue: Console logs not appearing
```
Solution: Verify:
1. DebugPanel is mounted in the component tree
2. useLogRecorder hook is called (if using custom config)
3. No conflicting console interceptor elsewhere
```

## 8. ADVANCED CONFIGURATION
If the user needs custom sanitization or filename templates:

### Custom sanitization rules:
```tsx
import { useLogRecorder, sanitizeConfig } from '@zaob/glean-debug-logger';

useLogRecorder({
  sanitize: {
    ...sanitizeConfig.DEFAULT_SANITIZE_KEYS,
    customKeys: ['mySecret', 'apiToken'], // Add custom keys
  }
});
```

### Custom filename templates:
```tsx
import { useLogRecorder } from '@zaob/glean-debug-logger';

useLogRecorder({
  filename: {
    template: 'debug-{timestamp}-{method}.log',
    timestamp: 'ISO', // or 'unix', 'local'
  }
});
```

## 9. ENVIRONMENT-SPECIFIC NOTES

### Next.js:
- Works in both App Router and Pages Router
- For App Router: Add DebugPanel in a Client Component
- For Pages Router: Add in _app.tsx or layout.tsx

### Vite:
- Works with Vite + React + TypeScript template
- No special configuration needed

### Remix:
- Works in Remix React components
- Ensure it's only in client-side code (not loaders/actions)

### Gatsby:
- Works in Gatsby React pages
- Check gatsby-browser.js for global providers

## 10. REPORT BACK
After completing the integration, provide:
- Installation command used
- Any warnings or errors encountered
- Whether basic verification passed
- Next steps for the user (how to use features, etc.)

---

## Important Notes for AI:

1. ALWAYS read the documentation files FIRST before suggesting anything
2. CHECK the user's environment - don't assume
3. VERIFY installation succeeded before moving to configuration
4. The library has ONE runtime dependency: `goober` (^2.1.18) for CSS-in-JS styling
5. Bundle size should be under 20KB (verify if concerned)
6. Named exports ONLY - use named imports, not default exports
7. Security: The library auto-redacts sensitive keys (password, token, apiKey, etc.)

## If You Need More Information:

If you cannot find the information you need, ask the user:
- "What framework and version are you using?"
- "What's your package manager?"
- "What React version do you have?"
- "Are you seeing any specific errors?"

Then proceed with the appropriate installation and configuration steps.

