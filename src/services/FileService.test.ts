/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FileService } from './FileService';

describe('FileService', () => {
  const originalWindow = global.window;
  const originalDocument = global.document;
  const originalURL = global.URL;

  beforeEach(() => {
    // Reset supported state before each test
    (FileService as any).supported = null;

    // Setup basic DOM mock for all tests
    global.document = {
      createElement: vi.fn((tag) => ({
        tagName: tag.toUpperCase(),
        href: '',
        download: '',
        click: vi.fn(),
      })),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    } as any;

    global.URL = {
      createObjectURL: vi.fn(),
      revokeObjectURL: vi.fn(),
    } as any;
  });

  afterEach(() => {
    // Restore window and document
    global.window = originalWindow;
    global.document = originalDocument;
    global.URL = originalURL;
  });

  describe('isSupported', () => {
    it('should return true when showDirectoryPicker is available', () => {
      global.window = {
        showDirectoryPicker: vi.fn(),
      } as any;

      expect(FileService.isSupported()).toBe(true);
    });

    it('should return false when showDirectoryPicker is not available', () => {
      global.window = {} as any;

      expect(FileService.isSupported()).toBe(false);
    });

    it('should cache the result', () => {
      global.window = {
        showDirectoryPicker: vi.fn(),
      } as any;

      const firstCall = FileService.isSupported();
      const secondCall = FileService.isSupported();

      expect(firstCall).toBe(secondCall);
    });

    it('should return false when window is undefined', () => {
      global.window = undefined as any;

      expect(FileService.isSupported()).toBe(false);
    });
  });

  describe('saveToDirectory', () => {
    it('should throw error when File System Access API is not supported', async () => {
      global.window = {} as any;

      await expect(FileService.saveToDirectory('content', 'test.json')).rejects.toThrow(
        'File System Access API not supported'
      );
    });

    it('should save file to directory when API is supported', async () => {
      const writableMock = {
        write: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined),
      };

      const fileHandleMock = {
        createWritable: vi.fn().mockResolvedValue(writableMock),
      };

      const dirHandleMock = {
        getFileHandle: vi.fn().mockResolvedValue(fileHandleMock),
      };

      global.window = {
        showDirectoryPicker: vi.fn().mockResolvedValue(dirHandleMock),
      } as any;

      await FileService.saveToDirectory('test content', 'test.json');

      expect(global.window.showDirectoryPicker).toHaveBeenCalled();
      expect(dirHandleMock.getFileHandle).toHaveBeenCalledWith('test.json', { create: true });
      expect(fileHandleMock.createWritable).toHaveBeenCalled();
      expect(writableMock.write).toHaveBeenCalledWith('test content');
      expect(writableMock.close).toHaveBeenCalled();
    });

    it('should handle AbortError gracefully (user cancelled)', async () => {
      global.window = {
        showDirectoryPicker: vi.fn().mockRejectedValue(new Error('AbortError')),
      } as any;

      // Create an AbortError
      const abortError = new Error('User cancelled');
      abortError.name = 'AbortError';

      (global.window.showDirectoryPicker as any).mockRejectedValue(abortError);

      // Should not throw
      await expect(FileService.saveToDirectory('content', 'test.json')).resolves.toBeUndefined();
    });

    it('should rethrow non-AbortError errors', async () => {
      const error = new Error('Permission denied');
      global.window = {
        showDirectoryPicker: vi.fn().mockRejectedValue(error),
      } as any;

      await expect(FileService.saveToDirectory('content', 'test.json')).rejects.toThrow(
        'Permission denied'
      );
    });
  });

  describe('download', () => {
    it('should create Blob and trigger download', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:test-url');
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');
      const clickSpy = vi.fn();

      const anchorElement = {
        href: '',
        download: '',
        click: clickSpy,
      };

      createElementSpy.mockReturnValue(anchorElement as any);
      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = vi.fn();

      FileService.download('test content', 'test.json');

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalledWith(anchorElement);
      expect(anchorElement.href).toBe('blob:test-url');
      expect(anchorElement.download).toBe('test.json');
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(anchorElement);
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should use custom mimeType when provided', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:test-url');
      const createElementSpy = vi.spyOn(document, 'createElement');
      const clickSpy = vi.fn();

      const anchorElement = {
        href: '',
        download: '',
        click: clickSpy,
      };

      createElementSpy.mockReturnValue(anchorElement as any);
      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = vi.fn();

      const blobSpy = vi.spyOn(global, 'Blob').mockImplementation((content, options) => {
        return { content, type: options?.type } as any;
      });

      FileService.download('test content', 'test.txt', 'text/plain');

      expect(blobSpy).toHaveBeenCalledWith(['test content'], { type: 'text/plain' });

      blobSpy.mockRestore();
      createElementSpy.mockRestore();
    });
  });

  describe('downloadWithFallback', () => {
    it('should try saveToDirectory first when supported', async () => {
      const writableMock = {
        write: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined),
      };

      const fileHandleMock = {
        createWritable: vi.fn().mockResolvedValue(writableMock),
      };

      const dirHandleMock = {
        getFileHandle: vi.fn().mockResolvedValue(fileHandleMock),
      };

      global.window = {
        showDirectoryPicker: vi.fn().mockResolvedValue(dirHandleMock),
      } as any;

      const downloadSpy = vi.spyOn(FileService, 'download');

      await FileService.downloadWithFallback('test content', 'test.json');

      expect(global.window.showDirectoryPicker).toHaveBeenCalled();
      expect(downloadSpy).not.toHaveBeenCalled();

      downloadSpy.mockRestore();
    });

    it('should fallback to download when not supported', () => {
      global.window = {} as any;

      const downloadSpy = vi.spyOn(FileService, 'download');

      FileService.downloadWithFallback('test content', 'test.json');

      expect(downloadSpy).toHaveBeenCalledWith('test content', 'test.json', 'application/json');

      downloadSpy.mockRestore();
    });

    it('should fallback to download on non-AbortError', async () => {
      const error = new Error('Permission denied');
      global.window = {
        showDirectoryPicker: vi.fn().mockRejectedValue(error),
      } as any;

      const downloadSpy = vi.spyOn(FileService, 'download');

      await FileService.downloadWithFallback('test content', 'test.json');

      expect(downloadSpy).toHaveBeenCalledWith('test content', 'test.json', 'application/json');

      downloadSpy.mockRestore();
    });

    it('should not fallback on AbortError (user cancelled)', async () => {
      const abortError = new Error('User cancelled');
      abortError.name = 'AbortError';

      global.window = {
        showDirectoryPicker: vi.fn().mockRejectedValue(abortError),
      } as any;

      const downloadSpy = vi.spyOn(FileService, 'download');

      await FileService.downloadWithFallback('test content', 'test.json');

      expect(downloadSpy).not.toHaveBeenCalled();

      downloadSpy.mockRestore();
    });

    it('should use custom mimeType when provided', async () => {
      const downloadSpy = vi.spyOn(FileService, 'download');

      global.window = {} as any;

      await FileService.downloadWithFallback('test content', 'test.txt', 'text/plain');

      expect(downloadSpy).toHaveBeenCalledWith('test content', 'test.txt', 'text/plain');

      downloadSpy.mockRestore();
    });
  });
});
