'use client';

import { useMemo, useEffect, useCallback, type ReactNode } from 'react';
import { DebugPanel } from './DebugPanel';

interface GleanDebuggerProps {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
  environment?: string;
  uploadEndpoint?: string;
  fileNameTemplate?: string;
  maxLogs?: number;
  showInProduction?: boolean;
  children?: ReactNode;
}

// Console commands API type
interface GleanConsoleAPI {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  isEnabled: () => boolean;
}

// Declare window augmentation for TypeScript
declare global {
  interface Window {
    glean?: GleanConsoleAPI;
  }
}

// Hook for activation detection
function useGleanActivation(props: GleanDebuggerProps): boolean {
  return useMemo(() => {
    const original =
      props.showInProduction || props.environment === 'development' || props.user?.role === 'admin';

    if (original) return true;

    // URL param detection: ?debug=true
    const urlParam = (() => {
      try {
        if (typeof window !== 'undefined') {
          return new URLSearchParams(window.location.search).get('debug') === 'true';
        }
        return false;
      } catch {
        return false;
      }
    })();

    if (urlParam) return true;

    // localStorage detection: glean-debug-enabled=true
    const localStorageEnabled = (() => {
      try {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('glean-debug-enabled') === 'true';
        }
        return false;
      } catch {
        return false;
      }
    })();

    return localStorageEnabled;
  }, [props.showInProduction, props.environment, props.user]);
}

// Hook for console commands API
function useConsoleCommands() {
  const updateVisibility = useCallback((visible: boolean) => {
    try {
      if (typeof window !== 'undefined') {
        if (visible) {
          localStorage.setItem('glean-debug-enabled', 'true');
        } else {
          localStorage.removeItem('glean-debug-enabled');
        }
        window.dispatchEvent(new CustomEvent('glean-debug-toggle', { detail: { visible } }));
      }
    } catch {
      // Silently fail - localStorage might be unavailable
    }
  }, []);

  const isProduction = useMemo(() => {
    return typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const commands: GleanConsoleAPI = isProduction
      ? {
          show: () => console.warn('[GleanDebugger] Debug mode is disabled in production'),
          hide: () => console.warn('[GleanDebugger] Debug mode is disabled in production'),
          toggle: () => console.warn('[GleanDebugger] Debug mode is disabled in production'),
          isEnabled: () => false,
        }
      : {
          show: () => updateVisibility(true),
          hide: () => updateVisibility(false),
          toggle: () => {
            try {
              const isEnabled = localStorage.getItem('glean-debug-enabled') === 'true';
              updateVisibility(!isEnabled);
            } catch {
              // Silently fail
            }
          },
          isEnabled: () => {
            try {
              if (typeof window !== 'undefined') {
                return localStorage.getItem('glean-debug-enabled') === 'true';
              }
              return false;
            } catch {
              return false;
            }
          },
        };

    // Check for namespace collision
    if (window.glean !== undefined) {
      console.warn('[GleanDebugger] window.glean already exists. Skipping registration.');
      return;
    }

    // Register API
    window.glean = commands;

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && window.glean === commands) {
        delete window.glean;
      }
    };
  }, [updateVisibility, isProduction]);
}

export default function GleanDebugger(props: GleanDebuggerProps) {
  console.log('[GleanDebugger] Mounting with props:', props);
  const isActivated = useGleanActivation(props);
  console.log('[GleanDebugger] isActivated:', isActivated);

  // Initialize console commands API
  useConsoleCommands();

  // Don't render if not activated
  if (!isActivated) {
    console.log('[GleanDebugger] Not activated, returning null');
    return null;
  }

  console.log('[GleanDebugger] Rendering DebugPanel');
  // Render DebugPanel with all props
  return <DebugPanel {...props} />;
}
