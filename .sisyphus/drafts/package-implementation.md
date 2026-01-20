# Draft: @zaob/glean-debug-logger Implementation

## Project Overview
React/Next.js debug logging library that captures console logs, network requests (Fetch + XHR), exports with smart filenames, and supports server upload.

**Package Info** (from docs/author.md):
- Name: `@zaob/glean-debug-logger`
- Author: Zaob <zaob.ogn@gmail.com>
- License: MIT
- Repository: https://github.com/maemreyo/glean-debug-logger.git

**Core Features** (FULL FEATURE SET):
1. `useLogRecorder` hook - captures console.log, Fetch, XHR
2. Smart filename templates with rich metadata
3. Auto-sanitization of sensitive data (password, token, apiKey, secret)
4. DebugPanel component (full + minimal versions)
5. Multiple backend upload options (Next.js, S3, Supabase, PostgreSQL)
6. LocalStorage persistence
7. Auto-upload on error feature

## Current State
- **src/ folder**: DOES NOT EXIST - needs creation
- **package.json**: DOES NOT EXIST - needs creation
- **Implementation specs**: In docs/idea.md (complete code provided)
- **Test infrastructure**: None yet
- **Build tool**: tsup (esbuild-based)

## Requirements (from docs/idea.md)

### Files to Create
1. **src/hooks/useLogRecorder.ts** - Main hook
2. **src/components/DebugPanel.tsx** - Full debug panel
3. **src/components/DebugPanelMinimal.tsx** - Minimal version
4. **src/utils/** - Utility functions
5. **src/types/** - TypeScript definitions
6. **src/index.ts** - Main export file

### Configuration Files Needed
1. **package.json** - Package config with peer dependencies
2. **tsconfig.json** - TypeScript configuration
3. **tsup.config.ts** - Build configuration (CJS + ESM)
4. **.eslintrc.js** - Linting rules
5. **.npmignore** - Package ignore patterns
6. **vitest.config.ts** - Test configuration

### Backend Examples Folder
- **examples/** - Separate folder for backend implementations
  - `examples/nextjs-file-system/` - Next.js API Route
  - `examples/s3-upload/` - AWS S3 upload
  - `examples/supabase-storage/` - Supabase Storage
  - `examples/postgresql/` - PostgreSQL database
  - `examples/secure-api/** - Rate limiting + auth

## Technical Decisions (CONFIRMED)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Language** | TypeScript | Better type safety, IDE support |
| **Test Framework** | vitest + @testing-library/react | Lightweight, fast, React-friendly |
| **Backend Examples** | Separate `examples/` folder | Keep package lean, reference material |
| **Scope** | Full feature set | All features from docs/idea.md |

## Build Requirements
- Scoped package: `@zaob/glean-debug-logger`
- Build tool: `tsup`
- Output formats: CJS + ESM
- Type declarations: `.d.ts`
- Zero runtime dependencies (React as peerDependency)
- Bundle size limit: < 20KB

## Test Strategy Decision (PENDING - FINAL QUESTION)

**Test infrastructure will be set up.** How should tests be structured?

| Option | Approach | When to Use |
|--------|----------|-------------|
| **TDD (Test-Driven Development)** | RED-GREEN-REFACTOR - Write tests first, then implementation | New codebase, ensures test coverage from start |
| **Tests-After** | Implement first, add tests after | Faster initial implementation, verify functionality |

**My recommendation**: Tests-After for this project (faster to get initial version out), then add comprehensive tests.

**Your preference?**

