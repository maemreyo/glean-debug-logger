import { useState, useEffect, useCallback } from 'react';
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
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggle, close]);

  return {
    isOpen,
    toggle,
    open,
    close,
    supportsDirectoryPicker,
  };
}
