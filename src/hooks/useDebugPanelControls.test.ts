/**
 * Unit tests for useDebugPanelControls hook
 * Tests: state management, keyboard shortcuts, feature detection
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebugPanelControls } from './useDebugPanelControls';
import { FileService } from '../services/FileService';

beforeEach(() => {
  // ShowDirectoryPicker is available by default in jsdom environment
  vi.stubGlobal('showDirectoryPicker', vi.fn());
  // Reset FileService cache
  (FileService as any).supported = null;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useDebugPanelControls - Initial State', () => {
  it('should have isOpen state start as false', () => {
    const { result } = renderHook(() => useDebugPanelControls());
    expect(result.current.isOpen).toBe(false);
  });

  it('should have supportsDirectoryPicker reflect FileService.isSupported()', () => {
    const { result } = renderHook(() => useDebugPanelControls());
    expect(result.current.supportsDirectoryPicker).toBe(true);
  });
});

describe('useDebugPanelControls - toggle()', () => {
  it('should flip isOpen state from false to true', () => {
    const { result } = renderHook(() => useDebugPanelControls());
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should flip isOpen state from true to false', () => {
    const { result } = renderHook(() => useDebugPanelControls());

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });
});

describe('useDebugPanelControls - open()', () => {
  it('should set isOpen to true when closed', () => {
    const { result } = renderHook(() => useDebugPanelControls());
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should keep isOpen as true when already open', () => {
    const { result } = renderHook(() => useDebugPanelControls());

    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);
  });
});

describe('useDebugPanelControls - close()', () => {
  it('should set isOpen to false when open', () => {
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

  it('should keep isOpen as false when already closed', () => {
    const { result } = renderHook(() => useDebugPanelControls());
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });
});

describe('useDebugPanelControls - Keyboard Shortcuts', () => {
  it('should trigger toggle on Ctrl+Shift+D', () => {
    const { result } = renderHook(() => useDebugPanelControls());
    expect(result.current.isOpen).toBe(false);

    const event = new KeyboardEvent('keydown', {
      key: 'D',
      ctrlKey: true,
      shiftKey: true,
    });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should prevent default on Ctrl+Shift+D', () => {
    const { result } = renderHook(() => useDebugPanelControls());

    const event = new KeyboardEvent('keydown', {
      key: 'D',
      ctrlKey: true,
      shiftKey: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    act(() => {
      document.dispatchEvent(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should trigger close on Escape when open', () => {
    const { result } = renderHook(() => useDebugPanelControls());

    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
    });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should prevent default on Escape when open', () => {
    const { result } = renderHook(() => useDebugPanelControls());

    act(() => {
      result.current.open();
    });

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    act(() => {
      document.dispatchEvent(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not trigger close on Escape when closed', () => {
    const { result } = renderHook(() => useDebugPanelControls());
    expect(result.current.isOpen).toBe(false);

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
    });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should not trigger on Ctrl+D without Shift', () => {
    const { result } = renderHook(() => useDebugPanelControls());
    expect(result.current.isOpen).toBe(false);

    const event = new KeyboardEvent('keydown', {
      key: 'D',
      ctrlKey: true,
      shiftKey: false,
    });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should not trigger on Shift+D without Ctrl', () => {
    const { result } = renderHook(() => useDebugPanelControls());
    expect(result.current.isOpen).toBe(false);

    const event = new KeyboardEvent('keydown', {
      key: 'D',
      ctrlKey: false,
      shiftKey: true,
    });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should not trigger on lowercase d', () => {
    const { result } = renderHook(() => useDebugPanelControls());
    expect(result.current.isOpen).toBe(false);

    const event = new KeyboardEvent('keydown', {
      key: 'd',
      ctrlKey: true,
      shiftKey: true,
    });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(result.current.isOpen).toBe(false);
  });
});

describe('useDebugPanelControls - supportsDirectoryPicker', () => {
  it('should return true when showDirectoryPicker exists', () => {
    vi.stubGlobal('showDirectoryPicker', vi.fn());
    (FileService as any).supported = null;

    const { result } = renderHook(() => useDebugPanelControls());
    expect(result.current.supportsDirectoryPicker).toBe(true);
  });

  it('should return false when showDirectoryPicker does not exist', () => {
    // Delete showDirectoryPicker property from window
    delete (window as any).showDirectoryPicker;
    (FileService as any).supported = null;
    
    const isSupported = FileService.isSupported();
    expect(isSupported).toBe(false);
  });
});

describe('useDebugPanelControls - Cleanup', () => {
  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useDebugPanelControls());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});

describe('useDebugPanelControls - API Interface', () => {
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
