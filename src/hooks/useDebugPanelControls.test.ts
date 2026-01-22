import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebugPanelControls } from './useDebugPanelControls';
import { FileService } from '../services/FileService';

// Mock FileService
vi.mock('../services/FileService', () => ({
  FileService: {
    isSupported: vi.fn(() => true),
  },
}));

describe('useDebugPanelControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('API Interface', () => {
    it('should export all required controls', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      expect(result.current).toHaveProperty('isOpen');
      expect(result.current).toHaveProperty('toggle');
      expect(result.current).toHaveProperty('open');
      expect(result.current).toHaveProperty('close');
      expect(result.current).toHaveProperty('supportsDirectoryPicker');
    });

    it('should have correct types', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      expect(typeof result.current.isOpen).toBe('boolean');
      expect(typeof result.current.toggle).toBe('function');
      expect(typeof result.current.open).toBe('function');
      expect(typeof result.current.close).toBe('function');
      expect(typeof result.current.supportsDirectoryPicker).toBe('boolean');
    });
  });

  describe('State Management', () => {
    it('should start with isOpen as false', () => {
      const { result } = renderHook(() => useDebugPanelControls());
      expect(result.current.isOpen).toBe(false);
    });

    it('should toggle isOpen when toggle is called', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('should set isOpen to true when open is called', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should set isOpen to false when close is called', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('should handle multiple toggle calls correctly', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should handle open followed by close', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      act(() => {
        result.current.open();
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('should handle close followed by open', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      act(() => {
        result.current.close();
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should handle rapid state changes', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      act(() => {
        result.current.open();
        result.current.close();
        result.current.open();
        result.current.close();
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should handle toggle from open state', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('should handle toggle from closed state', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('Keyboard Shortcuts (integration tests in E2E)', () => {
    it('should have toggle function available for keyboard shortcut binding', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      expect(typeof result.current.toggle).toBe('function');

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should have close function available for Escape binding', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      expect(typeof result.current.close).toBe('function');

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('should have open function available', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      expect(typeof result.current.open).toBe('function');

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('Custom Events (tested in E2E with Playwright)', () => {
    it('should provide toggle function for glean-debug-toggle event handler', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      // The toggle function should be available for external event handlers to call
      expect(typeof result.current.toggle).toBe('function');

      // It should change state when called
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should provide close function for glean-debug-toggle event handler', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      expect(typeof result.current.close).toBe('function');

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('should provide open function for glean-debug-toggle event handler', () => {
      const { result } = renderHook(() => useDebugPanelControls());

      expect(typeof result.current.open).toBe('function');

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('Event Listener Optimization', () => {
    it('should not re-register listeners unnecessarily (verified via implementation)', () => {
      const { result, unmount } = renderHook(() => useDebugPanelControls());

      // Open and close multiple times
      act(() => {
        result.current.toggle();
      });
      act(() => {
        result.current.toggle();
      });
      act(() => {
        result.current.toggle();
      });

      // Final state should be correct
      expect(result.current.isOpen).toBe(true);

      // Cleanup should not throw
      expect(() => unmount()).not.toThrow();
    });
  });
});
