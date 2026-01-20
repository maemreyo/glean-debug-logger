# Work Plan: @zaob/glean-debug-logger Implementation

## Context

### Original Request
Implement the @zaob/glean-debug-logger React package as specified in docs/idea.md and docs/author.md.

### Interview Summary

**Key Discussions**:
- Language: TypeScript (confirmed by user)
- Test Framework: vitest + @testing-library/react (confirmed by user)
- Backend Examples: Separate `examples/` folder (user choice: c)
- Scope: Full feature set including auto-upload (confirmed by user)
- Test Approach: Tests-After (user accepted recommendation)

**Research Findings**:
- Project in "blueprint phase" - documentation exists, source doesn't
- Implementation code in docs/idea.md (533-line hook, 361-line component)
- Extensive backend examples: Next.js, S3, Supabase, PostgreSQL, secure API
- No configuration files exist yet (package.json, tsconfig, etc.)

### Metis Review
Metis consultation unavailable (service error). Proceeding with available context.

---

## Work Objectives

### Core Objective
Create a production-ready React debug logging library `@zaob/glean-debug-logger` with full features: console/network interception, smart filenames, metadata collection, auto-sanitization, localStorage persistence, download/upload capabilities, and DebugPanel UI.

### Concrete Deliverables
- `src/hooks/useLogRecorder.ts` - Main hook with all features
- `src/components/DebugPanel.tsx` - Full debug panel component
- `src/components/DebugPanelMinimal.tsx` - Minimal debug panel
- `src/utils/sanitize.ts` - Data sanitization utilities
- `src/utils/filename.ts` - Smart filename generation
- `src/types/index.ts` - TypeScript type definitions
- `src/index.ts` - Main export file
- `package.json` - Package configuration
- `tsconfig.json` - TypeScript configuration
- `tsup.config.ts` - Build configuration
- `vitest.config.ts` - Test configuration
- `examples/` - Backend implementation examples

### Definition of Done
- [ ] `npm run build` completes successfully
- [ ] `npm test` runs with vitest
- [ ] Bundle size < 20KB
- [ ] TypeScript types generated (.d.ts)
- [ ] CJS + ESM formats output
- [ ] All features from docs/idea.md implemented
- [ ] Backend examples extracted to examples/ folder

### Must Have
- TypeScript implementation with proper types
- useLogRecorder hook with all interceptors (console, fetch, xhr)
- Smart filename templates with placeholders
- Metadata collection (browser, platform, screen, timezone, etc.)
- Auto-sanitization of sensitive keys
- LocalStorage persistence
- Download as JSON/TXT
- Upload to server endpoint
- DebugPanel component (full + minimal)
- vitest configuration
- tsup build configuration

### Must NOT Have (Guardrails)
- ❌ NO backend server code in main package (only examples/)
- ❌ NO React Native support (browser-only APIs)
- ❌ NO SSR helpers (keep it client-side focused)
- ❌ NO analytics integration
- ❌ NO multi-tab synchronization
- ❌ NO bundled React (peerDependency only)
- ❌ NO source maps in production build

---

## Verification Strategy (Tests-After Approach)

### Test Decision
- **Infrastructure exists**: NO (needs setup)
- **User wants tests**: YES (Tests-After approach)
- **Framework**: vitest + @testing-library/react
- **QA approach**: Implementation first, tests added after

### Test Setup Tasks (Included in Plan)
- [ ] Install vitest + @testing-library/react
- [ ] Create vitest.config.ts
- [ ] Add test scripts to package.json
- [ ] Create example test to verify setup

### Implementation Testing Strategy
After implementation, add tests for:
- Hook initialization and cleanup
- Console log interception
- Fetch/XHR interception
- Sanitization behavior
- Filename generation
- Download functionality
- Upload functionality
- Component rendering

---

## Task Flow

