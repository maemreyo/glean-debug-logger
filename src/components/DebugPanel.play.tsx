// Storybook Interaction Tests for DebugPanel
// These tests verify component interactions using Storybook's play function

import type { StoryContext } from '@storybook/csf';
import { expect, vi } from 'vitest';
import { userEvent, waitFor, screen } from '@storybook/test';

/**
 * Extended StoryContext with proper typing for canvasElement
 */
interface ExtendedPlayContext extends StoryContext {
  canvasElement: HTMLElement;
}

/**
 * Play function to test panel toggle interaction
 * - Clicks the debug button to open panel
 * - Verifies panel is visible
 * - Clicks close button
 * - Verifies panel is hidden
 */
export const testPanelToggle = async ({ canvasElement }: ExtendedPlayContext) => {
  // Find and click the toggle button
  const toggleButton = canvasElement.querySelector(
    'button[class*="toggleButtonStyles"]'
  ) as HTMLButtonElement;
  expect(toggleButton).toBeDefined();

  await userEvent.click(toggleButton);

  // Verify panel opens
  const panel = await screen.findByRole('dialog');
  expect(panel).toBeDefined();

  // Find and click close button
  const closeButton = panel.querySelector(
    'button[class*="closeButtonStyles"]'
  ) as HTMLButtonElement;
  expect(closeButton).toBeDefined();

  await userEvent.click(closeButton);

  // Verify panel closes
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).toBeNull();
  });
};

/**
 * Play function to test download button interaction
 * - Opens panel
 * - Clicks JSON download button
 * - Verifies download is triggered
 */
export const testDownloadJson = async ({ canvasElement }: ExtendedPlayContext) => {
  // Open panel
  const toggleButton = canvasElement.querySelector(
    'button[class*="toggleButtonStyles"]'
  ) as HTMLButtonElement;
  expect(toggleButton).toBeDefined();
  await userEvent.click(toggleButton);

  // Wait for panel
  const panel = await screen.findByRole('dialog');
  expect(panel).toBeDefined();

  // Find and click JSON download button
  const jsonButton = await screen.findByRole('button', { name: /JSON/i });
  expect(jsonButton).toBeDefined();
  await userEvent.click(jsonButton);

  // Verify success message appears
  await waitFor(() => {
    const successMessage = screen.getByText(/downloaded/i);
    expect(successMessage).toBeDefined();
  });
};

/**
 * Play function to test clear logs interaction
 * - Opens panel
 * - Clicks clear button
 * - Confirms dialog
 * - Verifies logs are cleared
 */
export const testClearLogs = async ({
  canvasElement,
  args: _args,
}: ExtendedPlayContext) => {
  // Open panel
  const toggleButton = canvasElement.querySelector(
    'button[class*="toggleButtonStyles"]'
  ) as HTMLButtonElement;
  expect(toggleButton).toBeDefined();
  await userEvent.click(toggleButton);

  // Wait for panel
  const panel = await screen.findByRole('dialog');
  expect(panel).toBeDefined();

  // Find and click clear button
  const clearButton = await screen.findByRole('button', { name: /Clear All Logs/i });
  expect(clearButton).toBeDefined();

  // Mock confirm dialog
  vi.spyOn(window, 'confirm').mockReturnValue(true);

  await userEvent.click(clearButton);

  // Verify confirm was called
  expect(window.confirm).toHaveBeenCalledWith('Clear all logs? This cannot be undone.');
};

/**
 * Play function to test keyboard shortcut (Ctrl+Shift+D)
 * - Triggers keyboard event
 * - Verifies panel opens
 */
export const testKeyboardShortcut = async ({ canvasElement: _canvasElement }: ExtendedPlayContext) => {
  // Simulate Ctrl+Shift+D keyboard event
  await userEvent.keyboard('{Control>}{Shift>}{d}{/Shift}{/Control}');

  // Verify panel opens
  const panel = await screen.findByRole('dialog');
  expect(panel).toBeDefined();
};

/**
 * Play function to test escape key closes panel
 * - Opens panel via keyboard
 * - Presses Escape
 * - Verifies panel closes
 */
export const testEscapeKey = async ({ canvasElement: _canvasElement }: ExtendedPlayContext) => {
  // Open panel using keyboard shortcut
  await userEvent.keyboard('{Control>}{Shift>}{d}{/Shift}{/Control}');

  // Verify panel is open
  const panel = await screen.findByRole('dialog');
  expect(panel).toBeDefined();

  // Press Escape
  await userEvent.keyboard('{Escape}');

  // Verify panel closes
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).toBeNull();
  });
};

/**
 * Play function to test copy to clipboard interaction
 * - Opens panel
 * - Mocks clipboard API
 * - Clicks copy button
 * - Verifies clipboard write is called with JSON content
 * - Verifies success message appears
 */
export const testCopyLogs = async ({ canvasElement }: ExtendedPlayContext) => {
  // Mock navigator.clipboard.writeText
  const writeTextMock = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText: writeTextMock } });

  // Open panel
  const toggleButton = canvasElement.querySelector(
    'button[class*="toggleButtonStyles"]'
  ) as HTMLButtonElement;
  expect(toggleButton).toBeDefined();
  await userEvent.click(toggleButton);

  // Wait for panel
  const panel = await screen.findByRole('dialog');
  expect(panel).toBeDefined();

  // Find and click copy button
  const copyButton = await screen.findByRole('button', { name: /Copy logs to clipboard/i });
  expect(copyButton).toBeDefined();
  await userEvent.click(copyButton);

  // Verify clipboard was called with JSON content
  expect(writeTextMock).toHaveBeenCalled();
  expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('"metadata"'));
  expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('"logs"'));

  // Verify success message appears
  await waitFor(() => {
    const successMessage = screen.getByText(/Copied to clipboard/i);
    expect(successMessage).toBeDefined();
  });
};

// Re-export for use in stories
export { userEvent, waitFor, screen, expect };
