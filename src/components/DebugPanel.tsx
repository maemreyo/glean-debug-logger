'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLogRecorder } from '../hooks/useLogRecorder';
import {
  toggleButtonStyles,
  badgeStyles,
  errorBadgeStyles,
  panelStyles,
  headerStyles,
  headerTitleWrapperStyles,
  headerTitleStyles,
  headerSubtitleStyles,
  closeButtonStyles,
  statsGridStyles,
  statItemStyles,
  statValueStyles,
  statLabelStyles,
  errorValueStyles,
  networkErrorValueStyles,
  detailsStyles,
  summaryStyles,
  sessionInfoStyles,
  actionsStyles,
  actionGroupStyles,
  labelStyles,
  buttonRowStyles,
  downloadButtonStyles,
  saveToDirectoryButtonStyles,
  uploadButtonStyles,
  dangerButtonStyles,
  successMessageStyles,
  errorMessageStyles,
  footerStyles,
  footerTipStyles,
} from './DebugPanel.styles';

interface DebugPanelProps {
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
}

export function DebugPanel({
  user,
  environment = process.env.NODE_ENV || 'development',
  uploadEndpoint,
  fileNameTemplate = '{env}_{date}_{time}_{userId}_{errorCount}errors',
  maxLogs = 2000,
  showInProduction = false,
}: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [directoryStatus, setDirectoryStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Refs for focus management
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { downloadLogs, uploadLogs, clearLogs, getLogCount, getMetadata, sessionId } =
    useLogRecorder({
      fileNameTemplate,
      environment,
      userId: user?.id || user?.email || 'guest',
      includeMetadata: true,
      uploadEndpoint,
      maxLogs,
      captureConsole: true,
      captureFetch: true,
      captureXHR: true,
      sanitizeKeys: ['password', 'token', 'apiKey', 'secret', 'authorization', 'creditCard'],
      excludeUrls: ['/api/analytics', 'google-analytics.com', 'facebook.com', 'vercel.com'],
    });

  const logCount = getLogCount();
  const metadata = getMetadata();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Close panel on Escape when open
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  useEffect(() => {
    if (metadata.errorCount >= 5 && uploadEndpoint) {
      const errorHandler = async () => {
        try {
          await uploadLogs();
        } catch {
          console.warn('[DebugPanel] Failed to auto-upload logs');
        }
      };
      window.addEventListener('error', errorHandler);
      return () => window.removeEventListener('error', errorHandler);
    }
    return undefined;
  }, [metadata.errorCount, uploadEndpoint, uploadLogs]);

  const handleUpload = useCallback(async () => {
    setIsUploading(true);
    setUploadStatus(null);

    try {
      const result = await uploadLogs();

      if (result.success) {
        setUploadStatus({
          type: 'success',
          message: `Uploaded successfully! ${result.data ? JSON.stringify(result.data) : ''}`,
        });

        if (result.data && typeof result.data === 'object' && 'url' in result.data) {
          await navigator.clipboard.writeText(String((result.data as { url: string }).url));
        }
      } else {
        setUploadStatus({
          type: 'error',
          message: `Upload failed: ${result.error}`,
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsUploading(false);
    }
  }, [uploadLogs]);

  const handleDownload = useCallback(
    (format: 'json' | 'txt') => {
      const filename = downloadLogs(format);
      if (filename) {
        setUploadStatus({
          type: 'success',
          message: `Downloaded: ${filename}`,
        });
      }
    },
    [downloadLogs]
  );

  const handleSaveToDirectory = useCallback(async () => {
    setDirectoryStatus(null);
    try {
      const supportsFileSystemAccess = 'showDirectoryPicker' in window;
      if (!supportsFileSystemAccess) {
        setDirectoryStatus({
          type: 'error',
          message: 'Feature only supported in Chrome/Edge',
        });
        return;
      }

      const filename = await downloadLogs('json', undefined, { showPicker: true });
      if (filename) {
        setDirectoryStatus({
          type: 'success',
          message: 'Saved to directory',
        });
      }
    } catch (err) {
      setDirectoryStatus({
        type: 'error',
        message: 'Unable to save. Please try again or choose a different location.',
      });
    }
  }, [downloadLogs]);

  useEffect(() => {
    if (directoryStatus) {
      const timer = setTimeout(() => {
        setDirectoryStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [directoryStatus]);

  const shouldShow = showInProduction || environment === 'development' || user?.role === 'admin';

  if (!shouldShow) return null;

  const openPanel = () => {
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
    toggleButtonRef.current?.focus();
  };

  return (
    <>
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={openPanel}
        className={toggleButtonStyles}
        aria-label={isOpen ? 'Close debug panel' : 'Open debug panel (Ctrl+Shift+D)'}
        aria-expanded={isOpen}
        aria-controls="debug-panel"
      >
        <span>Debug</span>
        <span
          className={
            logCount > 0 ? (metadata.errorCount > 0 ? errorBadgeStyles : badgeStyles) : badgeStyles
          }
        >
          {logCount}
        </span>
        {metadata.errorCount > 0 && (
          <span className={errorBadgeStyles}>{metadata.errorCount} err</span>
        )}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id="debug-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Debug Logger Panel"
          className={panelStyles}
        >
          <div className={headerStyles}>
            <div className={headerTitleWrapperStyles}>
              <h3 className={headerTitleStyles}>Debug</h3>
              <p className={headerSubtitleStyles}>{sessionId.substring(0, 36)}...</p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closePanel}
              className={closeButtonStyles}
              aria-label="Close debug panel"
            >
              ✕
            </button>
          </div>

          <div className={statsGridStyles}>
            <div className={statItemStyles}>
              <div className={statValueStyles}>{logCount}</div>
              <div className={statLabelStyles}>Logs</div>
            </div>
            <div className={statItemStyles}>
              <div className={`${statValueStyles} ${errorValueStyles}`}>{metadata.errorCount}</div>
              <div className={statLabelStyles}>Errors</div>
            </div>
            <div className={statItemStyles}>
              <div className={`${statValueStyles} ${networkErrorValueStyles}`}>
                {metadata.networkErrorCount}
              </div>
              <div className={statLabelStyles}>Network</div>
            </div>
          </div>

          <details className={detailsStyles}>
            <summary className={summaryStyles} role="button" aria-expanded="false">
              <span>▸ Session Details</span>
            </summary>
            <div className={sessionInfoStyles}>
              <div>
                <strong>User</strong>
                <span>{metadata.userId || 'Anonymous'}</span>
              </div>
              <div>
                <strong>Browser</strong>
                <span>{metadata.browser} ({metadata.platform})</span>
              </div>
              <div>
                <strong>Screen</strong>
                <span>{metadata.screenResolution}</span>
              </div>
              <div>
                <strong>Timezone</strong>
                <span>{metadata.timezone}</span>
              </div>
            </div>
          </details>

          <div className={actionsStyles}>
            <div className={actionGroupStyles}>
              {/* <span className={labelStyles}>Export</span> */}
              <div className={buttonRowStyles}>
                <button
                  type="button"
                  onClick={() => handleDownload('json')}
                  className={downloadButtonStyles}
                  aria-label="Download logs as JSON"
                >
                  📄 JSON
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload('txt')}
                  className={downloadButtonStyles}
                  aria-label="Download logs as text file"
                >
                  📝 TXT
                </button>
                <button
                  type="button"
                  onClick={handleSaveToDirectory}
                  disabled={!('showDirectoryPicker' in window)}
                  className={downloadButtonStyles}
                  aria-label="Save logs to directory"
                  title={
                    'showDirectoryPicker' in window
                      ? 'Choose directory to save file'
                      : 'Feature only supported in Chrome/Edge'
                  }
                >
                  📁 Folder
                </button>
              </div>
            </div>

            {uploadEndpoint && (
              <div className={actionGroupStyles}>
                <span className={labelStyles}>Upload</span>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={uploadButtonStyles}
                  aria-label={isUploading ? 'Uploading logs...' : 'Upload logs to server'}
                  aria-busy={isUploading}
                >
                  {isUploading ? '⏳ Uploading...' : '☁️ Upload to Server'}
                </button>
              </div>
            )}

            {uploadStatus && (
              <div
                role="status"
                aria-live="polite"
                className={
                  uploadStatus.type === 'success' ? successMessageStyles : errorMessageStyles
                }
              >
                {uploadStatus.message}
              </div>
            )}

            {directoryStatus && (
              <div
                role="status"
                aria-live="polite"
                className={
                  directoryStatus.type === 'success' ? successMessageStyles : errorMessageStyles
                }
              >
                {directoryStatus.message}
              </div>
            )}

            <div className={actionGroupStyles}>
              {/* <span className={labelStyles}>Clear</span> */}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear all logs? This cannot be undone.')) {
                    clearLogs();
                    setUploadStatus(null);
                  }
                }}
                className={dangerButtonStyles}
                aria-label="Clear all logs"
              >
                🗑️ Clear All Logs
              </button>
            </div>
          </div>

          <div className={footerStyles}>
            <div className={footerTipStyles}>
              Press <kbd>Ctrl+Shift+D</kbd> to toggle
            </div>
          </div>
        </div>
      )}
    </>
  );
}