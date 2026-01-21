# DX Improvement Plan: GleanDebugger Component

## Context

### Original Request

User wants to improve DX for glean-debug-logger by creating a drop-in `GleanDebugger` component that enables zero-config integration with automatic production hiding and URL/localStorage/console activation patterns.

### Interview Summary

**Key Discussions**:

- User analyzed current DX pain points: 3 files + ~50 lines code needed for basic integration
- Proposed solution: Single default export component with smart defaults
- Confirmed activation patterns:
  - URL param: `?debug=true`
  - LocalStorage key: `glean-debug-enabled`
  - Console namespace: `window.glean`
  - Production commands: `console.warn` only
  - Collision handling: Warn + skip (console.warn if conflict)
- Priority: Create GleanDebugger component with activation detection and console API

**Research Findings**:

- DebugPanel already has `'use client'` directive (line 1)
- Current `shouldShow` logic: `showInProduction || environment === 'development' || user?.role === 'admin'`
- No localStorage fallback currently
- No URL param detection currently
- No console commands currently
- Named exports only from `index.ts` (tree-shaking requirement)
- Zero runtime deps constraint (<20KB bundle size)
- SSR safety patterns: `typeof window !== 'undefined'` guards throughout

### Metis Review

**Identified Gaps (addressed in this plan)**:

1. SSR hydration mismatch risk → Added `suppressHydrationWarning` and proper state management
2. Namespace collision (`window.glean`) → Added warn + skip strategy with console.warn
3. Console commands in production → Added `console.warn` pattern, no console.log
4. Bundle size budget → Added <5KB target for new component, <20KB total
5. TypeScript breaking changes → Added explicit type export policy
6. Memory leaks → Added complete cleanup logic for all global state
7. Multiple instances → Added first-wins pattern with warning
8. localStorage in private browsing → Added try/catch for all localStorage operations

**Guardrails Applied** (from Metis review):

- MUST NOT add runtime dependencies beyond React
- MUST be tree-shakeable (follow named exports pattern)
- Console commands must `console.warn` in production (no console.log)
- MUST handle SSR hydration gracefully
- MUST clean up all global state on unmount
- MUST try/catch all localStorage operations (private browsing safe)
- MUST NOT add additional activation methods beyond scope
- MUST NOT add configuration props beyond position

---

## Work Objectives

### Core Objective

Create `GleanDebugger` component that enables 1-line drop-in integration:

```tsx
import { GleanDebugger } from '@zaob/glean-debug-logger';
<GleanDebugger />;
```

### Concrete Deliverables

1. `src/components/GleanDebugger.tsx` - New drop-in component with activation detection
2. `src/index.ts` - Updated exports (add GleanDebugger named export)
3. Console commands API via `window.glean` namespace
4. Activation detection: URL param + localStorage

### Definition of Done

- [ ] `GleanDebugger` renders when `?debug=true` is present
- [ ] `GleanDebugger` renders when `localStorage.getItem('glean-debug-enabled')` is truthy
- [ ] `window.glean.show()` makes debugger visible
- [ ] `window.glean.hide()` hides debugger
- [ ] `window.glean.toggle()` inverts visibility
- [ ] `window.glean.export()` triggers log export
- [ ] `window.glean.clear()` clears logs
- [ ] `window.glean.isEnabled()` returns boolean
- [ ] Debugger auto-hides in production unless activated
- [ ] Console commands `console.warn` in production (no console.log)
- [ ] Console warns once if namespace conflict exists, then skips
- [ ] Bundle size impact < 5KB
- [ ] SSR-safe (no hydration mismatches)
- [ ] TypeScript types complete and exported
- [ ] Cleanup complete on unmount (no memory leaks)

### Must Have

- Single named export component (GleanDebugger)
- Zero-config defaults (auto-hide in production)
- URL param activation (`?debug=true`)
- LocalStorage activation (`glean-debug-enabled`)
- Console commands (`window.glean.show/hide/toggle/export/clear/isEnabled`)
- Non-breaking with existing API
- SSR-safe implementation