```
Initialize Project → Setup Config → Create Types → Create Utils → Create Hook → Create Components → Setup Tests → Build Verification → Extract Examples
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 2, 3, 4 | Independent config files |
| B | 5, 6 | Utils can be developed in parallel |

| Task | Depends On | Reason |
|------|------------|--------|
| 5 (Types) | - | Foundation for everything |
| 6 (Utils) | 5 | Types needed for utils |
| 7 (Hook) | 5, 6 | Types and utils required |
| 8 (Components) | 7 | Hook needed for components |
| 9 (Tests) | 7, 8 | Implementation needed first |
| 10 (Build) | 1-8 | Full source needed |
| 11 (Examples) | - | Independent of source |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> Specify parallelizability for EVERY task.

- [ ] 1. Initialize Project and Install Dependencies

  **What to do**:
  - Initialize npm project with `npm init -y`
  - Install production dependencies: react (peer)
  - Install dev dependencies: typescript, tsup, vitest, @testing-library/react, @types/react, @types/node, eslint, prettier
  - Create basic package.json with proper configuration

  **Must NOT do**:
  - ❌ Don't skip peerDependencies configuration
  - ❌ Don't install runtime dependencies (only dev + peer)

  **Parallelizable**: YES (with 2, 3, 4) | NO | Depends On: -

  **References**:

  **Pattern References** (existing code to follow):
  - docs/idea.md:1-9 - Package metadata (name, author, license, repository)
  - AGENTS.md:CONVENTIONS - Scoped package, zero dependencies, tsup build

  **API/Type References** (contracts to implement against):
  - docs/idea.md:DEFAULT_CONFIG - Configuration structure
  - docs/idea.md:useLogRecorder - Hook return type

  **Documentation References** (specs and requirements):
  - AGENTS.md:PROJECT KNOWLEDGE BASE - Package conventions
  - docs/author.md - Package metadata

  **External References** (libraries and frameworks):
  - Official docs: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html - tsconfig.json structure
  - Official docs: https://tsup.egoist.dev/ - tsup configuration
  - Official docs: https://vitest.dev/ - vitest configuration

  **WHY Each Reference Matters**:
  - docs/idea.md: Package metadata and configuration structure
  - AGENTS.md: Project conventions and build requirements
  - TypeScript/tsup docs: Build configuration best practices

  **Acceptance Criteria**:
  - [ ] Command: `npm init -y` → Creates package.json
  - [ ] `package.json` exists with correct name: `@zaob/glean-debug-logger`
  - [ ] Command: `npm install` → Installs all dependencies
  - [ ] `node_modules/` created with React and dev tools
  - [ ] Command: `ls node_modules | head -20` → Shows installed packages

  **Evidence Required**:
  - [ ] package.json content captured
  - [ ] npm install output showing successful installation

  **Commit**: YES
  - Message: `feat: initialize project with package.json and dependencies`
  - Files: `package.json`, `package-lock.json`, `node_modules/`
  - Pre-commit: `echo "Dependencies installed"`

- [ ] 2. Create TypeScript Configuration (tsconfig.json)

  **What to do**:
  - Create tsconfig.json with appropriate compiler options
  - Configure for library/framework mode (not strict DOM)
  - Set output to ES2020 or higher
  - Enable declaration file generation
  - Configure module resolution (node or nodenext)

  **Must NOT do**:
  - ❌ Don't set strict: false (want full type safety)
  - Don't include DOM types (browser-only, not Node)

  **Parallelizable**: YES (with 1, 3, 4) | NO | Depends On: 1

  **References**:

  **Pattern References** (existing code to follow):
  - AGENTS.md:DUAL FORMAT - CJS + ESM output requirement
  - AGENTS.md:GENERATE .d.ts - Type declaration requirement

  **API/Type References** (contracts to implement against):
  - docs/idea.md:useLogRecorder - Will need proper TypeScript types

  **Documentation References** (specs and requirements):
  - Official docs: https://www.typescriptlang.org/tsconfig - Compiler options

  **External References** (libraries and frameworks):
  - Official docs: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html - Declaration files
  - Reference repo: https://github.com/egoist/tsup - tsup TypeScript setup

  **WHY Each Reference Matters**:
  - AGENTS.md: Confirms need for .d.ts generation and dual format
  - tsup docs: Shows how to configure TypeScript for library builds

  **Acceptance Criteria**:
  - [ ] `tsconfig.json` exists
  - [ ] Command: `npx tsc --noEmit` → No TypeScript errors
  - [ ] `declaration: true` is set
  - [ ] `outDir` and `rootDir` configured

  **Evidence Required**:
  - [ ] tsconfig.json content captured
  - [ ] tsc --noEmit output showing no errors

  **Commit**: YES
  - Message: `chore: add TypeScript configuration`
  - Files: `tsconfig.json`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 3. Create tsup Build Configuration (tsup.config.ts)

  **What to do**:
  - Create tsup.config.ts for building CJS + ESM formats
  - Configure entry points (src/index.ts)
  - Enable TypeScript declaration generation
  - Set format to ['cjs', 'esm']
  - Configure sourcemap: false (as per AGENTS.md)
  - Set dts flag for .d.ts generation
  - Configure minification and tree-shaking

  **Must NOT do**:
  - ❌ Don't enable sourcemap (AGENTS.md: NO source maps)
  - Don't bundle React (peerDependency requirement)

  **Parallelizable**: YES (with 1, 2, 4) | NO | Depends On: 1, 2

  **References**:

  **Pattern References** (existing code to follow):
  - AGENTS.md:BUILD TOOL - tsup for esbuild-based build
  - AGENTS.md:DUAL FORMAT - CJS + ESM output
  - AGENTS.md:NO BUNDLED REACT - Must be peerDependency

  **API/Type References** (contracts to implement against):
  - src/index.ts - Entry point for build

  **Documentation References** (specs and requirements):
  - Official docs: https://tsup.egoist.dev/ - tsup configuration options

  **External References** (libraries and frameworks):
  - Official docs: https://tsup.egoist.dev/#/options - Build options
  - Example config: https://github.com/egoist/tsup/blob/main/src/config.ts - Config patterns

  **WHY Each Reference Matters**:
  - AGENTS.md: Confirms build tool, output formats, no source maps
  - tsup docs: Shows exact configuration for library builds

  **Acceptance Criteria**:
  - [ ] `tsup.config.ts` exists
  - [ ] Command: `npm run build` → Creates dist/ folder
  - [ ] `dist/` contains: index.js, index.mjs, index.d.ts
  - [ ] Bundle size < 20KB (check dist files)

  **Evidence Required**:
  - [ ] tsup.config.ts content captured
  - [ ] npm run build output
  - [ ] ls -la dist/ showing generated files
  - [ ] Bundle size check: `du -h dist/* | head -10`

  **Commit**: YES
  - Message: `chore: configure tsup build`
  - Files: `tsup.config.ts`
  - Pre-commit: `npm run build`

- [ ] 4. Create vitest Test Configuration

  **What to do**:
  - Create vitest.config.ts for testing
  - Configure test environment (jsdom for React testing)
  - Set up coverage provider if needed
  - Configure global API mocks if needed
  - Add test patterns to package.json scripts

  **Must NOT do**:
  - ❌ Don't skip React testing library setup
  - Don't use incompatible coverage tools

  **Parallelizable**: YES (with 1, 2, 3) | NO | Depends On: 1

  **References**:

  **Pattern References** (existing code to follow):
  - AGENTS.md:TEST FRAMEWORK - vitest + @testing-library/react

  **Documentation References** (specs and requirements):
  - Official docs: https://vitest.dev/config/ - vitest configuration
  - Official docs: https://testing-library.com/docs/react-testing-library/intro/ - React testing

  **External References** (libraries and frameworks):
  - Official docs: https://vitest.dev/guide/environment.html - Test environments
  - Example config: https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/config.ts

  **WHY Each Reference Matters**:
  - AGENTS.md: Confirms test framework choice
  - vitest docs: Shows proper configuration for React testing

  **Acceptance Criteria**:
  - [ ] `vitest.config.ts` exists
  - [ ] Command: `npm test` → Shows vitest help/menu
  - [ ] Test pattern configured (files matching *.test.ts)
  - [ ] React testing library works (can import @testing-library/react)

  **Evidence Required**:
  - [ ] vitest.config.ts content captured
  - [ ] npm test output

  **Commit**: YES
  - Message: `chore: configure vitest testing`
  - Files: `vitest.config.ts`
  - Pre-commit: `npm test`

- [ ] 5. Create TypeScript Type Definitions (src/types/index.ts)

  **What to do**:
  - Define LogEntry type with all properties
  - Define LogType union ('CONSOLE' | 'FETCH_REQ' | 'FETCH_RES' | 'FETCH_ERR' | 'XHR_REQ' | 'XHR_RES' | 'XHR_ERR')
  - Define Config interface matching DEFAULT_CONFIG
  - Define HookReturnType with all public methods
  - Define Metadata type for session info
  - Define FilenameTemplate placeholders type

  **Must NOT do**:
  - ❌ Don't use any for types (want full type safety)
  - Don't miss any log types from docs/idea.md

  **Parallelizable**: YES (with 2, 3, 4) | NO | Depends On: -

  **References**:

  **Pattern References** (existing code to follow):
  - docs/idea.md:addLog - Log entry structure
  - docs/idea.md:collectMetadata - Metadata fields
  - docs/idea.md:DEFAULT_CONFIG - Configuration structure

  **API/Type References** (contracts to implement against):
  - src/hooks/useLogRecorder.ts - Will use these types
  - src/components/DebugPanel.tsx - Will use these types

  **Documentation References** (specs and requirements):
  - docs/idea.md:INTERCEPTORS - Console, Fetch, XHR types

  **External References** (libraries and frameworks):
  - Official docs: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html - TypeScript types
  - Reference: https://www.typescriptlang.org/docs/handbook/2/objects.html - Object types

  **WHY Each Reference Matters**:
  - docs/idea.md: Contains exact log entry structures to convert to types
  - TypeScript docs: Best practices for type definitions

  **Acceptance Criteria**:
  - [ ] `src/types/index.ts` exists
  - [ ] Command: `npx tsc --noEmit` → All types valid
  - [ ] All LogType values covered
  - [ ] Config interface complete
  - [ ] HookReturnType includes all exported methods

  **Evidence Required**:
  - [ ] src/types/index.ts content captured
  - [ ] tsc --noEmit output showing no type errors

  **Commit**: YES
  - Message: `feat: add TypeScript type definitions`
  - Files: `src/types/index.ts`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 6. Create Utility Functions (src/utils/)

  **What to do**:
  - Create `src/utils/sanitize.ts` for data sanitization
  - Create `src/utils/filename.ts` for smart filename generation
  - Create `src/utils/index.ts` for exports
  - Implement sanitizeData function with recursive key checking
  - Implement sanitizeFilename function
  - Implement generateFileName function with template replacement
  - Implement collectMetadata function

  **Must NOT do**:
  - ❌ Don't miss any sanitizeKeys from DEFAULT_CONFIG
  - Don't use any placeholders in filename templates

  **Parallelizable**: YES (with 2, 3, 4) | NO | Depends On: 5

  **References**:

  **Pattern References** (existing code to follow):
  - docs/idea.md:sanitizeData - Recursive sanitization logic
  - docs/idea.md:sanitizeFilename - Filename cleaning
  - docs/idea.md:generateFileName - Template replacement
  - docs/idea.md:collectMetadata - Metadata collection

  **API/Type References** (contracts to implement against):
  - src/types/index.ts - Type definitions for utilities
  - src/hooks/useLogRecorder.ts - Will use these utilities

  **Documentation References** (specs and requirements):
  - docs/idea.md:FILE NAMING - All placeholders and examples
  - docs/idea.md:SECURITY - Sanitization requirements

  **External References** (libraries and frameworks):
  - Official docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify - JSON stringify
  - Reference: https://developer.mozilla.org/en-US/docs/Web/API/Navigator - Navigator API for metadata

  **WHY Each Reference Matters**:
  - docs/idea.md: Contains complete utility implementations
  - Navigator docs: For browser metadata collection

  **Acceptance Criteria**:
  - [ ] `src/utils/sanitize.ts` exists and exports sanitizeData
  - [ ] `src/utils/filename.ts` exists and exports generateFileName
  - [ ] `src/utils/index.ts` exports all utilities
  - [ ] sanitizeData correctly redacts keys like 'password', 'token', 'apiKey'
  - [ ] generateFileName correctly replaces all placeholders

  **Evidence Required**:
  - [ ] src/utils/sanitize.ts content captured
  - [ ] src/utils/filename.ts content captured
  - [ ] src/utils/index.ts content captured

  **Commit**: YES
  - Message: `feat: add utility functions for sanitization and filename generation`
  - Files: `src/utils/sanitize.ts`, `src/utils/filename.ts`, `src/utils/index.ts`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 7. Create Main Hook (src/hooks/useLogRecorder.ts)

  **What to do**:
  - Create `src/hooks/useLogRecorder.ts` with full implementation
  - Implement DEFAULT_CONFIG constant
  - Implement useLogRecorder hook with all features:
    - Console log interception
    - Fetch request/response interception
    - XHR request/response interception
    - LocalStorage persistence
    - Download logs (JSON/TXT)
    - Upload logs to server
    - Clear logs functionality
    - Get logs/metadata methods
  - Implement all helper functions (generateSessionId, safeStringify, etc.)
  - Implement cleanup on unmount

  **Must NOT do**:
  - ❌ Don't skip cleanup functions (memory leak risk)
  - Don't miss any interceptors (console, fetch, xhr)
  - Don't implement component code here (separate file)

  **Parallelizable**: NO | Depends On: 5, 6

  **References**:

  **Pattern References** (existing code to follow):
  - docs/idea.md:useLogRecorder - Complete hook implementation (533 lines)
  - docs/idea.md:DEFAULT_CONFIG - Configuration structure
  - AGENTS.md:PEER DEPENDENCY - React as peerDependency

  **API/Type References** (contracts to implement against):
  - src/types/index.ts - Type definitions
  - src/utils/sanitize.ts - Sanitization utilities
  - src/utils/filename.ts - Filename utilities

  **Documentation References** (specs and requirements):
  - docs/idea.md:INTERCEPTORS - Console, Fetch, XHR logic
  - docs/idea.md:PUBLIC API - Download, upload, clear, get methods

  **External References** (libraries and frameworks):
  - Official docs: https://react.dev/reference/react/useEffect - useEffect cleanup patterns
  - Official docs: https://react.dev/reference/react/useCallback - useCallback memoization
  - Reference: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest - XHR interception

  **WHY Each Reference Matters**:
  - docs/idea.md: Contains the complete source code to convert to TypeScript
  - React docs: Proper hook patterns and cleanup
  - MDN: XHR and fetch APIs for interception

  **Acceptance Criteria**:
  - [ ] `src/hooks/useLogRecorder.ts` exists
  - [ ] Command: `npx tsc --noEmit` → No TypeScript errors
  - [ ] Hook exports: downloadLogs, uploadLogs, clearLogs, getLogs, getLogCount, getMetadata, sessionId
  - [ ] Console.log is intercepted and recorded
  - [ ] Fetch requests are intercepted and recorded
  - [ ] XHR requests are intercepted and recorded
  - [ ] LocalStorage persistence works
  - [ ] Download creates blob with correct format

  **Evidence Required**:
  - [ ] src/hooks/useLogRecorder.ts content captured
  - [ ] tsc --noEmit output showing no errors
  - [ ] Manual test of hook in test component

  **Commit**: YES
  - Message: `feat: implement useLogRecorder hook with all features`
  - Files: `src/hooks/useLogRecorder.ts`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 8. Create DebugPanel Components (src/components/)

  **What to do**:
  - Create `src/components/DebugPanel.tsx` with full implementation
    - Floating toggle button
    - Session stats display (total logs, errors, network errors)
    - Session info metadata preview
    - Download buttons (JSON, TXT)
    - Upload button with status display
    - Clear logs button
    - Keyboard shortcut (Ctrl+Shift+D)
    - Auto-upload on critical errors
  - Create `src/components/DebugPanelMinimal.tsx` with basic features
    - Simple floating button
    - Download JSON
    - Clear logs
  - Create `src/components/index.ts` for exports

  **Must NOT do**:
  - ❌ Don't implement hook logic here (use existing hook)
  - Don't include backend code (examples are separate)

  **Parallelizable**: NO | Depends On: 7

  **References**:

  **Pattern References** (existing code to follow):
  - docs/idea.md:DebugPanel.jsx - Complete component implementation (361 lines)
  - docs/idea.md:DebugPanelMinimal.jsx - Minimal version
  - AGENTS.md:COMPONENTS - DebugPanel structure

  **API/Type References** (contracts to implement against):
  - src/hooks/useLogRecorder.ts - Hook return type
  - src/types/index.ts - Metadata types

  **Documentation References** (specs and requirements):
  - docs/idea.md:KEYBOARD SHORTCUT - Ctrl+Shift+D toggle
  - docs/idea.md:AUTO-UPLOAD - Error threshold upload

  **External References** (libraries and frameworks):
  - Official docs: https://react.dev/reference/react/useState - useState for UI state
  - Official docs: https://react.dev/reference/react/useEffect - Keyboard shortcuts
  - Reference: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent - Keyboard events

  **WHY Each Reference Matters**:
  - docs/idea.md: Contains complete component implementations
  - React docs: Proper component patterns
  - MDN: Keyboard event handling

  **Acceptance Criteria**:
  - [ ] `src/components/DebugPanel.tsx` exists
  - [ ] `src/components/DebugPanelMinimal.tsx` exists
  - [ ] `src/components/index.ts` exports both components
  - [ ] Command: `npx tsc --noEmit` → No TypeScript errors
  - [ ] Floating button appears on page
  - [ ] Ctrl+Shift+D toggles panel
  - [ ] Download buttons work
  - [ ] Upload button works
  - [ ] Clear button works

  **Evidence Required**:
  - [ ] src/components/DebugPanel.tsx content captured
  - [ ] src/components/DebugPanelMinimal.tsx content captured
  - [ ] src/components/index.ts content captured
  - [ ] tsc --noEmit output showing no errors
  - [ ] Component renders correctly in test app

  **Commit**: YES
  - Message: `feat: implement DebugPanel components`
  - Files: `src/components/DebugPanel.tsx`, `src/components/DebugPanelMinimal.tsx`, `src/components/index.ts`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 9. Create Main Export File (src/index.ts)

  **What to do**:
  - Create `src/index.ts` with all exports
  - Export useLogRecorder from hooks
  - Export DebugPanel and DebugPanelMinimal from components
  - Export all utilities
  - Export all types
  - Add JSDoc comments for documentation

  **Must NOT do**:
  - ❌ Don't re-export from subdirectories (use explicit paths)

  **Parallelizable**: YES (with 8) | NO | Depends On: 5, 6, 7, 8

  **References**:

  **Pattern References** (existing code to follow):
  - AGENTS.md:NO DEFAULT EXPORTS - Use named exports for tree-shaking
  - Common patterns: Export all from single entry point

  **API/Type References** (contracts to implement against):
  - src/hooks/useLogRecorder.ts - Hook export
  - src/components/DebugPanel.tsx - Component exports
  - src/utils/index.ts - Utility exports
  - src/types/index.ts - Type exports

  **Documentation References** (specs and requirements):
  - AGENTS.md:EXPORT STRUCTURE - Named exports for tree-shaking

  **External References** (libraries and frameworks):
  - Reference: https://www.typescriptlang.org/docs/handbook/declaration-files/module-examples.html - Module exports
  - Example: https://github.com/DefinitelyTyped/DefinitelyTyped - TypeScript export patterns

  **WHY Each Reference Matters**:
  - AGENTS.md: Confirms named export requirement
  - TypeScript docs: Proper module export patterns

  **Acceptance Criteria**:
  - [ ] `src/index.ts` exists
  - [ ] Command: `npx tsc --noEmit` → No TypeScript errors
  - [ ] All exports are available via named imports
  - [ ] Import statement works: `import { useLogRecorder, DebugPanel } from '@zaob/glean-debug-logger'`

  **Evidence Required**:
  - [ ] src/index.ts content captured
  - [ ] tsc --noEmit output showing no errors
  - [ ] Import test in test file

  **Commit**: YES
  - Message: `feat: create main export file`
  - Files: `src/index.ts`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 10. Build Verification

  **What to do**:
  - Run `npm run build` to verify all source compiles
  - Check dist/ folder for generated files
  - Verify CJS and ESM formats exist
  - Verify .d.ts files generated
  - Check bundle sizes
  - Test import in external file

  **Must NOT do**:
  - ❌ Don't skip build verification
  - Don't proceed if build fails

  **Parallelizable**: NO | Depends On: 1-9

  **References**:

  **Pattern References** (existing code to follow):
  - AGENTS.md:BUNDLE SIZE - Must stay under 20KB
  - AGENTS.md:DUAL FORMAT - CJS + ESM output

  **API/Type References** (contracts to implement against):
  - tsup.config.ts - Build configuration
  - src/index.ts - Entry point

  **Documentation References** (specs and requirements):
  - AGENTS.md:SUCCESS CRITERIA - Build completion check

  **External References** (libraries and frameworks):
  - Official docs: https://tsup.egoist.dev/ - Build output verification

  **WHY Each Reference Matters**:
  - AGENTS.md: Confirms build requirements
  - tsup docs: Shows how to verify build output

  **Acceptance Criteria**:
  - [ ] Command: `npm run build` → Success (exit code 0)
  - [ ] `dist/index.js` exists (CJS format)
  - [ ] `dist/index.mjs` exists (ESM format)
  - [ ] `dist/index.d.ts` exists (TypeScript declarations)
  - [ ] Bundle size < 20KB (check with `du -h dist/index.js`)
  - [ ] Import works: `import { useLogRecorder } from './dist/index.js'`

  **Evidence Required**:
  - [ ] npm run build output
  - [ ] ls -la dist/ showing all generated files
  - [ ] Bundle size check: `du -h dist/*`
  - [ ] Import test output

  **Commit**: YES
  - Message: `chore: verify build output`
  - Files: `dist/` (build artifacts)
  - Pre-commit: `npm run build`

- [ ] 11. Create Backend Examples (examples/)

  **What to do**:
  - Create `examples/nextjs-file-system/` with Next.js API Route implementation
  - Create `examples/s3-upload/` with AWS S3 upload example
  - Create `examples/supabase-storage/` with Supabase Storage example
  - Create `examples/postgresql/` with PostgreSQL database example
  - Create `examples/secure-api/` with rate limiting + auth example
  - Create README.md for examples folder explaining usage

  **Must NOT do**:
  - ❌ Don't include backend code in main package
  - Don't modify source code (keep examples separate)

  **Parallelizable**: NO | Depends On: -

  **References**:

  **Pattern References** (existing code to follow):
  - docs/idea.md:backend-upload - All backend examples (lines 8901-12367)
  - AGENTS.md:EXAMPLES FOLDER - User choice to separate examples

  **API/Type References** (contracts to implement against):
  - src/hooks/useLogRecorder.ts - uploadLogs API

  **Documentation References** (specs and requirements):
  - docs/idea.md:UPLOAD ENDPOINT - Server-side upload patterns
  - docs/idea.md:RATE LIMITING - Rate limiter implementation

  **External References** (libraries and frameworks):
  - Official docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers - Next.js API routes
  - Official docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html - AWS S3
  - Official docs: https://supabase.com/docs/reference/javascript/storage - Supabase Storage

  **WHY Each Reference Matters**:
  - docs/idea.md: Contains complete backend implementations
  - Official docs: Shows proper API patterns for each service

  **Acceptance Criteria**:
  - [ ] `examples/` folder created
  - [ ] `examples/nextjs-file-system/` exists with route.js
  - [ ] `examples/s3-upload/` exists with route.js
  - [ ] `examples/supabase-storage/` exists with route.js
  - [ ] `examples/postgresql/` exists with route.js
  - [ ] `examples/secure-api/` exists with route.js
  - [ ] `examples/README.md` explains usage

  **Evidence Required**:
  - [ ] ls -la examples/ showing all subfolders
  - [ ] Each example has route.js file
  - [ ] README.md content captured

  **Commit**: YES
  - Message: `docs: add backend upload examples`
  - Files: `examples/`, `examples/**/*`
  - Pre-commit: `echo "Examples created"`

- [ ] 12. Add Tests (Tests-After)

  **What to do**:
  - Create `src/hooks/useLogRecorder.test.ts` with comprehensive tests
  - Test hook initialization
  - Test console log interception
  - Test fetch interception
  - Test xhr interception
  - Test sanitization behavior
  - Test filename generation
  - Test download functionality
  - Test upload functionality
  - Create `src/components/DebugPanel.test.tsx` for component tests
  - Test component rendering
  - Test interaction handlers

  **Must NOT do**:
  - ❌ Don't write tests before implementation (Tests-After approach)

  **Parallelizable**: NO | Depends On: 7, 8

  **References**:

  **Pattern References** (existing code to follow):
  - AGENTS.md:TEST FRAMEWORK - vitest + @testing-library/react
  - docs/idea.md:TEST PATTERNS - Test scenarios from implementation

  **API/Type References** (contracts to implement against):
  - src/hooks/useLogRecorder.ts - Functions to test
  - src/components/DebugPanel.tsx - Component to test

  **Documentation References** (specs and requirements):
  - Official docs: https://vitest.dev/api/ - vitest API
  - Official docs: https://testing-library.com/docs/react-testing-library/intro/ - React testing

  **External References** (libraries and frameworks):
  - Official docs: https://vitest.dev/guide/using-dom.html - DOM testing with jsdom
  - Reference: https://github.com/testing-library/react-testing-library - React testing examples

  **WHY Each Reference Matters**:
  - AGENTS.md: Confirms test framework
  - vitest/React docs: Shows testing best practices

  **Acceptance Criteria**:
  - [ ] `src/hooks/useLogRecorder.test.ts` exists
  - [ ] `src/components/DebugPanel.test.tsx` exists
  - [ ] Command: `npm test` → Runs all tests
  - [ ] All tests pass (0 failures)
  - [ ] Test coverage: Hook functionality tested
  - [ ] Test coverage: Component rendering tested

  **Evidence Required**:
  - [ ] npm test output showing test results
  - [ ] Test file contents captured
  - [ ] Coverage report if available

  **Commit**: YES
  - Message: `test: add comprehensive test suite`
  - Files: `src/**/*.test.ts`, `src/**/*.test.tsx`
  - Pre-commit: `npm test`

- [ ] 13. Create README Documentation

  **What to do**:
  - Create `README.md` with comprehensive documentation
  - Installation instructions
  - Basic usage example
  - API reference for useLogRecorder
  - DebugPanel component usage
  - Configuration options
  - Filename templates documentation
  - Backend upload examples reference
  - TypeScript support

  **Must NOT do**:
  - ❌ Don't include backend code (reference examples/ instead)

  **Parallelizable**: NO | Depends On: 7, 8, 11

  **References**:

  **Pattern References** (existing code to follow):
  - AGENTS.md:DOCUMENTATION - README requirements
  - docs/idea.md:QUICK START - Usage examples

  **API/Type References** (contracts to implement against):
  - src/hooks/useLogRecorder.ts - API documentation
  - src/types/index.ts - Type documentation

  **Documentation References** (specs and requirements):
  - docs/idea.md:QUICK START - Installation and basic usage
  - docs/idea.md:FILE NAMING - Filename template documentation

  **External References** (libraries and frameworks):
  - Reference: https://github.com/facebook/react - Standard React README pattern
  - Example: https://github.com/egoist/tsup - Library README pattern

  **WHY Each Reference Matters**:
  - docs/idea.md: Contains usage examples and configuration
  - Common patterns: Standard library README structure

  **Acceptance Criteria**:
  - [ ] `README.md` exists
  - [ ] Installation section: `npm install @zaob/glean-debug-logger`
  - [ ] Usage section with code example
  - [ ] API reference for all hook methods
  - [ ] Configuration options documented
  - [ ] Filename templates documented
  - [ ] Reference to examples/ folder

  **Evidence Required**:
  - [ ] README.md content captured
  - [ ] README length check (should be comprehensive)

  **Commit**: YES
  - Message: `docs: add comprehensive README`
  - Files: `README.md`
  - Pre-commit: `echo "Documentation complete"`

- [ ] 14. Final Verification and Cleanup

  **What to do**:
  - Run full build: `npm run build`
  - Run all tests: `npm test`
  - Check bundle sizes
  - Verify all files committed
  - Tag commit if appropriate
  - Clean up any temporary files

  **Must NOT do**:
  - ❌ Don't skip any verification step

  **Parallelizable**: NO | Depends On: 1-13

  **References**:

  **Pattern References** (existing code to follow):
  - AGENTS.md:DEFINITION OF DONE - All completion criteria

  **API/Type References** (contracts to implement against):
  - package.json - Build and test scripts
  - All source files - Final verification

  **Documentation References** (specs and requirements):
  - AGENTS.md:SUCCESS CRITERIA - Final checklist

  **External References** (libraries and frameworks):
  - Reference: https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History - Git commit verification

  **Acceptance Criteria**:
  - [ ] Command: `npm run build` → Success
  - [ ] Command: `npm test` → All tests pass
  - [ ] Bundle size < 20KB
  - [ ] TypeScript declarations generated
  - [ ] All files committed to git
  - [ ] Clean working tree (no uncommitted changes)

  **Evidence Required**:
  - [ ] npm run build output
  - [ ] npm test output
  - [ ] Bundle size verification
  - [ ] git status output
  - [ ] git log --oneline showing final commit

  **Commit**: YES
  - Message: `chore: final verification and cleanup`
  - Files: All project files
  - Pre-commit: `npm run build && npm test`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat: initialize project with package.json and dependencies` | package.json, package-lock.json, node_modules/ | npm install success |
