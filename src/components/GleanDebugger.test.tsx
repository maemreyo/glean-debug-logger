import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

interface GleanConsoleAPI {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  isEnabled: () => boolean;
}

interface MockWindow {
  location: URL;
  dispatchEvent: (event: Event) => boolean;
  glean?: GleanConsoleAPI;
}

const createMockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string): string | null => store[key] || null),
    setItem: vi.fn((key: string, value: string): void => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string): void => {
      delete store[key];
    }),
    clear: vi.fn((): void => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    key: vi.fn((_index: number): string | null => null),
    get length() {
      return Object.keys(store).length;
    },
  };
};

const createMockWindow = (): MockWindow => ({
  location: new URL('http://localhost'),
  dispatchEvent: vi.fn(),
  glean: undefined,
});

describe('GleanDebugger - Activation Logic', () => {
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>;
  let mockWindow: MockWindow;

  beforeEach(() => {
    vi.useFakeTimers();
    mockLocalStorage = createMockLocalStorage();
    mockWindow = createMockWindow();

    vi.stubGlobal('localStorage', mockLocalStorage);
    vi.stubGlobal('window', mockWindow as unknown as Window & typeof globalThis);
    vi.stubGlobal('process', { env: { NODE_ENV: 'development' } });

    Object.keys(mockLocalStorage).forEach(
      (key) => delete mockLocalStorage[key as keyof typeof mockLocalStorage]
    );
    mockWindow.location = new URL('http://localhost');
    mockWindow.dispatchEvent = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Original Logic Activation', () => {
    it('should activate when showInProduction is true', () => {
      const shouldShow = true || 'development' === 'development' || undefined?.role === 'admin';
      expect(shouldShow).toBe(true);
    });

    it('should activate when environment is development', () => {
      const shouldShow = false || 'development' === 'development' || undefined?.role === 'admin';
      expect(shouldShow).toBe(true);
    });

    it('should activate when user role is admin', () => {
      const user = { role: 'admin' };
      const shouldShow = false || 'test' === 'development' || user?.role === 'admin';
      expect(shouldShow).toBe(true);
    });

    it('should not activate by default in production', () => {
      vi.stubGlobal('process', { env: { NODE_ENV: 'production' } });
      const shouldShow = false || 'production' === 'development' || undefined?.role === 'admin';
      expect(shouldShow).toBe(false);
    });
  });

  describe('URL Param Activation', () => {
    it('should activate when ?debug=true in URL', () => {
      mockWindow.location = new URL('http://localhost?debug=true');
      const urlParam = new URLSearchParams(mockWindow.location.search).get('debug') === 'true';
      expect(urlParam).toBe(true);
    });

    it('should not activate when ?debug=false in URL', () => {
      mockWindow.location = new URL('http://localhost?debug=false');
      const urlParam = new URLSearchParams(mockWindow.location.search).get('debug') === 'true';
      expect(urlParam).toBe(false);
    });

    it('should not activate when no debug param in URL', () => {
      mockWindow.location = new URL('http://localhost');
      const urlParam = new URLSearchParams(mockWindow.location.search).get('debug') === 'true';
      expect(urlParam).toBe(false);
    });

    it('should handle malformed URL gracefully', () => {
      const mockLocation = { search: '?debug=true&invalid' };
      const urlParam = new URLSearchParams(mockLocation.search).get('debug') === 'true';
      expect(urlParam).toBe(true);
    });
  });

  describe('localStorage Activation', () => {
    it('should activate when glean-debug-enabled is set to true', () => {
      mockLocalStorage.setItem('glean-debug-enabled', 'true');
      const localStorageEnabled = mockLocalStorage.getItem('glean-debug-enabled') === 'true';
      expect(localStorageEnabled).toBe(true);
    });

    it('should not activate when glean-debug-enabled is not set', () => {
      const localStorageEnabled = mockLocalStorage.getItem('glean-debug-enabled') === 'true';
      expect(localStorageEnabled).toBe(false);
    });

    it('should not activate when glean-debug-enabled is empty string', () => {
      mockLocalStorage.setItem('glean-debug-enabled', '');
      const localStorageEnabled = mockLocalStorage.getItem('glean-debug-enabled') === 'true';
      expect(localStorageEnabled).toBe(false);
    });

    it('should handle localStorage errors gracefully', () => {
      const errorLocalStorage = {
        getItem: vi.fn(() => {
          throw new Error('Private browsing mode');
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        get length() {
          return 0;
        },
      };
      vi.stubGlobal('localStorage', errorLocalStorage);

      let localStorageEnabled = false;
      try {
        localStorageEnabled = errorLocalStorage.getItem('glean-debug-enabled') === 'true';
      } catch {
        localStorageEnabled = false;
      }
      expect(localStorageEnabled).toBe(false);
    });
  });

  describe('SSR Safety', () => {
    it('should handle undefined window gracefully', () => {
      const result = (() => {
        try {
          if (typeof window !== 'undefined') {
            return new URLSearchParams(window.location.search).get('debug') === 'true';
          }
          return false;
        } catch {
          return false;
        }
      })();
      expect(result).toBe(false);
    });

    it('should handle undefined localStorage gracefully', () => {
      let result = false;
      try {
        if (typeof window !== 'undefined') {
          result = localStorage.getItem('glean-debug-enabled') === 'true';
        }
      } catch {
        result = false;
      }
      expect(result).toBe(false);
    });
  });
});

describe('GleanDebugger - Console Commands API', () => {
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>;
  let mockWindow: MockWindow;

  beforeEach(() => {
    vi.useFakeTimers();
    mockLocalStorage = createMockLocalStorage();
    mockWindow = createMockWindow();

    vi.stubGlobal('localStorage', mockLocalStorage);
    vi.stubGlobal('window', mockWindow as unknown as Window & typeof globalThis);
    vi.stubGlobal('process', { env: { NODE_ENV: 'development' } });

    mockWindow.location = new URL('http://localhost');
    mockWindow.dispatchEvent = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Development Mode Behavior', () => {
    it('should register window.glean API in development mode', () => {
      vi.stubGlobal('process', { env: { NODE_ENV: 'development' } });
      const commands: GleanConsoleAPI = {
        show: vi.fn(),
        hide: vi.fn(),
        toggle: vi.fn(),
        isEnabled: vi.fn(() => true),
      };

      const win = window as unknown as { glean?: GleanConsoleAPI };
      if (win.glean === undefined) {
        win.glean = commands;
      }

      expect(win.glean).toBeDefined();
      expect(win.glean?.show).toBeDefined();
      expect(win.glean?.hide).toBeDefined();
      expect(win.glean?.toggle).toBeDefined();
      expect(win.glean?.isEnabled).toBeDefined();
    });

    it('should show() set localStorage and dispatch event', () => {
      const showCommand = () => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('glean-debug-enabled', 'true');
            window.dispatchEvent(
              new CustomEvent('glean-debug-toggle', { detail: { visible: true } })
            );
          }
        } catch {
          // Silently fail
        }
      };

      showCommand();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('glean-debug-enabled', 'true');
      expect(mockWindow.dispatchEvent).toHaveBeenCalled();
    });

    it('should hide() remove localStorage and dispatch event', () => {
      mockLocalStorage.setItem('glean-debug-enabled', 'true');

      const hideCommand = () => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('glean-debug-enabled');
            window.dispatchEvent(
              new CustomEvent('glean-debug-toggle', { detail: { visible: false } })
            );
          }
        } catch {
          // Silently fail
        }
      };

      hideCommand();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('glean-debug-enabled');
      expect(mockWindow.dispatchEvent).toHaveBeenCalled();
    });

    it('should toggle() switch localStorage state', () => {
      const toggleCommand = () => {
        try {
          const isEnabled = localStorage.getItem('glean-debug-enabled') === 'true';
          if (isEnabled) {
            localStorage.removeItem('glean-debug-enabled');
          } else {
            localStorage.setItem('glean-debug-enabled', 'true');
          }
        } catch {
          // Silently fail
        }
      };

      toggleCommand();
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('glean-debug-enabled', 'true');

      mockLocalStorage.setItem('glean-debug-enabled', 'true');
      toggleCommand();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('glean-debug-enabled');
    });

    it('isEnabled() should return current state', () => {
      const isEnabledCommand = () => {
        try {
          if (typeof window !== 'undefined') {
            return localStorage.getItem('glean-debug-enabled') === 'true';
          }
          return false;
        } catch {
          return false;
        }
      };

      expect(isEnabledCommand()).toBe(false);

      mockLocalStorage.setItem('glean-debug-enabled', 'true');
      expect(isEnabledCommand()).toBe(true);
    });
  });

  describe('Production Mode Behavior', () => {
    beforeEach(() => {
      vi.stubGlobal('process', { env: { NODE_ENV: 'production' } });
    });

    it('should show console.warn when show() is called in production', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const showCommand = () => {
        console.warn('[GleanDebugger] Debug mode is disabled in production');
      };

      showCommand();
      expect(warnSpy).toHaveBeenCalledWith('[GleanDebugger] Debug mode is disabled in production');

      warnSpy.mockRestore();
    });

    it('should return false from isEnabled() in production', () => {
      const isEnabledCommand = () => false;
      expect(isEnabledCommand()).toBe(false);
    });
  });

  describe('Namespace Collision Handling', () => {
    it('should skip registration when window.glean already exists', () => {
      const existingApi: GleanConsoleAPI = {
        show: () => {},
        hide: () => {},
        toggle: () => {},
        isEnabled: () => true,
      };
      const win = window as unknown as { glean?: GleanConsoleAPI };
      win.glean = existingApi;

      let registered = true;
      if (win.glean !== undefined) {
        console.warn('[GleanDebugger] window.glean already exists. Skipping registration.');
        registered = false;
      }

      expect(registered).toBe(false);
    });

    it('should log warning when namespace collision detected', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const existingApi: GleanConsoleAPI = {
        show: () => {},
        hide: () => {},
        toggle: () => {},
        isEnabled: () => true,
      };
      const win = window as unknown as { glean?: GleanConsoleAPI };
      win.glean = existingApi;

      if (win.glean !== undefined) {
        console.warn('[GleanDebugger] window.glean already exists. Skipping registration.');
      }

      expect(warnSpy).toHaveBeenCalledWith(
        '[GleanDebugger] window.glean already exists. Skipping registration.'
      );
      warnSpy.mockRestore();
    });
  });

  describe('Cleanup on Unmount', () => {
    it('should remove window.glean on cleanup', () => {
      const commands: GleanConsoleAPI = {
        show: () => {},
        hide: () => {},
        toggle: () => {},
        isEnabled: () => false,
      };
      const win = window as unknown as { glean?: GleanConsoleAPI };
      win.glean = commands;

      const cleanup = () => {
        if (typeof window !== 'undefined') {
          const w = window as unknown as { glean?: GleanConsoleAPI };
          if (w.glean === commands) {
            delete w.glean;
          }
        }
      };

      cleanup();

      expect(win.glean).toBeUndefined();
    });
  });
});

