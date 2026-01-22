# Testing Plan: Toggle Panel Bug Fix

## Context

### Bug Description

Toggle panel doesn't close properly when clicking the toggle button - it appears to close and immediately reopen due to race condition between:

1. Toggle button `onClick` handler → calls `close()`
2. Document `mousedown` listener (click-outside detection) → also fires on same click

### Root Cause Identified

- `mousedown` fires BEFORE `click` in DOM event order
- `stopPropagation()` doesn't help because mousedown still fires
- **Solution implemented**: Exclude toggle button from click-outside detection by checking `aria-label`

### Files Modified

- `src/components/DebugPanel.tsx` - Toggle button exclusion, AnimatePresence mode="wait"
- `src/hooks/useDebugPanelControls.ts` - Fixed useEffect dependencies, added debouncing
- `src/components/DebugPanel.styles.ts` - Compact notification styles with ellipsis
- `src/components/DebugPanelStatus.tsx` - Proper spacing, text overflow handling

---

## Testing Strategy

### Test Decision

- **Infrastructure exists**: YES (Vitest + React Testing Library)
- **User wants tests**: YES (comprehensive unit + integration)
- **Framework**: Vitest + React Testing Library + Playwright (E2E)
- **QA approach**: Tests-after approach

---

## Test Coverage Matrix

### 1. Unit Tests (`src/hooks/useDebugPanelControls.test.ts`)

| Test Category           | Test Cases                                                | Priority |
| ----------------------- | --------------------------------------------------------- | -------- |
| **Custom Events**       | `glean-debug-toggle` event sets isOpen to true            | HIGH     |
|                         | `glean-debug-toggle` event sets isOpen to false           | HIGH     |
|                         | Event with invalid detail is ignored                      | MEDIUM   |
| **Debouncing**          | Rapid toggle events are debounced (only last one applies) | HIGH     |
|                         | 10ms debounce prevents state flickering                   | MEDIUM   |
| **State Consistency**   | isOpen ref is synchronized with state                     | HIGH     |
| **Effect Dependencies** | No unnecessary effect re-runs on isOpen change            | MEDIUM   |

### 2. Integration Tests (`src/components/DebugPanel.test.tsx` - NEW)

| Test Category              | Test Cases                                               | Priority |
| -------------------------- | -------------------------------------------------------- | -------- |
| **Toggle Button Click**    | Click toggle button opens panel                          | HIGH     |
|                            | Click toggle button closes panel                         | HIGH     |
|                            | Toggle state flips correctly (false→true→false)          | HIGH     |
| **Click-Outside**          | Click outside panel closes it                            | HIGH     |
|                            | Click toggle button does NOT trigger click-outside close | HIGH     |
|                            | Click outside when panel is closed does nothing          | MEDIUM   |
| **Rapid Clicks**           | Double-click toggle button rapidly                       | HIGH     |
|                            | Triple-click toggle button rapidly                       | MEDIUM   |
|                            | Click toggle then click outside quickly                  | MEDIUM   |
| **Keyboard + Click Combo** | Open with keyboard, close with click                     | MEDIUM   |
|                            | Open with click, close with Escape                       | MEDIUM   |
| **Notifications**          | Multiple status messages stack properly                  | HIGH     |
|                            | Long filenames truncate with ellipsis                    | HIGH     |
|                            | Success/error messages display correctly                 | HIGH     |

### 3. E2E Tests (Playwright - NEW)

| Test Category          | Test Cases                                        | Priority |
| ---------------------- | ------------------------------------------------- | -------- |
| **Toggle Flow**        | Click toggle button opens panel                   | HIGH     |
|                        | Click toggle button closes panel                  | HIGH     |
|                        | Toggle button icon changes (open↔closed)          | HIGH     |
| **Click-Outside**      | Click outside panel closes it                     | HIGH     |
|                        | Click on toggle button closes panel (not reopens) | HIGH     |
| **Keyboard Shortcuts** | Ctrl+Shift+D opens panel                          | HIGH     |
|                        | Escape closes panel                               | HIGH     |
| **Rapid Interaction**  | Rapid toggle clicks (5x in 100ms)                 | HIGH     |
| **Status Messages**    | Copy action shows success message                 | HIGH     |
|                        | Download action shows success message             | HIGH     |
|                        | Multiple actions show stacked messages            | MEDIUM   |
| **Visual**             | Long filenames truncate with ellipsis             | HIGH     |
|                        | Proper spacing between multiple messages          | HIGH     |

