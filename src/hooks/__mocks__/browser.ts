/**
 * Browser globals mock setup for vitest
 * Used for testing useLogRecorder hook in node environment
 */

import { vi, type SpyInstance } from 'vitest';

// Storage for original console methods
let originalConsole: {
  log: typeof console.log;
  error: typeof console.error;
  warn: typeof console.warn;
  info: typeof console.info;
  debug: typeof console.debug;
};

// Mock storage for localStorage simulation
const localStorageMock = new Map<string, string>();

// Mock for XMLHttpRequest
const createMockXHR = (): {
  open: SpyInstance;
  send: SpyInstance;
  setRequestHeader: SpyInstance;
  addEventListener: SpyInstance;
  dispatchEvent: SpyInstance;
  readyState: number;
  status: number;
  statusText: string;
  responseText: string;
} => {
  const open = vi.fn();
  const send = vi.fn();
  const setRequestHeader = vi.fn();
  const addEventListener = vi.fn();
  const dispatchEvent = vi.fn();

  return {
    open,
    send,
    setRequestHeader,
    addEventListener,
    dispatchEvent,
    readyState: 4,
    status: 200,
    statusText: 'OK',
    responseText: '{}',
  };
};

// Mock for document.createElement
const createMockAnchorElement = (): {
  click: SpyInstance;
  setAttribute: SpyInstance;
  href: string;
  download: string;
  style: Record<string, string>;
} => {
  return {
    click: vi.fn(),
    setAttribute: vi.fn(),
    href: '',
    download: '',
    style: {},
  };
};

// Storage for mock file handles and permission states
const mockFileHandles = new Map<string, ReturnType<typeof createMockFileHandle>>();
const mockPermissionStates = new Map<string, PermissionState>();

/**
 * Create a mock FileSystemWritableFileStream
 */
const createMockWritableStream = (
  filename: string
): {
  write: SpyInstance;
  close: SpyInstance;
  closed: boolean;
} => {
  let closed = false;
  return {
    write: vi.fn((data: string | Uint8Array | Blob) => {
      // Store the data for testing
      const fileHandle = mockFileHandles.get(filename);
      if (fileHandle) {
        fileHandle.content =
          typeof data === 'string'
            ? data
            : data instanceof Uint8Array
              ? new TextDecoder().decode(data)
              : '';
      }
    }),
    close: vi.fn(() => {
      closed = true;
    }),
    get closed() {
      return closed;
    },
  };
};

/**
 * Create a mock FileSystemFileHandle
 */
export function createMockFileHandle(
  name: string,
  content = ''
): {
  kind: 'file';
  name: string;
  content: string;
  createWritable: SpyInstance;
  getFile: SpyInstance;
  isSameEntry: SpyInstance;
} {
  const handle = {
    kind: 'file' as const,
    name,
    content,
    createWritable: vi.fn(async () => {
      return createMockWritableStream(name);
    }),
    getFile: vi.fn(async () => {
      return new File([content], name, { type: 'text/plain' });
    }),
    isSameEntry: vi.fn(async () => false),
  };
  mockFileHandles.set(name, handle);
  return handle;
}

/**
 * Create a mock FileSystemDirectoryHandle
 */
export function createMockDirectoryHandle(
  name = 'mock-directory',
  permissionState: PermissionState = 'granted'
): {
  kind: 'directory';
  name: string;
  getFileHandle: SpyInstance;
  getDirectoryHandle: SpyInstance;
  removeEntry: SpyInstance;
  resolve: SpyInstance;
  queryPermission: SpyInstance;
  requestPermission: SpyInstance;
} {
  return {
    kind: 'directory' as const,
    name,
    getFileHandle: vi.fn(async (fileName: string, options?: { create: boolean }) => {
      if (mockFileHandles.has(fileName)) {
        return mockFileHandles.get(fileName)!;
      }
      if (options?.create) {
        return createMockFileHandle(fileName);
      }
      throw new Error(`File not found: ${fileName}`);
    }),
    getDirectoryHandle: vi.fn(async (dirName: string, options?: { create: boolean }) => {
      if (options?.create) {
        return createMockDirectoryHandle(dirName);
      }
      throw new Error(`Directory not found: ${dirName}`);
    }),
    removeEntry: vi.fn(async (name: string) => {
      mockFileHandles.delete(name);
    }),
    resolve: vi.fn(async () => []),
    queryPermission: vi.fn(async () => permissionState),
    requestPermission: vi.fn(async () => {
      mockPermissionStates.set(name, 'granted');
      return 'granted';
    }),
  };
}

/**
 * Create a mock showDirectoryPicker function
 */
export function createMockDirectoryPicker(
  directoryHandle?: ReturnType<typeof createMockDirectoryHandle>
): SpyInstance {
  return vi.fn(async () => {
    return directoryHandle || createMockDirectoryHandle();
  });
}

