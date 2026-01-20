# Storybook Implementation Plan

## Overview

Set up Storybook for component development, testing, and documentation for the glean-debug-logger React library with Vitest integration.

## Core Goals

1. **Component Development**: Visual development and testing of DebugPanel component
2. **Documentation**: Auto-generated component documentation
3. **Interaction Testing**: Test component interactions with Vitest
4. **Story Management**: Organized story structure following best practices

## Current State

### Test Infrastructure (Verified)

- **Framework**: Vitest (v1.0.0+)
- **Libraries**: `@testing-library/react` (v14.0.0), `jsdom` (v27.4.0)
- **Config**: `vitest.config.ts` with jsdom environment
- **Coverage**: v8 provider with text/json/html reporters

### Component Structure

- **Main Component**: `DebugPanel.tsx` with goober styling
- **Props**: user, environment, uploadEndpoint, fileNameTemplate, maxLogs, showInProduction
- **State**: isOpen, isUploading, uploadStatus, directoryStatus
- **Dependencies**: useLogRecorder hook, DebugPanel.styles.ts
- **Styling**: goober CSS-in-JS

---

## Architecture

```
.storybook/
├── main.ts           # Storybook configuration
└── preview.tsx       # Global decorators and settings

src/
└── components/
    ├── DebugPanel/
    │   ├── DebugPanel.tsx       # Main component
    │   ├── DebugPanel.styles.ts # Goober styles
    │   ├── DebugPanel.stories.tsx   # Stories
    │   ├── DebugPanel.notes.md      # Component documentation
    │   └── DebugPanel.test.tsx      # Storybook interaction tests
    └── DebugPanelMinimal/
        ├── DebugPanelMinimal.tsx
        ├── DebugPanelMinimal.stories.tsx
        └── DebugPanelMinimal.test.tsx
```

---

## Tasks

### Task 1: Install Storybook

Install Storybook with React and TypeScript support.

**Acceptance Criteria**:

- [x] Storybook installed: `npx storybook@latest init`
- [x] Dependencies added to package.json
- [x] Configuration files created in `.storybook/`
- [x] Storybook starts successfully: `npm run storybook`

---

### Task 3: Create DebugPanel Stories

Create stories for the DebugPanel component showing different states.

**Reference Pattern**: Storybook 7+ component stories:

```typescript
// src/components/DebugPanel/DebugPanel.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DebugPanel } from './DebugPanel';

const meta = {
  title: 'Components/DebugPanel',
  component: DebugPanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    environment: { control: 'select', options: ['development', 'production'] },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof DebugPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    environment: 'development',
    maxLogs: 2000,
  },
};

export const WithUser: Story = {
  args: {
    user: { id: 'user-123', email: 'test@example.com' },
    environment: 'development',
  },
};

export const WithUploadEndpoint: Story = {
  args: {
    uploadEndpoint: 'https://api.example.com/logs',
    environment: 'development',
  },
};

export const Empty: Story = {
  args: {
    maxLogs: 0,
    environment: 'development',
  },
};
```

**Acceptance Criteria**:

- [x] Stories file created at `src/components/DebugPanel/DebugPanel.stories.tsx`
- [x] Story for default state
- [x] Story with user prop
- [x] Story with upload endpoint
- [x] Story for empty state
- [x] Stories accessible in Storybook UI

---

### Task 4: Create DebugPanelMinimal Stories

Create stories for the minimal panel variant.

**Acceptance Criteria**:

- [x] DebugPanelMinimal component identified/created
- [x] Stories file created
- [x] All states documented
- [x] Stories render correctly

---

### Task 5: Add Interaction Tests

Add interaction testing using Storybook + Vitest.

**Reference Pattern**: Storybook interaction testing:

```typescript
// src/components/DebugPanel/DebugPanel.test.tsx
import { render, screen, userEvent, waitFor } from '@storybook/testing-library';
import type { PlayFunction } from '@storybook/csf';
import { expect } from 'vitest';

const openPanel: PlayFunction = async ({ args }) => {
  const toggleButton = screen.getByRole('button', { name: /debug/i });
  await userEvent.click(toggleButton);

  const panel = await screen.findByRole('dialog');
  await expect(panel).toBeInTheDocument();
};

export const InteractiveOpen: Story = {
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /debug/i });
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  },
};
```

**Acceptance Criteria**:

- [x] Interaction tests added to stories
- [x] Tests verify panel open/close
- [x] Tests verify download button
- [x] Tests verify keyboard navigation
- [x] Tests run successfully: `npm run test-storybook`

---

### Task 6: Create Component Documentation

Add documentation notes for the component.

**Acceptance Criteria**:

- [x] Documentation file created: `src/components/DebugPanel/DebugPanel.notes.md`
- [x] Props table included
- [x] Usage examples included
- [x] Keyboard shortcuts documented
- [x] Accessibility features documented

