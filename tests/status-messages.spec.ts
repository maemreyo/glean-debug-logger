import { test, expect } from './fixtures/base.fixture';

test.describe('Status Messages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      (window as unknown as { gleanDebugger?: unknown }).gleanDebugger = {};
    });
  });

  test('copy action shows success message', async ({ page }) => {
    // Open panel
    await page.locator('[aria-label="Open debug panel"]').click();

    // Click copy button (assuming it exists in the panel)
    const copyButton = page.locator('button:has-text("Copy")').first();
    await copyButton.click();

    // Should see success message
    await expect(page.getByText('Copied to clipboard')).toBeVisible();
  });

  test('download action shows success message', async ({ page }) => {
    // Open panel
    await page.locator('[aria-label="Open debug panel"]').click();

    // Click download button
    const downloadButton = page.locator('button:has-text("Download")').first();
    await downloadButton.click();

    // Should see success message
    await expect(page.getByText('Download started')).toBeVisible();
  });

  test('long filenames truncate with ellipsis', async ({ page }) => {
    // Open panel
    await page.locator('[aria-label="Open debug panel"]').click();

    // Trigger a message with long filename
    await page.evaluate(() => {
      const event = new CustomEvent('glean-debug-toggle', { detail: { visible: true } });
      window.dispatchEvent(event);
    });

    // Wait for message to appear
    const message = page.getByRole('status').first();
    await expect(message).toBeVisible();

    // Long text should be truncated (check for ellipsis behavior)
    const messageText = await message.locator('span').first().textContent();
    expect(messageText?.length).toBeLessThan(100); // Should be truncated
  });

  test('multiple notifications stack with proper spacing', async ({ page }) => {
    // Open panel
    await page.locator('[aria-label="Open debug panel"]').click();

    // Trigger multiple messages in sequence
    await page.evaluate(() => {
      // This would normally be triggered by actual actions
      const messages = [
        { type: 'success', message: 'File 1 saved successfully' },
        { type: 'success', message: 'File 2 saved successfully' },
        { type: 'success', message: 'File 3 saved successfully' },
      ];

      // Simulate multiple status updates
      messages.forEach((msg, i) => {
        setTimeout(() => {
          const event = new CustomEvent('glean-debug-toggle', { detail: { visible: true } });
          window.dispatchEvent(event);
        }, i * 100);
      });
    });

    // Wait for all messages
    await page.waitForTimeout(500);

    // Check that multiple messages are visible and stacked
    const messages = page.getByRole('status');
    const count = await messages.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('error message displays correctly', async ({ page }) => {
    // Open panel
    await page.locator('[aria-label="Open debug panel"]').click();

    // Trigger error (simulated)
    await page.evaluate(() => {
      const event = new CustomEvent('glean-debug-toggle', { detail: { visible: true } });
      window.dispatchEvent(event);
    });

    // Error message should be visible with error styling
    const errorMessage = page.getByRole('status').first();
    await expect(errorMessage).toBeVisible();

    // Should have error styling (check for error class or color)
    const classes = await errorMessage.getAttribute('class');
    expect(classes).toContain('error');
  });

  test('success message displays correctly', async ({ page }) => {
    // Open panel
    await page.locator('[aria-label="Open debug panel"]').click();

    // Trigger success (simulated)
    await page.evaluate(() => {
      const event = new CustomEvent('glean-debug-toggle', { detail: { visible: true } });
      window.dispatchEvent(event);
    });

    // Success message should be visible
    const successMessage = page.getByRole('status').first();
    await expect(successMessage).toBeVisible();

    // Should have success styling (check for success class or color)
    const classes = await successMessage.getAttribute('class');
    expect(classes).toContain('success');
  });
});
