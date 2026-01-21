# DX Improvement Plan: GleanDebugger Component

## Context

### Original Request

User wants to improve DX for glean-debug-logger by creating a drop-in `GleanDebugger` component that enables zero-config integration with automatic production hiding and URL/localStorage activation patterns.

### Interview Summary

**Key Discussions**:

- User analyzed current DX pain points: 3 files + ~50 lines code needed for basic integration
- Proposed solution: Single default export component with smart defaults
- Priority: Phase 1 (GleanDebugger) + Phase 2 (Auto-hide), no Provider pattern (useLogRecorder already exists)
- Constraint: Non-breaking change, must work with existing DebugPanel

**Research Findings**:

- DebugPanel already has `'use client'` directive (line 1)
- Current `shouldShow` logic: `showInProduction || environment === 'development' || user?.role === 'admin'`
- No localStorage fallback currently
- No URL param detection currently
- Named exports only from `index.ts` (tree-shaking requirement)
- Zero runtime deps constraint (<20KB bundle size)

### Metis Review

**Identified Gaps (addressed in this plan)**:

1. SSR hydration mismatch risk → Added `suppressHydrationWarning` and proper state management
2. Namespace collision (`window.glean`) → Added conflict detection and merge strategy
3. Console commands in production → Added no-op pattern with build-time consideration
4. Bundle size budget → Added <5KB target for new component
5. TypeScript breaking changes → Added explicit type export policy
6. Memory leaks → Added complete cleanup logic

**Guardrails Applied**:

- MUST NOT add runtime dependencies beyond React
- MUST be tree-shakeable (follow named exports pattern)
- Console commands must be no-op or stripped in production
- MUST NOT modify existing `shouldShow` behavior
- MUST handle SSR hydration gracefully
- MUST clean up all global state on unmount

---

## Work Objectives

### Core Objective

Create `GleanDebugger` component that enables 1-line drop-in integration:

```tsx
import { GleanDebugger } from '@zaob/glean-debug-logger';
<GleanDebugger />;
```

### Concrete Deliverables

1. `src/components/GleanDebugger.tsx` - New drop-in component
2. `src/index.ts` - Updated exports (add GleanDebugger)
3. Enhanced activation logic (URL + localStorage + console commands)

### Definition of Done

- [ ] `GleanDebugger` renders when activation pattern is triggered
- [ ] `window.glean.enable()` makes debugger visible
- [ ] `window.glean.disable()` hides debugger
- [ ] `window.glean.toggle()` inverts visibility
- [ ] Debugger auto-hides in production unless activated
- [ ] Console commands are no-op in production
- [ ] Bundle size impact < 5KB
- [ ] SSR-safe (no hydration mismatches)
- [ ] TypeScript types exported and complete
- [ ] Cleanup complete on unmount (no memory leaks)

### Must Have

- Single default export component
- Zero-config defaults (auto-hide in production)
- URL param activation (`?debug=true`)
- LocalStorage activation (`glean-debug-enabled=true`)
- Console commands (`window.glean.enable/disable/toggle`)
- Non-breaking with existing API

### Must NOT Have (Guardrails)

- No theming/customization options
- No React Context provider (useLogRecorder exists)
- No modification to existing DebugPanel.tsx
- No new runtime dependencies
- No breaking changes to existing types
- No auto-trigger logic (explicit activation only)

---

## Verification Strategy

### Test Decision

- **Infrastructure exists**: YES (vitest in package.json)
- **User wants tests**: NO (manual verification only for this DX improvement)
- **Framework**: N/A (manual verification)

### Manual Execution Verification

**For Component Changes:**

- [ ] Using Playwright browser automation:
  - Navigate to local development app
  - Open browser console
  - Run: `window.glean.enable()`
  - Verify: Debug panel appears
  - Run: `window.glean.disable()`
  - Verify: Debug panel hides
  - Run: `window.glean.toggle()`
  - Verify: Debug panel visibility toggles

**For URL Activation:**

- [ ] Navigate to `http://localhost:3000/?debug=true`
  - Verify: Debug panel appears immediately (no reload needed if possible)
- [ ] Navigate to `http://localhost:3000/` (no param)
  - Verify: Debug panel is hidden in production mode

**For LocalStorage Activation:**

- [ ] Run in console: `localStorage.setItem('glean-debug-enabled', 'true')`
  - Verify: Debug panel appears
- [ ] Run in console: `localStorage.removeItem('glean-debug-enabled')`
  - Verify: Debug panel hides

**For Production Mode:**

- [ ] Set `NODE_ENV=production`
  - Verify: Debug panel is hidden by default
  - Verify: `?debug=true` still activates it
  - Verify: Console commands do nothing (no-op)

**Evidence Required:**