---

## Implementation Plan

### Phase 1: Setup Playwright

- [ ] Install Playwright: `npm install -D @playwright/test`
- [ ] Initialize config: `npx playwright install --with-deps`
- [ ] Create `playwright.config.ts`
- [ ] Create `tests/` directory structure

### Phase 2: Extend Unit Tests

- [ ] Add custom event tests to `useDebugPanelControls.test.ts`
- [ ] Add debouncing tests
- [ ] Add isOpenRef synchronization tests
- [ ] Run unit tests: `npm run test`

### Phase 3: Create Integration Tests

- [ ] Create `src/components/DebugPanel.test.tsx`
- [ ] Test toggle button click behavior
- [ ] Test click-outside exclusion for toggle button
- [ ] Test rapid click scenarios
- [ ] Test notification stacking and ellipsis
- [ ] Run integration tests: `npm run test`

### Phase 4: Create E2E Tests

- [ ] Create `tests/toggle-panel.spec.ts`
- [ ] Create `tests/status-messages.spec.ts`
- [ ] Create test fixtures (Page Object pattern)
- [ ] Run E2E tests: `npx playwright test`

### Phase 5: Verify Coverage

- [ ] Run all tests: `npm run test && npx playwright test`
- [ ] Check coverage report
- [ ] Add any missing edge cases

---

## Test Files Structure

```
glean-debug-logger/
├── src/
│   ├── hooks/
│   │   └── useDebugPanelControls.test.ts  (EXTEND)
│   └── components/
│       └── DebugPanel.test.tsx            (NEW - integration)
├── tests/
│   ├── playwright.config.ts               (NEW)
│   ├── fixtures/
│   │   └── base.fixture.ts                (NEW)
│   ├── toggle-panel.spec.ts               (NEW - E2E)
│   └── status-messages.spec.ts            (NEW - E2E)
└── package.json
```

---

## Test Implementation Details

### Unit Test Examples

```typescript
// Custom Event Tests
describe('useDebugPanelControls - Custom Events', () => {
  it('should set isOpen to true on glean-debug-toggle event with visible=true', () => {
    const { result } = renderHook(() => useDebugPanelControls());

    const event = new CustomEvent('glean-debug-toggle', {
      detail: { visible: true },
    });
    window.dispatchEvent(event);

    expect(result.current.isOpen).toBe(true);
  });

  it('should set isOpen to false on glean-debug-toggle event with visible=false', () => {
    const { result } = renderHook(() => useDebugPanelControls());

    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    const event = new CustomEvent('glean-debug-toggle', {
      detail: { visible: false },
    });
    window.dispatchEvent(event);

    expect(result.current.isOpen).toBe(false);
  });
});

// Debouncing Tests
describe('useDebugPanelControls - Debouncing', () => {
  it('should debounce rapid toggle events', () => {
    const { result } = renderHook(() => useDebugPanelControls());

    // Rapid events
    window.dispatchEvent(new CustomEvent('glean-debug-toggle', { detail: { visible: true } }));
    window.dispatchEvent(new CustomEvent('glean-debug-toggle', { detail: { visible: false } }));
    window.dispatchEvent(new CustomEvent('glean-debug-toggle', { detail: { visible: true } }));

    // Should only have last value after debounce
    expect(result.current.isOpen).toBe(true);
  });
});
```

### Integration Test Examples