### Must NOT Have (Guardrails)

- No theming/customization options
- No React Context provider (useLogRecorder exists)
- No modification to existing DebugPanel.tsx
- No new runtime dependencies
- No breaking changes to existing types
- No auto-trigger logic (explicit activation only)
- No additional activation methods (cookie, IP-based, etc.)
- No custom command registration
- No position prop (fixed to standard position)

---

## Verification Strategy

### Test Decision

- **Infrastructure exists**: YES (vitest in package.json)
- **User wants tests**: NO (manual verification only for this DX improvement)
- **Framework**: N/A (manual verification)

### Manual Execution Verification

**For Activation Detection:**

- [ ] Navigate to `http://localhost:3000/?debug=true`
  - Verify: Debug panel appears within 200ms
- [ ] Navigate to `http://localhost:3000/` (no param)
  - Verify: Debug panel is hidden in production mode
- [ ] Run in console: `localStorage.setItem('glean-debug-enabled', 'true')`
  - Verify: Debug panel appears
- [ ] Run in console: `localStorage.removeItem('glean-debug-enabled')`
  - Verify: Debug panel hides

**For Console Commands:**

- [ ] Run in console: `window.glean.show()`
  - Verify: Debug panel appears
- [ ] Run in console: `window.glean.hide()`
  - Verify: Debug panel hides
- [ ] Run in console: `window.glean.toggle()`
  - Verify: Debug panel visibility toggles
- [ ] Run in console: `window.glean.export()`
  - Verify: Export dialog opens or logs download
- [ ] Run in console: `window.glean.clear()`
  - Verify: Logs are cleared
- [ ] Run in console: `window.glean.isEnabled()`
  - Verify: Returns boolean (true/false)

**For Production Mode:**

- [ ] Set `NODE_ENV=production`
  - Verify: Debug panel is hidden by default
  - Verify: `?debug=true` still activates it
  - Verify: Console commands show warning only (no log spam)

**For SSR Safety:**

- [ ] Check server logs during SSR render
  - Verify: No errors from window/document access
- [ ] Check browser console for hydration warnings
  - Verify: No hydration mismatch errors

**For Namespace Conflict:**

- [ ] Pre-set: `window.glean = { test: true }`
  - Verify: Console warns once about conflict
  - Verify: Our commands are not registered
  - Verify: Original `window.glean.test` remains accessible

**For Cleanup:**

- [ ] Mount component, call `window.glean.show()`, unmount component
  - Verify: `window.glean` is undefined after unmount
- [ ] Mount/unmount 10 times
  - Verify: No memory growth (check dev tools)

**Evidence Required:**

- [ ] Screenshot of debug panel visible with ?debug=true
- [ ] Screenshot of console warnings for namespace conflict
- [ ] Terminal output showing no SSR errors

---

## Task Flow

```
GleanDebugger.tsx → index.ts exports → Console commands → Testing
     ↓                  ↓                    ↓
(creates core       (adds export)      (adds global API)
 component)
```

## Parallelization

| Group | Tasks | Reason                                        |
| ----- | ----- | --------------------------------------------- |
| A     | 1, 2  | Independent (GleanDebugger + exports)         |
| B     | 3, 4  | Related (activation logic + console commands) |

| Task        | Depends On | Reason                                  |
| ----------- | ---------- | --------------------------------------- |
| 5 (Testing) | 1, 2, 3, 4 | Full verification requires all features |

---

## TODOs

