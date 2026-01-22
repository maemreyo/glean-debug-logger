import { useState, useEffect, useCallback, useRef } from 'react';
import { FileService } from '../services/FileService';

export interface DebugPanelControls {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  supportsDirectoryPicker: boolean;
}

export function useDebugPanelControls(): DebugPanelControls {
  const [isOpen, setIsOpen] = useState(false);
  const [supportsDirectoryPicker, setSupportsDirectoryPicker] = useState(false);

  // Track isOpen state for use in event listeners without causing effect re-runs
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  // Debounce rapid glean-debug-toggle events to prevent state flickering
  const toggleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSupportsDirectoryPicker(FileService.isSupported());
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && isOpenRef.current) {
        e.preventDefault();
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Listen for glean-debug-toggle events from console API
    const handleToggleEvent = (e: CustomEvent<{ visible: boolean }>) => {
      if (typeof e.detail?.visible === 'boolean') {
        // Debounce rapid events to prevent state flickering
        if (toggleTimeoutRef.current) {
          clearTimeout(toggleTimeoutRef.current);
        }
        toggleTimeoutRef.current = setTimeout(() => {
          setIsOpen(e.detail.visible);
        }, 10);
      }
    };

    window.addEventListener('glean-debug-toggle', handleToggleEvent as EventListener);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('glean-debug-toggle', handleToggleEvent as EventListener);
    };
  }, [toggle, close]);

  return {
    isOpen,
    toggle,
    open,
    close,
    supportsDirectoryPicker,
  };
}