```typescript
// DebugPanel.test.tsx
describe('DebugPanel - Toggle Behavior', () => {
  it('should toggle panel on button click', async () => {
    render(<GleanDebugger><DebugPanel /></GleanDebugger>);

    const toggleButton = screen.getByLabelText('Open debug panel');
    expect(toggleButton).toBeInTheDocument();

    // Click to open
    await user.click(toggleButton);
    expect(await screen.findByLabelText('Close debug panel')).toBeInTheDocument();

    // Click to close
    await user.click(toggleButton);
    expect(await screen.findByLabelText('Open debug panel')).toBeInTheDocument();
  });

  it('should NOT close when clicking toggle button (click-outside exclusion)', async () => {
    render(<GleanDebugger><DebugPanel /></GleanDebugger>);

    const toggleButton = screen.getByLabelText('Open debug panel');
    await user.click(toggleButton);

    // Verify panel is open
    expect(screen.getByLabelText('Close debug panel')).toBeInTheDocument();

    // Click toggle button - should NOT close panel
    await user.click(screen.getByLabelText('Close debug panel'));

    // Panel should still be open (not closed by click-outside)
    expect(screen.getByLabelText('Close debug panel')).toBeInTheDocument();
  });
});
```

### E2E Test Examples

```typescript
// toggle-panel.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Toggle Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo-app');
    // Initialize debug panel
    await page.evaluate(() => {
      // @ts-ignore
      window gleankDebug = new GleanDebugger();
    });
  });

  test('click toggle button opens panel', async ({ page }) => {
    const toggleButton = page.locator('[aria-label="Open debug panel"]');

    await toggleButton.click();

    await expect(page.locator('[aria-label="Close debug panel"]')).toBeVisible();
  });

  test('click toggle button closes panel (not reopens)', async ({ page }) => {
    // Open first
    await page.locator('[aria-label="Open debug panel"]').click();
    await expect(page.locator('[aria-label="Close debug panel"]')).toBeVisible();

    // Click toggle again
    await page.locator('[aria-label="Close debug panel"]').click();

    // Panel should be closed, NOT reopen
    await expect(page.locator('[aria-label="Close debug panel"]')).not.toBeVisible();
    await expect(page.locator('[aria-label="Open debug panel"]')).toBeVisible();
  });

  test('rapid toggle clicks', async ({ page }) => {
    const toggleButton = page.locator('[aria-label="Open debug panel"]');

    // Rapid clicks
    await toggleButton.click();
    await toggleButton.click();
    await toggleButton.click();
    await toggleButton.click();
    await toggleButton.click();

    // Final state should be open
    await expect(page.locator('[aria-label="Close debug panel"]')).toBeVisible();
  });

  test('click outside closes panel', async ({ page }) => {
    await page.locator('[aria-label="Open debug panel"]').click();

    // Click outside
    await page.locator('body').click({ position: { x: 10, y: 10 } });

    await expect(page.locator('[aria-label="Open debug panel"]')).toBeVisible();
  });
});
```

---

## Verification Commands

```bash
# Run unit tests
npm run test

# Run unit tests with coverage
npm run test -- --coverage

# Run Playwright E2E tests
npx playwright test

# Run Playwright with UI
npx playwright test --ui

# Run Playwright with specific file
npx playwright test tests/toggle-panel.spec.ts

# Check test results
npm run test && npx playwright test
```

---

## Success Criteria

- [ ] All unit tests pass (30+ existing + new custom event + debouncing tests)
- [ ] All integration tests pass (toggle, click-outside, rapid clicks, notifications)
- [ ] All E2E tests pass (Playwright browser tests)
- [ ] Toggle bug is verified fixed in real browser
- [ ] Click-outside exclusion works correctly
- [ ] Rapid clicks don't cause flickering
- [ ] Long filenames truncate properly
- [ ] Multiple notifications stack with proper spacing

---

## Risks & Mitigations

| Risk                           | Mitigation                                    |
| ------------------------------ | --------------------------------------------- |
| Click-outside test flaky in CI | Use `waitForSelector` with timeout            |
| Rapid click timing issues      | Use `setTimeout` or Playwright `slowMo`       |
| Race conditions in tests       | Use `async/await` + proper waits              |
| Missing edge cases             | Comprehensive test matrix + code review       |
| E2E setup complexity           | Start with simple tests, expand incrementally |