- [ ] Screenshot of debug panel visible
- [ ] Screenshot of debug panel hidden
- [ ] Terminal output showing no errors

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
  - Import `DebugPanel` from `./DebugPanel`
  - Add `'use client'` directive
  - Create `useGleanActivation` hook for URL + localStorage detection
  - Create `useConsoleCommands` hook for `window.glean` API
  - Implement namespace collision handling
  - Add proper cleanup on unmount
  - Export as default component

  **Must NOT do**:
  - Add any configuration props beyond basic DebugPanel props
  - Create React Context
  - Add theming options

  **Parallelizable**: YES (with 2)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `src/components/DebugPanel.tsx:1` - Use `'use client'` directive pattern
  - `src/components/DebugPanel.tsx:30-47` - DebugPanelProps interface structure
  - `src/components/DebugPanel.tsx:264-266` - Current shouldShow logic (to enhance, not replace)
  - `src/hooks/useLogRecorder.ts:18-30` - Default config pattern for sensible defaults

  **Hook References** (patterns to follow):
  - `src/hooks/useLogRecorder.ts` - Hook creation patterns (useEffect, useCallback)
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
  - Change export syntax from named to default (except GleanDebugger)

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
  - Detect localStorage: `localStorage.getItem('glean-debug-enabled') === 'true'`
  - Combine with existing logic: `showInProduction || environment === 'development' || user?.role === 'admin' || urlParam || localStorage`
  - Handle SSR gracefully (check typeof window)

  **Must NOT do**:
  - Modify existing DebugPanel shouldShow logic
  - Add auto-trigger logic (explicit activation only)

  **References**:
  - `src/components/DebugPanel.tsx:264-266` - Current shouldShow logic
  - `src/services/FileService.ts:7` - SSR check pattern (`typeof window`)

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [ ] URL param `?debug=true` activates panel
  - [ ] URL param `?debug=false` hides panel
  - [ ] localStorage enables panel
  - [ ] localStorage removal hides panel
  - [ ] Development mode shows by default
  - [ ] Production mode hides by default
  - [ ] Production with activation shows panel

  **Evidence Required:**
  - [ ] Console logs showing activation detection working

  **Commit**: YES (part of task 1)

- [ ] 4. Implement console commands API

  **What to do**:
  - Create `window.glean` namespace with:
    - `enable()`: Set localStorage and show panel
    - `disable()`: Remove localStorage and hide panel
    - `toggle()`: Invert visibility
    - `isEnabled()`: Return current state
  - Add namespace collision check (merge if exists, or warn)
  - Make commands no-op in production mode
  - Clean up on unmount (remove from window)

  **Must NOT do**:
  - Expose any sensitive data through console
  - Create permanent global state (must clean up)

  **References**:
  - `src/services/FileService.ts:7-15` - Window access pattern
  - `src/components/DebugPanel.tsx:70-95` - useEffect for event listeners

  **Acceptance Criteria**:

  **Manual Execution Verification:**
  - [ ] `window.glean` exists in console
  - [ ] `window.glean.enable()` shows panel
  - [ ] `window.glean.disable()` hides panel
  - [ ] `window.glean.toggle()` toggles visibility
  - [ ] `window.glean.isEnabled()` returns boolean
  - [ ] Commands work in development
  - [ ] Commands are no-op in production (verify no errors)
  - [ ] Unmounting component removes `window.glean`

  **Evidence Required:**
  - [ ] Console screenshot showing `window.glean` API
  - [ ] Console screenshot showing enable/disable working

  **Commit**: YES (part of task 1)

- [ ] 5. Final integration testing

  **What to do**:
  - Test all activation patterns work together
  - Test SSR safety (no hydration mismatches)
  - Test cleanup on unmount
  - Test multiple rapid enable/disable calls
  - Test namespace collision handling

  **Must NOT do**:
  - Skip edge case testing

  **References**:
  - `src/components/DebugPanel.tsx:1-30` - Full component structure

  **Acceptance Criteria**:

  **Manual Execution Verification (COMPLETE):**

  _Activation Patterns:_
  - [ ] URL param works: `?debug=true`
  - [ ] localStorage works: `glean-debug-enabled=true`
  - [ ] Console commands work: `window.glean.enable()`
  - [ ] Development mode shows by default
  - [ ] Production mode hides by default

  _Edge Cases:_
  - [ ] Multiple rapid enable/disable calls (no crash)
  - [ ] Component unmount while visible (cleanup complete)
  - [ ] SSR hydration (no mismatch errors)
  - [ ] Namespace collision (merge or warn)

  _Production Safety:_
  - [ ] Console commands are no-op in production
  - [ ] Panel hidden by default in production
  - [ ] Activation still works in production

  _Bundle Size:_
  - [ ] New component < 5KB
  - [ ] Total library still < 20KB

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
