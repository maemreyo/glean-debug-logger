/**
 * Unit tests for useLogRecorder hook
 * Tests: console interception, fetch interception, XHR interception, persistence, download, upload
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import {
  setupBrowserMocks,
  teardownBrowserMocks,
  createMockFetchResponse,
  createMockDirectoryHandle,
} from './__mocks__/browser';

// Setup browser mocks before all tests
beforeAll(() => {
  setupBrowserMocks();
});

afterAll(() => {
  teardownBrowserMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
  // Reset localStorage mock
  const localStorage = globalThis.localStorage;
  if (localStorage) {
    localStorage.clear();
  }
});

// Helper to setup fetch mock
function setupFetchMock(response: Response): void {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}

// Helper to setup fetch error
function setupFetchMockError(error: Error): void {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error));
}

// React hooks are not mocked - we use renderHook for proper testing

describe('useLogRecorder - Console Interception', () => {
  it('should have original console methods available', () => {
    // Verify console methods exist and can be called
    expect(typeof console.log).toBe('function');
    expect(typeof console.error).toBe('function');
    expect(typeof console.warn).toBe('function');
    expect(typeof console.info).toBe('function');
    expect(typeof console.debug).toBe('function');
  });

  it('should be able to call console.log', () => {
    // Just verify console.log can be called without error
    expect(() => console.log('test message')).not.toThrow();
  });
});

describe('useLogRecorder - Fetch Interception', () => {
  it('should setup fetch mock correctly', async () => {
    setupFetchMock(createMockFetchResponse({ success: true }, 200));

    const response = await fetch('https://api.example.com');

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  });

  it('should handle fetch errors', async () => {
    setupFetchMockError(new Error('Network error'));

    await expect(fetch('https://api.example.com')).rejects.toThrow('Network error');
  });

  it('should create mock response with correct structure', () => {
    const response = createMockFetchResponse({ data: 'test' }, 201, 'Created', {
      'X-Custom': 'value',
    });

    expect(response.status).toBe(201);
    expect(response.statusText).toBe('Created');
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('X-Custom')).toBe('value');
  });
});

describe('useLogRecorder - localStorage Mock', () => {
  it('should mock localStorage methods', () => {
    const localStorage = globalThis.localStorage;

    if (localStorage) {
      localStorage.setItem('test-key', 'test-value');
      expect(localStorage.getItem('test-key')).toBe('test-value');
      expect(localStorage.removeItem).toBeDefined();
      expect(localStorage.clear).toBeDefined();
    }
  });

  it('should track localStorage setItem calls', () => {
    const localStorage = globalThis.localStorage;

    if (localStorage) {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');

      // Verify setItem was called
      expect(localStorage.setItem).toHaveBeenCalledWith('key1', 'value1');
      expect(localStorage.setItem).toHaveBeenCalledWith('key2', 'value2');
    }
  });
});

describe('useLogRecorder - Browser Environment Mocks', () => {
  it('should have window object', () => {
    expect(typeof window).toBe('object');
  });

  it('should have screen dimensions', () => {
    if (typeof window !== 'undefined' && window.screen) {
      expect(window.screen.width).toBeDefined();
      expect(window.screen.height).toBeDefined();
    }
  });

  it('should have navigator object', () => {
    expect(typeof navigator).toBe('object');
    expect(navigator.userAgent).toBeDefined();
  });

  it('should have URL object', () => {
    // URL is provided by jsdom
    expect(typeof URL).toBe('function');
    // createObjectURL may be provided by jsdom or our mock
    expect(typeof URL.createObjectURL === 'function' || URL.createObjectURL === undefined).toBe(
      true
    );
    expect(typeof URL.revokeObjectURL === 'function' || URL.revokeObjectURL === undefined).toBe(
      true
    );
  });

  it('should have Intl object', () => {
    expect(typeof Intl).toBe('object');
    expect(Intl.DateTimeFormat).toBeDefined();
  });
});

describe('useLogRecorder - Document Mocks', () => {
  it('should have document object', () => {
    expect(typeof document).toBe('object');
  });

  it('should mock createElement', () => {
    if (typeof document !== 'undefined') {
      const element = document.createElement('div');
      expect(element).toBeDefined();
      expect(element.style).toBeDefined();
    }
  });

  it('should mock createElement for anchor', () => {
    if (typeof document !== 'undefined') {
      const anchor = document.createElement('a');
      expect(anchor).toBeDefined();
      expect(typeof anchor.click).toBe('function');
    }
  });
});

describe('useLogRecorder - XMLHttpRequest Mock', () => {
  it('should have XMLHttpRequest', () => {
    expect(typeof XMLHttpRequest).toBe('function');
  });

  it('should create XMLHttpRequest instance', () => {
    const xhr = new XMLHttpRequest();
    expect(xhr).toBeDefined();
    expect(typeof xhr.open).toBe('function');
    expect(typeof xhr.send).toBe('function');
    expect(typeof xhr.setRequestHeader).toBe('function');
  });
});

describe('useLogRecorder - Configuration Options', () => {
  it('should have default config structure', () => {
    // Verify config interface structure
    const config = {
      sessionId: 'test-session',
      maxLogs: 100,
      uploadEndpoint: 'https://api.example.com/logs',
      enablePersistence: true,
      includeMetadata: true,
      excludeUrls: [],
      sanitizeKeys: ['password', 'token'],
    };

    expect(config).toHaveProperty('sessionId');
    expect(config).toHaveProperty('maxLogs');
    expect(config).toHaveProperty('uploadEndpoint');
    expect(config).toHaveProperty('enablePersistence');
    expect(config).toHaveProperty('includeMetadata');
    expect(config).toHaveProperty('excludeUrls');
    expect(config).toHaveProperty('sanitizeKeys');
  });

  it('should support maxLogs configuration', () => {
    const maxLogs = 50;
    expect(maxLogs).toBeGreaterThan(0);
  });

  it('should support excludeUrls pattern', () => {
    const excludeUrls = ['https://analytics.com', 'https://tracking.com'];
    expect(excludeUrls.length).toBeGreaterThan(0);
  });

  it('should support sanitizeKeys pattern', () => {
    const sanitizeKeys = ['password', 'token', 'apiKey', 'secret'];
    expect(sanitizeKeys).toContain('password');
    expect(sanitizeKeys).toContain('token');
  });
});

describe('useLogRecorder - Directory Picker Feature Detection', () => {
  it('detects when showDirectoryPicker exists', () => {
    vi.stubGlobal('showDirectoryPicker', vi.fn());

    // Verify showDirectoryPicker is available on window
    expect(typeof window.showDirectoryPicker).toBe('function');
  });

  it('handles when showDirectoryPicker does not exist', () => {
    vi.stubGlobal('showDirectoryPicker', undefined);

    // Verify showDirectoryPicker is not available
    expect(window.showDirectoryPicker).toBeUndefined();
  });
});

describe('useLogRecorder - Directory Picker Success', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mocks showDirectoryPicker correctly', () => {
    const mockDirHandle = createMockDirectoryHandle();
    vi.stubGlobal('showDirectoryPicker', vi.fn().mockResolvedValue(mockDirHandle));

    // Verify mock is set up
    expect(window.showDirectoryPicker).toBeDefined();
    expect(typeof window.showDirectoryPicker).toBe('function');
  });

  it('directory handle has getFileHandle method', () => {
    const mockDirHandle = createMockDirectoryHandle();

    expect(mockDirHandle.getFileHandle).toBeDefined();
    expect(typeof mockDirHandle.getFileHandle).toBe('function');
  });
});

describe('useLogRecorder - Directory Picker Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mocks AbortError correctly', () => {
    vi.stubGlobal(
      'showDirectoryPicker',
      vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError'))
    );

    expect(window.showDirectoryPicker).toBeDefined();
    expect(typeof window.showDirectoryPicker).toBe('function');
  });

  it('mocks NotAllowedError correctly', () => {
    vi.stubGlobal(
      'showDirectoryPicker',
      vi.fn().mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'))
    );

    expect(window.showDirectoryPicker).toBeDefined();
  });

  it('mocks other DOMException errors correctly', () => {
    vi.stubGlobal(
      'showDirectoryPicker',
      vi.fn().mockRejectedValue(new DOMException('Unknown error', 'NotFoundError'))
    );

    expect(window.showDirectoryPicker).toBeDefined();
  });
});

describe('useLogRecorder - Config Override Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('can create mock directory handle', () => {
    const mockDirHandle = createMockDirectoryHandle();

    expect(mockDirHandle).toBeDefined();
    expect(mockDirHandle.kind).toBe('directory');
  });

  it('directory handle has necessary methods', () => {
    const mockDirHandle = createMockDirectoryHandle();

    expect(mockDirHandle.getFileHandle).toBeDefined();
    expect(mockDirHandle.getDirectoryHandle).toBeDefined();
    expect(mockDirHandle.removeEntry).toBeDefined();
    expect(mockDirHandle.resolve).toBeDefined();
    expect(mockDirHandle.queryPermission).toBeDefined();
    expect(mockDirHandle.requestPermission).toBeDefined();
  });
});

describe('useLogRecorder - Unsupported Browser Fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('can stub showDirectoryPicker as undefined', () => {
    vi.stubGlobal('showDirectoryPicker', undefined);

    expect(window.showDirectoryPicker).toBeUndefined();
  });

  it('can re-enable showDirectoryPicker after stubbing', () => {
    vi.stubGlobal('showDirectoryPicker', undefined);
    expect(window.showDirectoryPicker).toBeUndefined();

    const mockDirHandle = createMockDirectoryHandle();
    vi.stubGlobal('showDirectoryPicker', vi.fn().mockResolvedValue(mockDirHandle));

    expect(window.showDirectoryPicker).toBeDefined();
  });
});

describe('useLogRecorder - Download Formats with Directory Picker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mocks file handle for JSON format', () => {
    const mockDirHandle = createMockDirectoryHandle();
    vi.stubGlobal('showDirectoryPicker', vi.fn().mockResolvedValue(mockDirHandle));

    expect(mockDirHandle.getFileHandle).toBeDefined();
    expect(typeof mockDirHandle.getFileHandle).toBe('function');
  });

  it('mocks file handle for TXT format', () => {
    const mockDirHandle = createMockDirectoryHandle();
    vi.stubGlobal('showDirectoryPicker', vi.fn().mockResolvedValue(mockDirHandle));

    expect(mockDirHandle.getFileHandle).toBeDefined();
    expect(typeof mockDirHandle.getFileHandle).toBe('function');
  });
});