- [ ] 1. Create GleanDebugger.tsx component

  **What to do**:
  - Create `src/components/GleanDebugger.tsx` file
  - Add `'use client'` directive at top
  - Import `DebugPanel` from `./DebugPanel`
  - Create `useGleanActivation` hook for URL + localStorage detection
  - Create `useConsoleCommands` hook for `window.glean` API
  - Implement namespace collision handling (warn + skip)
  - Add proper cleanup on unmount
  - Export as named function component (not default)

  **Enhanced shouldShow logic**:

  ```typescript
  const shouldShow = useMemo(() => {
    // Original logic
    const original = showInProduction || environment === 'development' || user?.role === 'admin';

    // New activation patterns
    const urlParam =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('debug') === 'true'
        : false;

    const localStorageEnabled = (() => {
      try {
        return (
          typeof window !== 'undefined' && localStorage.getItem('glean-debug-enabled') === 'true'
        );
      } catch {
        return false; // Private browsing mode
      }
    })();

    return original || urlParam || localStorageEnabled;
  }, [showInProduction, environment, user]);
  ```

  **Must NOT do**:
  - Add any configuration props beyond position
  - Create React Context
  - Add theming options
  - Modify existing DebugPanel.tsx
  - Add additional activation methods (cookie, IP, etc.)

  **Parallelizable**: YES (with 2)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `src/components/DebugPanel.tsx:1` - Use `'use client'` directive pattern
  - `src/components/DebugPanel.tsx:30-47` - DebugPanelProps interface structure
  - `src/components/DebugPanel.tsx:264-266` - Current shouldShow logic (to enhance, not replace)
  - `src/hooks/useLogRecorder.ts:18-30` - Default config pattern for sensible defaults
  - `src/hooks/useLogRecorder.ts:151-153` - localStorage with typeof window guard
  - `src/hooks/useLogRecorder.ts:183-185` - Initialization guard pattern

  **Hook References** (patterns to follow):
  - `src/hooks/useLogRecorder.ts` - Hook creation patterns (useEffect, useCallback, useMemo)
  - `src/components/DebugPanel.tsx:50-65` - useState hooks for UI state

  **TypeScript References** (contracts to implement against):
  - `src/types/index.ts:30-47` - DebugPanelProps type definition
  - `src/types/index.ts:100-130` - LogRecorderConfig for reference

  **External References** (libraries and frameworks):
  - URLSearchParams API: Standard Web API for URL param parsing
  - localStorage API: Standard Web API for persistence

  **WHY Each Reference Matters**:
  - DebugPanel.tsx shows the exact interface we need to wrap
  - useLogRecorder.ts shows hook patterns for state and effects
  - Current shouldShow logic shows what we're enhancing (not replacing)
  - localStorage with try/catch pattern from useLogRecorder

  **Acceptance Criteria**:

  **Manual Execution Verification (ALWAYS include, even with tests)**:

  _For Component/UI changes:_
  - [ ] File created: `src/components/GleanDebugger.tsx`
  - [ ] Contains `'use client'` directive
  - [ ] Imports DebugPanel successfully
  - [ ] Compiles without TypeScript errors

  **Evidence Required:**
  - [ ] TypeScript compilation output showing no errors
  - [ ] File content verification (cat src/components/GleanDebugger.tsx)

  **Commit**: YES
  - Message: `feat(components): add GleanDebugger drop-in component`
  - Files: `src/components/GleanDebugger.tsx`
  - Pre-commit: `npm run typecheck`

- [ ] 2. Update index.ts exports

  **What to do**:
  - Add `export { default as GleanDebugger } from './components/GleanDebugger';`
  - Add TypeScript type export if needed
  - Verify tree-shaking still works (named exports pattern preserved)

  **Must NOT do**:
  - Remove any existing exports
  - Change existing export syntax from named to default (except GleanDebugger)

  **Parallelizable**: YES (with 1)

  **References**:
  - `src/index.ts:1-20` - Current export pattern (maintain consistency)

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [ ] File updated: `src/index.ts`
  - [ ] GleanDebugger export added
  - [ ] Named exports pattern preserved
  - [ ] Tree-shaking test: `import { DebugPanel, GleanDebugger }` both available

  **Evidence Required:**
  - [ ] Terminal output showing export added
  - [ ] Build output confirming exports

  **Commit**: YES
  - Message: `feat(index): export GleanDebugger component`
  - Files: `src/index.ts`
  - Pre-commit: `npm run typecheck`

