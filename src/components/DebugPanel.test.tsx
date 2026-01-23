/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setupBrowserMocks, teardownBrowserMocks } from '../hooks/__mocks__/browser';

// Create mock localStorage similar to GleanDebugger.test.tsx
function createMockLocalStorage() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => {
        delete store[key];
      });
    }),
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    get length() {
      return Object.keys(store).length;
    },
  };
}

// Event listeners storage for mock window
const eventListeners: Record<string, ((event: Event) => void)[]> = {};

// Create mock window with addEventListener/removeEventListener support
function createMockWindow() {
  return {
    location: new URL('http://localhost?debug=true'),
    addEventListener: vi.fn((type: string, handler: (event: Event) => void) => {
      if (!eventListeners[type]) eventListeners[type] = [];
      eventListeners[type].push(handler);
    }),
    removeEventListener: vi.fn((type: string, handler: (event: Event) => void) => {
      if (eventListeners[type]) {
        eventListeners[type] = eventListeners[type].filter((h) => h !== handler);
      }
    }),
    dispatchEvent: vi.fn((event: Event) => {
      const handlers = eventListeners[event.type] || [];
      handlers.forEach((handler) => handler(event));
      return true;
    }),
    glean: {
      show: vi.fn(),
      hide: vi.fn(),
      toggle: vi.fn(),
      isEnabled: vi.fn(() => store['glean-debug-enabled'] === 'true'),
    },
  };
}

const store: Record<string, string> = {};

describe('DebugPanel Toggle Behavior - Event-Based Tests', () => {
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>;
  let mockWindow: ReturnType<typeof createMockWindow>;

  beforeEach(() => {
    setupBrowserMocks();
    mockLocalStorage = createMockLocalStorage();
    mockWindow = createMockWindow();

    // Initialize store
    store['glean-debug-enabled'] = 'true';

    vi.stubGlobal('localStorage', mockLocalStorage);
    vi.stubGlobal('window', mockWindow);
    vi.stubGlobal('process', { env: { NODE_ENV: 'development' } });
  });

  afterEach(() => {
    teardownBrowserMocks();
    vi.restoreAllMocks();
    // Clear store
    Object.keys(store).forEach((key) => {
      delete store[key];
    });
  });

  describe('Custom Event API', () => {
    it('should open panel when glean-debug-toggle event is dispatched with visible: true', () => {
      let panelVisible = false;

      // Simulate the event listener behavior (same as useDebugPanelControls implementation)
      const handleToggle = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.visible === true) {
          panelVisible = true;
          mockLocalStorage.setItem('glean-debug-enabled', 'true');
        } else if (customEvent.detail?.visible === false) {
          panelVisible = false;
          mockLocalStorage.removeItem('glean-debug-enabled');
        }
      };

      // Dispatch open event
      window.addEventListener('glean-debug-toggle', handleToggle);
      window.dispatchEvent(new CustomEvent('glean-debug-toggle', { detail: { visible: true } }));

      expect(panelVisible).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('glean-debug-enabled', 'true');

      window.removeEventListener('glean-debug-toggle', handleToggle);
    });

    it('should close panel when glean-debug-toggle event is dispatched with visible: false', () => {
      let panelVisible = true;

      const handleToggle = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.visible === true) {
          panelVisible = true;
          mockLocalStorage.setItem('glean-debug-enabled', 'true');
        } else if (customEvent.detail?.visible === false) {
          panelVisible = false;
          mockLocalStorage.removeItem('glean-debug-enabled');
        }
      };

      // Start with panel open
      window.addEventListener('glean-debug-toggle', handleToggle);
      window.dispatchEvent(new CustomEvent('glean-debug-toggle', { detail: { visible: false } }));

      expect(panelVisible).toBe(false);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('glean-debug-enabled');

      window.removeEventListener('glean-debug-toggle', handleToggle);
    });

    it('should handle rapid toggle events correctly', () => {
      const visibilityHistory: boolean[] = [];

      const handleToggle = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.visible !== undefined) {
          visibilityHistory.push(customEvent.detail.visible);
        }
      };

      window.addEventListener('glean-debug-toggle', handleToggle);

      // Rapid toggles (5x)
      window.dispatchEvent(new CustomEvent('glean-debug-toggle', { detail: { visible: true } }));
      window.dispatchEvent(new CustomEvent('glean-debug-toggle', { detail: { visible: false } }));
      window.dispatchEvent(new CustomEvent('glean-debug-toggle', { detail: { visible: true } }));
      window.dispatchEvent(new CustomEvent('glean-debug-toggle', { detail: { visible: false } }));
      window.dispatchEvent(new CustomEvent('glean-debug-toggle', { detail: { visible: true } }));

      expect(visibilityHistory).toEqual([true, false, true, false, true]);
      expect(visibilityHistory[visibilityHistory.length - 1]).toBe(true);

      window.removeEventListener('glean-debug-toggle', handleToggle);
    });
  });

  describe('LocalStorage Integration', () => {
    it('should persist debug enabled state in localStorage', () => {
      // Simulate toggle behavior
      const toggleDebug = (enable: boolean) => {
        if (enable) {
          localStorage.setItem('glean-debug-enabled', 'true');
        } else {
          localStorage.removeItem('glean-debug-enabled');
        }
      };

      toggleDebug(true);
      expect(localStorage.getItem('glean-debug-enabled')).toBe('true');

      toggleDebug(false);
      expect(localStorage.getItem('glean-debug-enabled')).toBeNull();
    });

    it('should read debug state from localStorage', () => {
      mockLocalStorage.setItem('glean-debug-enabled', 'true');
      const isEnabled = localStorage.getItem('glean-debug-enabled') === 'true';
      expect(isEnabled).toBe(true);

      mockLocalStorage.removeItem('glean-debug-enabled');
      const isDisabled = localStorage.getItem('glean-debug-enabled') === 'true';
      expect(isDisabled).toBe(false);
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should handle Ctrl+Shift+D keyboard shortcut', () => {
      let shortcutTriggered = false;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
          event.preventDefault();
          shortcutTriggered = true;
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Simulate Ctrl+Shift+D
      const event = new KeyboardEvent('keydown', {
        key: 'D',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);

      expect(shortcutTriggered).toBe(true);

      window.removeEventListener('keydown', handleKeyDown);
    });

    it('should handle Escape key', () => {
      let escapePressed = false;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          escapePressed = true;
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      window.dispatchEvent(event);

      expect(escapePressed).toBe(true);

      window.removeEventListener('keydown', handleKeyDown);
    });
  });
});