/**
 * Helper to get mock file handle content
 */
export function getMockFileContent(filename: string): string {
  const handle = mockFileHandles.get(filename);
  return handle?.content ?? '';
}

/**
 * Helper to clear all mock file handles
 */
export function clearMockFileHandles(): void {
  mockFileHandles.clear();
  mockPermissionStates.clear();
}

/**
 * Helper to set mock permission state for a directory
 */
export function setMockPermissionState(handleName: string, state: PermissionState): void {
  mockPermissionStates.set(handleName, state);
}

/**
 * Helper to reset File System Access API mocks
 */
export function resetFileSystemMocks(): void {
  clearMockFileHandles();
  vi.stubGlobal('showDirectoryPicker', createMockDirectoryPicker());
}

/**
 * Setup all browser mocks before each test
 */
export function setupBrowserMocks(): void {
  // Store original console methods
  originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
  };

  // Reset localStorage mock
  localStorageMock.clear();

  // Mock localStorage
  const mockLocalStorage = {
    getItem: vi.fn((_key: string): string | null => {
      return localStorageMock.get(_key) ?? null;
    }),
    setItem: vi.fn((key: string, value: string): void => {
      localStorageMock.set(key, value);
    }),
    removeItem: vi.fn((key: string): void => {
      localStorageMock.delete(key);
    }),
    clear: vi.fn((): void => {
      localStorageMock.clear();
    }),
    get length(): number {
      return localStorageMock.size;
    },
    key: vi.fn((_index: number): string | null => {
      const keys = Array.from(localStorageMock.keys());
      return keys[_index] ?? null;
    }),
  };
  vi.stubGlobal('localStorage', mockLocalStorage);

  // Mock sessionStorage
  const mockSessionStorage = {
    getItem: vi.fn((_key: string): string | null => null),
    setItem: vi.fn((): void => {}),
    removeItem: vi.fn((): void => {}),
    clear: vi.fn((): void => {}),
    get length(): number {
      return 0;
    },
    key: vi.fn((): string | null => null),
  };
  vi.stubGlobal('sessionStorage', mockSessionStorage);

  // Mock window.fetch
  const mockFetch = vi
    .fn()
    .mockImplementation(
      (_url: string | URL | Request, _options?: RequestInit): Promise<Response> => {
        return Promise.resolve(
          new Response('{}', {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }
    );
  vi.stubGlobal('fetch', mockFetch);

  // Mock XMLHttpRequest
  const MockXHR = vi.fn(() => createMockXHR());
  vi.stubGlobal('XMLHttpRequest', MockXHR);

  // Mock document object first
  const mockDocument = {
    body: {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    },
    createElement: vi.fn((tag: string): HTMLElement => {
      if (tag === 'a') {
        return createMockAnchorElement() as unknown as HTMLElement;
      }
      return {
        style: {},
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
        remove: vi.fn(),
      } as unknown as HTMLElement;
    }),
    querySelector: vi.fn(),
    querySelectorAll: vi.fn(),
  };
  vi.stubGlobal('document', mockDocument);

  // Mock Element.prototype methods if Element exists
  if (typeof Element !== 'undefined') {
    Element.prototype.appendChild = vi.fn();
    Element.prototype.removeChild = vi.fn();
  }

  clearMockFileHandles();
  vi.stubGlobal('showDirectoryPicker', createMockDirectoryPicker());
}

/**
 * Cleanup and restore original browser globals after each test
 */
export function teardownBrowserMocks(): void {
  // Restore original console methods
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;

  // Restore original methods and cleanup
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
}

/**
 * Helper to set localStorage value (for testing persistence)
 */
export function setLocalStorageValue(key: string, value: string): void {
  localStorageMock.set(key, value);
}

/**
 * Helper to clear localStorage (for testing)
 */
export function clearLocalStorageMock(): void {
  localStorageMock.clear();
}

/**
 * Helper to get localStorage value (for verification)
 */
export function getLocalStorageValue(key: string): string | null {
  return localStorageMock.get(key) ?? null;
}

/**
 * Create a mock fetch response for testing
 */
export function createMockFetchResponse(
  body: string | object,
  status: number = 200,
  statusText: string = 'OK',
  headers: Record<string, string> = {}
): Response {
  const responseBody = typeof body === 'object' ? JSON.stringify(body) : body;
  return new Response(responseBody, {
    status,
    statusText,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

/**
 * Setup fetch mock to return specific response
 */
export function setupFetchMock(response: Response): void {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}

/**
 * Setup fetch mock to throw error
 */
export function setupFetchMockError(error: Error): void {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error));
}

/**
 * Create mock XHR instance for testing
 */
export function createMockXHRInstance(): ReturnType<typeof createMockXHR> {
  return createMockXHR();
}