| 2 | `chore: add TypeScript configuration` | tsconfig.json | tsc --noEmit |
| 3 | `chore: configure tsup build` | tsup.config.ts | npm run build |
| 4 | `chore: configure vitest testing` | vitest.config.ts | npm test |
| 5 | `feat: add TypeScript type definitions` | src/types/index.ts | tsc --noEmit |
| 6 | `feat: add utility functions` | src/utils/* | tsc --noEmit |
| 7 | `feat: implement useLogRecorder hook` | src/hooks/useLogRecorder.ts | tsc --noEmit |
| 8 | `feat: implement DebugPanel components` | src/components/* | tsc --noEmit |
| 9 | `feat: create main export file` | src/index.ts | tsc --noEmit |
| 10 | `chore: verify build output` | dist/* | npm run build |
| 11 | `docs: add backend upload examples` | examples/* | ls examples/ |
| 12 | `test: add comprehensive test suite` | src/**/*.test.ts* | npm test |
| 13 | `docs: add comprehensive README` | README.md | File exists |
| 14 | `chore: final verification and cleanup` | All files | npm run build && npm test |

---

## Success Criteria

### Verification Commands
```bash
npm run build    # Creates dist/ with CJS + ESM + .d.ts
npm test         # Runs vitest suite, all tests pass
du -h dist/*     # Bundle size < 20KB
npx tsc --noEmit # No TypeScript errors
```

### Final Checklist
- [ ] All "Must Have" present (see above)
- [ ] All "Must NOT Have" absent (see guardrails)
- [ ] `npm run build` succeeds
- [ ] `npm test` passes (all tests)
- [ ] Bundle size < 20KB
- [ ] TypeScript declarations generated
- [ ] CJS and ESM formats available
- [ ] Backend examples in examples/ folder
- [ ] README documentation complete
- [ ] Clean git history (all committed)
- [ ] Zero runtime dependencies (React peer only)
