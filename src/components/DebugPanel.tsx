'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLogRecorder } from '../hooks/useLogRecorder';
import {
  toggleButtonStyles,
  badgeStyles,
  errorBadgeStyles,
  panelStyles,
  headerStyles,
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
  primaryButtonStyles,
  secondaryButtonStyles,
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
          message: 'Tính năng chỉ hỗ trợ Chrome/Edge',
        });
        return;
      }

      const filename = await downloadLogs('json', undefined, { showPicker: true });
      if (filename) {
        setDirectoryStatus({
          type: 'success',
          message: 'Đã lưu vào thư mục',
        });
      }
    } catch (err) {
      setDirectoryStatus({
        type: 'error',
        message: 'Không thể lưu. Vui lòng thử lại hoặc chọn vị trí khác.',
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
    // Focus will be handled by useEffect
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
            <div>
              <h3 className={headerTitleStyles}>Debug Logger</h3>
              <p className={headerSubtitleStyles}>Session: {sessionId.substring(0, 20)}...</p>
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
              <div className={statLabelStyles}>Total Logs</div>
            </div>
            <div className={statItemStyles}>
              <div className={`${statValueStyles} ${errorValueStyles}`}>{metadata.errorCount}</div>
              <div className={statLabelStyles}>Errors</div>
            </div>
            <div className={statItemStyles}>
              <div className={`${statValueStyles} ${networkErrorValueStyles}`}>
                {metadata.networkErrorCount}
              </div>
              <div className={statLabelStyles}>Net Errors</div>
            </div>
          </div>

          <details className={detailsStyles}>
            <summary className={summaryStyles} role="button" aria-expanded="false">
              <span>Session Info</span>
            </summary>
            <div className={sessionInfoStyles}>
              <div>
                <strong>User:</strong> {metadata.userId || 'Anonymous'}
              </div>
              <div>
                <strong>Browser:</strong> {metadata.browser} ({metadata.platform})
              </div>
              <div>
                <strong>Resolution:</strong> {metadata.screenResolution}
              </div>
              <div>
                <strong>URL:</strong> {metadata.url}
              </div>
              <div>
                <strong>Timezone:</strong> {metadata.timezone}
              </div>
            </div>
          </details>

          <div className={actionsStyles}>
            <div className={actionGroupStyles}>
              <span className={labelStyles}>Download Logs</span>
              <div className={buttonRowStyles}>
                <button
                  type="button"
                  onClick={() => handleDownload('json')}
                  className={primaryButtonStyles}
                  aria-label="Download logs as JSON"
                >
                  JSON
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload('txt')}
                  className={primaryButtonStyles}
                  aria-label="Download logs as text file"
                >
                  TXT
                </button>
              </div>
              <button
                type="button"
                onClick={handleSaveToDirectory}
                disabled={!('showDirectoryPicker' in window)}
                className={secondaryButtonStyles}
                aria-label="Save logs to directory"
                title={
                  'showDirectoryPicker' in window
                    ? 'Chọn thư mục để lưu file'
                    : 'Tính năng chỉ hỗ trợ Chrome/Edge'
                }
              >
                Lưu vào thư mục...
              </button>
            </div>

            {uploadEndpoint && (
              <div className={actionGroupStyles}>
                <span className={labelStyles}>Upload to Server</span>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={uploadButtonStyles}
                  aria-label={isUploading ? 'Uploading logs...' : 'Upload logs to server'}
                  aria-busy={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Logs'}
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
              Clear All Logs
            </button>
          </div>

          <div className={footerStyles}>
            <div className={footerTipStyles}>
              <strong>💡 Tip:</strong> Press{' '}
              <kbd
                style={{
                  padding: '2px 6px',
                  background: '#e5e7eb',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                }}
              >
                Ctrl+Shift+D
              </kbd>{' '}
              to toggle
            </div>
            <div className={footerTipStyles}>
              <strong>💾 Auto-save:</strong> Logs persist across page refreshes
            </div>
            <div className={footerTipStyles}>
              <strong>🔒 Security:</strong> Sensitive data is auto-redacted
            </div>
          </div>
        </div>
      )}
    </>
  );
}
