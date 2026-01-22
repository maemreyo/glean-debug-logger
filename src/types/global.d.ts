/**
 * Global type declarations for Glean Debug Logger
 * Extends Window interface for window.gleanDebugger
 */
declare global {
  interface Window {
    gleanDebugger?: {
      // Console interception
      interceptConsole: (options?: { levels?: string[] }) => void;

      // Network interception
      interceptNetwork: (options?: { includeCredentials?: boolean }) => void;

      // Data export
      exportLogs: (format?: 'json' | 'csv') => Promise<string>;

      // Storage
      saveToLocalStorage: () => void;
      loadFromLocalStorage: () => void;

      // UI controls
      showPanel: () => void;
      hidePanel: () => void;
      toggle: () => void;

      // Cleanup
      cleanup: () => void;
    };
  }
}

export {};