- [ ] 3. Implement activation detection hook

  **What to do**:
  - Create `useGleanActivation` hook in GleanDebugger.tsx
  - Detect URL param: `new URLSearchParams(window.location.search).get('debug') === 'true'`
  - Detect localStorage: `localStorage.getItem('glean-debug-enabled') === 'true'` (with try/catch)
  - Combine with existing logic: `showInProduction || environment === 'development' || user?.role === 'admin' || urlParam || localStorage`
  - Handle SSR gracefully (check typeof window)

  **Activation precedence**:
  1. localStorage takes precedence over URL param (persisted > transient)
  2. Original logic still applies (dev mode, admin role, showInProduction)

  **Must NOT do**:
  - Modify existing DebugPanel shouldShow logic
  - Add auto-trigger logic (explicit activation only)
  - Add additional activation methods

  **References**:
  - `src/components/DebugPanel.tsx:264-266` - Current shouldShow logic
  - `src/services/FileService.ts:7` - SSR check pattern (`typeof window`)
  - `src/hooks/useLogRecorder.ts:151-153` - localStorage with try/catch

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [ ] URL param `?debug=true` activates panel
  - [ ] URL param `?debug=false` hides panel
  - [ ] localStorage enables panel (with try/catch safety)
  - [ ] localStorage removal hides panel
  - [ ] Development mode shows by default
  - [ ] Production mode hides by default
  - [ ] Production with activation shows panel
  - [ ] Private browsing mode doesn't throw errors

  **Evidence Required:**
  - [ ] Console logs showing activation detection working

  **Commit**: YES (part of task 1)

- [ ] 4. Implement console commands API

  **What to do**:
  - Create `window.glean` namespace with:
    - `show()`: Set localStorage and show panel
    - `hide()`: Remove localStorage and hide panel
    - `toggle()`: Invert visibility
    - `export()`: Trigger log export
    - `clear()`: Clear logs
    - `isEnabled()`: Return current state
  - Add namespace collision check (warn + skip pattern)
  - Make commands `console.warn` in production mode (no console.log)
  - Clean up on unmount (remove from window)

  **Production behavior**:

  ```typescript
  const isProduction = process.env.NODE_ENV === 'production';

  const commands = isProduction
    ? {
        show: () => console.warn('[GleanDebugger] Debug mode is disabled in production'),
        hide: () => console.warn('[GleanDebugger] Debug mode is disabled in production'),
        toggle: () => console.warn('[GleanDebugger] Debug mode is disabled in production'),
        export: () => console.warn('[GleanDebugger] Debug mode is disabled in production'),
        clear: () => console.warn('[GleanDebugger] Debug mode is disabled in production'),
        isEnabled: () => false,
      }
    : {
        show: () => {
          localStorage.setItem('glean-debug-enabled', 'true');
        },
        hide: () => {
          localStorage.removeItem('glean-debug-enabled');
        },
        toggle: () => {
          /* toggle logic */
        },
        export: () => {
          /* trigger export */
        },
        clear: () => {
          /* clear logs */
        },
        isEnabled: () => true,
      };
  ```

  **Namespace collision handling**:

  ```typescript
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.glean !== undefined) {
        console.warn('[GleanDebugger] window.glean already exists. Skipping registration.');
        return;
      }
      window.glean = commands;
    }
    return () => {
      if (typeof window !== 'undefined' && window.glean === commands) {
        delete window.glean;
      }
    };
  }, []);
  ```

  **Must NOT do**:
  - Expose any sensitive data through console
  - Create permanent global state (must clean up)
  - Add custom command registration
  - Use console.log in production (must use console.warn)

  **References**:
  - `src/services/FileService.ts:7-15` - Window access pattern
  - `src/components/DebugPanel.tsx:70-95` - useEffect for event listeners

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [ ] `window.glean` exists in console
  - [ ] `window.glean.show()` shows panel
  - [ ] `window.glean.hide()` hides panel
  - [ ] `window.glean.toggle()` toggles visibility
  - [ ] `window.glean.export()` triggers export
  - [ ] `window.glean.clear()` clears logs
  - [ ] `window.glean.isEnabled()` returns boolean
  - [ ] Commands work in development
  - [ ] Commands console.warn in production (no console.log)
  - [ ] Console warns once for namespace conflict
  - [ ] Unmounting component removes `window.glean`

  **Evidence Required:**
  - [ ] Console screenshot showing `window.glean` API
  - [ ] Console screenshot showing commands working
  - [ ] Console screenshot showing production warning

  **Commit**: YES (part of task 1)