---

### Task 7: Configure Storybook Addons

Configure additional Storybook addons for better development experience.

**Recommended Addons**:

1. `@storybook/addon-links` - Navigation between stories
2. `@storybook/addon-essentials` - Controls, actions, docs
3. `@storybook/addon-interactions` - Interaction testing UI
4. `@storybook/addon-a11y` - Accessibility testing

**Acceptance Criteria**:

- [x] Addons installed (essentials, interactions)
- [x] Controls configured for all props
- [x] Actions panel working
- [x] Accessibility addon configured (optional)

---

### Task 8: Add Storybook Scripts

Add npm scripts for Storybook operations.

**Reference Pattern**: Package.json scripts:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test-storybook": "test-storybook --config-dir .storybook",
    "test-storybook:ci": "concurrently -k \"npm run storybook\" \"wait-on http://localhost:6006 && npm run test-storybook\""
  }
}
```

**Acceptance Criteria**:

- [x] `npm run storybook` works
- [x] `npm run build-storybook` creates static site
- [x] `npm run test-storybook` runs interaction tests

---

### Task 9: Run Verification

Verify the complete Storybook setup.

**Acceptance Criteria**:

- [x] Storybook starts without errors
- [x] All stories render correctly
- [x] Controls work for all props
- [x] Interaction tests pass
- [x] Build succeeds: `npm run build-storybook`
- [x] Documentation auto-generated

---

## File References

### New Files

```
.storybook/
├── main.ts
└── preview.tsx

src/components/DebugPanel/
├── DebugPanel.stories.tsx
├── DebugPanel.test.tsx
└── DebugPanel.notes.md

src/components/DebugPanelMinimal/
├── DebugPanelMinimal.stories.tsx
└── DebugPanelMinimal.test.tsx
```

### Modified Files

```
package.json  # Add scripts and dependencies
```

---

## Dependencies

### New Dependencies

```bash
# Core Storybook
npm install --save-dev @storybook/react@^8.0.0
npm install --save-dev @storybook/react-vite@^8.0.0
npm install --save-dev @storybook/client-logger@^8.0.0

# Addons
npm install --save-dev @storybook/addon-links@^8.0.0
npm install --save-dev @storybook/addon-essentials@^8.0.0
npm install --save-dev @storybook/addon-interactions@^8.0.0

# Testing integration
npm install --save-dev @storybook/test@^8.0.0
npm install --save-dev @storybook/test-runner@^0.0.0

# Optional: Accessibility addon
npm install --save-dev @storybook/addon-a11y@^8.0.0

# Remove old testing packages if redundant
# npm uninstall @testing-library/react (if storybook test replaces it)
```

### Existing Dependencies (verify)

- `vitest` - Already installed
- `@testing-library/react` - Already installed
- `jsdom` - Already installed

---

## Commit Strategy

| After Task | Message                                        | Files                           |
| ---------- | ---------------------------------------------- | ------------------------------- |
| 1          | `chore: install storybook dependencies`        | package.json, .storybook/       |
| 2          | `chore: configure storybook`                   | .storybook/main.ts, preview.tsx |
| 3          | `feat(stories): add DebugPanel stories`        | DebugPanel.stories.tsx          |
| 4          | `feat(stories): add DebugPanelMinimal stories` | DebugPanelMinimal.stories.tsx   |
| 5          | `test: add interaction tests`                  | DebugPanel.test.tsx             |
| 6          | `docs: add component documentation`            | DebugPanel.notes.md             |
| 7          | `chore: configure storybook addons`            | .storybook/, package.json       |
| 8          | `chore: add storybook scripts`                 | package.json                    |
| 9          | `chore: verify storybook setup`                | All storybook files             |

---

## Verification Commands

```bash
# Install dependencies
npm install

# Start Storybook
npm run storybook

# Build static Storybook site
npm run build-storybook

# Run interaction tests
npm run test-storybook

# Run all tests including Storybook
npm run test
```

---

## Success Criteria

- [x] Storybook runs successfully
- [x] All component states documented with stories
- [x] Interaction tests work with Vitest
- [x] Auto-generated documentation (autodocs)
- [x] Build produces static Storybook site
- [x] No conflicts with existing test infrastructure
- [x] Stories integrate with existing component patterns

---

## Notes

### Why Storybook?

1. **Visual Development**: See components in isolation
2. **Documentation**: Auto-generated from stories
3. **Testing**: Interaction tests with Vitest
4. **Collaboration**: Design system documentation

### Integration with Existing Tests

Storybook tests complement (not replace) existing Vitest tests:

- **Vitest**: Unit tests, integration tests
- **Storybook**: Visual regression, interaction tests, documentation

### Bundle Size Impact

- Storybook is dev-only (not bundled in production)
- Addons increase dev dependencies but not production bundle
