import { useState, useCallback } from 'react';

export interface UseSettingsDropdownReturn {
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
}

export function useSettingsDropdown(): UseSettingsDropdownReturn {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  return { isSettingsOpen, openSettings, closeSettings, toggleSettings };
}
