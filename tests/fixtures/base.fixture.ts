import { test as base, type Page, type Locator } from '@playwright/test';

type DebugPanelFixtures = {
  initDebugPanel: (page: Page) => Promise<void>;
  getToggleButton: (page: Page) => Promise<Locator>;
  waitForToggleState: (page: Page, expectedOpen: boolean) => Promise<void>;
};

export const test = base.extend<DebugPanelFixtures>({
  initDebugPanel: async (
    { page }: { page: Page },
    use: (fn: (page: Page) => Promise<void>) => void
  ) => {
    await use(async (page: Page) => {
      await page.evaluate(() => {
        (window as unknown as { gleanDebugger?: unknown }).gleanDebugger = {};
      });
    });
  },

  getToggleButton: async (
    { page }: { page: Page },
    use: (fn: (page: Page) => Promise<Locator>) => void
  ) => {
    await use(async (page: Page) => {
      return page
        .locator('[aria-label="Open debug panel"], [aria-label="Close debug panel"]')
        .first();
    });
  },

  waitForToggleState: async (
    { page }: { page: Page },
    use: (fn: (page: Page, expectedOpen: boolean) => Promise<void>) => void
  ) => {
    await use(async (page: Page, expectedOpen: boolean) => {
      const ariaLabel = expectedOpen ? 'Close debug panel' : 'Open debug panel';
      await page.locator(`[aria-label="${ariaLabel}"]`).waitFor({ state: 'visible' });
    });
  },
});

export { expect } from '@playwright/test';