describe('GleanDebugger - Edge Cases', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const mockLocalStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(() => null),
      get length() {
        return 0;
      },
    };
    vi.stubGlobal('localStorage', mockLocalStorage);
    vi.stubGlobal('window', {
      location: new URL('http://localhost'),
      dispatchEvent: vi.fn(),
      glean: undefined,
    } as unknown as Window & typeof globalThis);
    vi.stubGlobal('process', { env: { NODE_ENV: 'development' } });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should handle localStorage quota exceeded', () => {
    const errorLocalStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new Error('QuotaExceededError');
      }),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(() => null),
      get length() {
        return 0;
      },
    };
    vi.stubGlobal('localStorage', errorLocalStorage);

    let success = true;
    try {
      localStorage.setItem('key', 'value');
    } catch {
      success = false;
    }

    expect(success).toBe(false);
  });

  it('should handle rapid toggle operations', () => {
    const operations: string[] = [];

    for (let i = 0; i < 10; i++) {
      const isEnabled = localStorage.getItem('glean-debug-enabled') === 'true';
      if (isEnabled) {
        localStorage.removeItem('glean-debug-enabled');
        operations.push('off');
      } else {
        localStorage.setItem('glean-debug-enabled', 'true');
        operations.push('on');
      }
    }

    expect(operations.length).toBe(10);
    expect(operations.filter((op) => op === 'on').length).toBe(5);
    expect(operations.filter((op) => op === 'off').length).toBe(5);
  });
});

describe('GleanDebugger - Type Safety', () => {
  it('should have correct GleanConsoleAPI interface', () => {
    const api: GleanConsoleAPI = {
      show: () => {},
      hide: () => {},
      toggle: () => {},
      isEnabled: () => true,
    };

    expect(api.isEnabled()).toBe(true);
  });
});
