import { test, expect } from './fixtures/base.fixture';

test.describe('Toggle Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Initialize debug panel
    await page.goto('/');
    await page.evaluate(() => {
      if (!window.gleanDebugger) {
        // @ts-ignore
        window.gleanDebugger = new GleanDebugger();
      }
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

    // Click toggle again - should close, NOT reopen
    await page.locator('[aria-label="Close debug panel"]').click();

    // Panel should be closed
    await expect(page.locator('[aria-label="Open debug panel"]')).toBeVisible();
    await expect(page.locator('[aria-label="Close debug panel"]')).not.toBeVisible();
  });

  test('rapid toggle clicks', async ({ page }) => {
    const toggleButton = page.locator('[aria-label="Open debug panel"]');

    // Rapid clicks (5x in quick succession)
    await toggleButton.click();
    await toggleButton.click();
    await toggleButton.click();
    await toggleButton.click();
    await toggleButton.click();

    // Final state should be open
    await expect(page.locator('[aria-label="Close debug panel"]')).toBeVisible();
  });

  test('click outside closes panel', async ({ page }) => {
    // Open panel
    await page.locator('[aria-label="Open debug panel"]').click();
    await expect(page.locator('[aria-label="Close debug panel"]')).toBeVisible();

    // Click outside (top-left corner of page)
    await page.locator('body').click({ position: { x: 10, y: 10 } });

    // Panel should be closed
    await expect(page.locator('[aria-label="Open debug panel"]')).toBeVisible();
  });

  test('keyboard shortcut Ctrl+Shift+D opens panel', async ({ page }) => {
    // Press keyboard shortcut
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('KeyD');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');

    // Panel should be open
    await expect(page.locator('[aria-label="Close debug panel"]')).toBeVisible();
  });

  test('Escape closes panel', async ({ page }) => {
    // Open panel
    await page.locator('[aria-label="Open debug panel"]').click();
    await expect(page.locator('[aria-label="Close debug panel"]')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Panel should be closed
    await expect(page.locator('[aria-label="Open debug panel"]')).toBeVisible();
  });

  test('toggle button icon changes between open and closed states', async ({ page }) => {
    const closedIcon = page.locator('[aria-label="Open debug panel"]');
    const openIcon = page.locator('[aria-label="Close debug panel"]');

    // Initially see closed icon
    await expect(closedIcon).toBeVisible();

    // Click to open
    await closedIcon.click();
    await expect(openIcon).toBeVisible();
    await expect(closedIcon).not.toBeVisible();

    // Click to close
    await openIcon.click();
    await expect(closedIcon).toBeVisible();
    await expect(openIcon).not.toBeVisible();
  });
});