- [ ] 5. Final integration testing

  **What to do**:
  - Test all activation patterns work together
  - Test SSR safety (no hydration mismatches)
  - Test cleanup on unmount
  - Test multiple rapid enable/disable calls
  - Test namespace collision handling
  - Test production mode behavior
  - Test private browsing mode (no errors)

  **Must NOT do**:
  - Skip edge case testing

  **References**:
  - `src/components/DebugPanel.tsx:1-30` - Full component structure

  **Acceptance Criteria**:

  **Manual Execution Verification (COMPLETE):**

  _Activation Patterns:_
  - [ ] URL param works: `?debug=true`
  - [ ] localStorage works: `glean-debug-enabled=true`
  - [ ] Console commands work: `window.glean.show()`
  - [ ] Development mode shows by default
  - [ ] Production mode hides by default

  _Edge Cases:_
  - [ ] Multiple rapid enable/disable calls (no crash)
  - [ ] Component unmount while visible (cleanup complete)
  - [ ] SSR hydration (no mismatch errors)
  - [ ] Namespace collision (warn + skip)
  - [ ] Private browsing (try/catch prevents errors)

  _Production Safety:_
  - [ ] Console commands are console.warn in production
  - [ ] Panel hidden by default in production
  - [ ] Activation still works in production

  _Bundle Size:_
  - [ ] New component < 5KB
  - [ ] Total library still < 20KB

  _Cleanup:_
  - [ ] window.glean removed after unmount
  - [ ] No memory leaks after 10 mount/unmount cycles

  **Evidence Required:**
  - [ ] Complete test checklist signed off
  - [ ] Screenshot evidence for all tests
  - [ ] No console errors during testing

  **Commit**: YES
  - Message: `chore: update CHANGELOG with GleanDebugger`
  - Files: `CHANGELOG.md`

---

## Commit Strategy

| After Task | Message                                                 | Files             | Verification     |
| ---------- | ------------------------------------------------------- | ----------------- | ---------------- |
| 1          | `feat(components): add GleanDebugger drop-in component` | GleanDebugger.tsx | typecheck        |
| 2          | `feat(index): export GleanDebugger component`           | index.ts          | typecheck, build |
| 5          | `chore: update CHANGELOG with GleanDebugger`            | CHANGELOG.md      | git diff         |

---

## Success Criteria

### Verification Commands

```bash
# TypeScript compilation
npm run typecheck  # Expected: No errors

# Build verification
npm run build      # Expected: < 20KB total, < 5KB for GleanDebugger

# Manual testing (documented)
# All acceptance criteria from tasks 1-5
```

### Final Checklist

- [ ] All "Must Have" present (single export, zero-config, activation patterns)
- [ ] All "Must NOT Have" absent (no theming, no context, no breaking changes)
- [ ] Bundle size within budget
- [ ] SSR-safe
- [ ] Complete cleanup on unmount
- [ ] Non-breaking with existing API
