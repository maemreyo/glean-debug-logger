'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLogRecorder } from '../hooks/useLogRecorder';
import { ExportFormat, LogEntry, ConsoleLogEntry } from '../types';
import { transformToECS, transformMetadataToECS } from '../utils/ecsTransform';
import { stringifyJSONL } from '../utils/jsonl';
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
  successMessageStyles,
  errorMessageStyles,
  footerStyles,
  footerTipStyles,
  settingsDropdownHeaderStyles,
  settingsDropdownItemSelectedStyles,
  settingsDropdownItemStyles,
  settingsDropdownStyles,
  actionButtonStyles,
  dangerActionButtonStyles,
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
  const [copyStatus, setCopyStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Copy format setting with localStorage persistence (default: 'ecs.json')
  const [copyFormat, setCopyFormat] = useState<'json' | 'ecs.json' | 'ai.txt'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('debug-panel-copy-format');
      if (saved && ['json', 'ecs.json', 'ai.txt'].includes(saved)) {
        return saved as 'json' | 'ecs.json' | 'ai.txt';
      }
    }
    return 'ecs.json'; // Default to ECS JSON (AI-friendly)
  });

  // Save copy format to localStorage
  useEffect(() => {
    localStorage.setItem('debug-panel-copy-format', copyFormat);
  }, [copyFormat]);

  // Copy Filter type
  type CopyFilter = 'all' | 'logs' | 'errors' | 'network' | 'networkErrors';

  // Helper function to filter logs by type
  function filterLogsByType(logs: LogEntry[], filter: CopyFilter): LogEntry[] {
    switch (filter) {
      case 'logs':
        return logs.filter((log): log is ConsoleLogEntry => log.type === 'CONSOLE');
      case 'errors':
        return logs.filter(
          (log): log is ConsoleLogEntry => log.type === 'CONSOLE' && log.level === 'error'
        );
      case 'network':
        return logs.filter(
          (log) =>
            log.type === 'FETCH_REQ' ||
            log.type === 'FETCH_RES' ||
            log.type === 'XHR_REQ' ||
            log.type === 'XHR_RES'
        );
      case 'networkErrors':
        return logs.filter((log) => log.type === 'FETCH_ERR' || log.type === 'XHR_ERR');
      case 'all':
      default:
        return logs;
    }
  }

  // Helper function to count filtered logs
  function getFilteredLogCount(logs: LogEntry[], filter: CopyFilter): number {
    return filterLogsByType(logs, filter).length;
  }

  // Refs for focus management
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { downloadLogs, uploadLogs, clearLogs, getLogs, getLogCount, getMetadata, sessionId } =
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
    (format: ExportFormat) => {
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

  // Helper function to generate content from logs and metadata
  const generateCopyContent = useCallback(
    (logs: LogEntry[], metadata: ReturnType<typeof getMetadata>): string => {
      if (copyFormat === 'json') {
        // Original JSON format
        return JSON.stringify({ metadata, logs }, null, 2);
      } else if (copyFormat === 'ecs.json') {
        // ECS-compliant JSON with metadata wrapper
        const ecsLogs = logs.map((log) => transformToECS(log, metadata));
        const output = {
          metadata: transformMetadataToECS(metadata),
          logs: ecsLogs,
        };
        return JSON.stringify(output, null, 2);
      } else if (copyFormat === 'ai.txt') {
        // AI-optimized TXT format
        const metaSection = `# METADATA
service.name=${metadata.environment || 'unknown'}
user.id=${metadata.userId || 'anonymous'}
timestamp=${new Date().toISOString()}

# LOGS
`;
        const logLines = logs.map((log) => {
          const ecs = transformToECS(log, metadata);
          const timestamp = ecs['@timestamp'];
          const level = (ecs as unknown as Record<string, unknown>)['log.level'] as string;
          const category =
            ((ecs as unknown as Record<string, unknown>)['event.category'] as string[])?.[0] ||
            'unknown';
          let line = `[${timestamp}] ${level} ${category}`;
          if (ecs.message) line += ` | message="${ecs.message}"`;
          if (ecs.http?.request?.method) line += ` | req.method=${ecs.http.request.method}`;
          if (ecs.url?.full) line += ` | url=${ecs.url.full}`;
          if (ecs.http?.response?.status_code)
            line += ` | res.status=${ecs.http.response.status_code}`;
          if (ecs.error?.message) line += ` | error="${ecs.error.message}"`;
          return line;
        });
        return metaSection + logLines.join('\n');
      } else if (copyFormat === 'jsonl') {
        // JSONL format
        const ecsLogs = logs.map((log) => transformToECS(log, metadata));
        return stringifyJSONL(ecsLogs);
      } else {
        // Default to original JSON
        return JSON.stringify({ metadata, logs }, null, 2);
      }
    },
    [copyFormat]
  );

  const handleCopy = useCallback(async () => {
    setCopyStatus(null);
    try {
      const logs = getLogs();
      const metadata = getMetadata();
      const content = generateCopyContent(logs, metadata);

      await navigator.clipboard.writeText(content);
      setCopyStatus({
        type: 'success',
        message: 'Copied to clipboard!',
      });
    } catch {
      setCopyStatus({
        type: 'error',
        message: 'Failed to copy. Check clipboard permissions.',
      });
    }
  }, [getLogs, getMetadata, generateCopyContent]);

  // Export handleCopyFiltered for external use (e.g., keyboard shortcuts, custom UI)
  const handleCopyFiltered = useCallback(
    async (filter: CopyFilter) => {
      setCopyStatus(null);
      try {
        const allLogs = getLogs();
        const metadata = getMetadata();
        const filteredLogs = filterLogsByType(allLogs, filter);
        const count = filteredLogs.length;

        // Handle empty results
        if (count === 0) {
          const emptyMessages: Record<CopyFilter, string> = {
            all: 'No logs to copy',
            logs: 'No logs to copy',
            errors: 'No errors to copy',
            network: 'No network requests to copy',
            networkErrors: 'No network errors to copy',
          };
          setCopyStatus({
            type: 'error',
            message: emptyMessages[filter],
          });
          return;
        }

        // Generate content using filteredLogs
        const content = generateCopyContent(filteredLogs, metadata);

        await navigator.clipboard.writeText(content);

        // Update status with count and filter type
        const filterLabels: Record<CopyFilter, string> = {
          all: 'all entries',
          logs: 'logs',
          errors: 'errors',
          network: 'network requests',
          networkErrors: 'network errors',
        };
        setCopyStatus({
          type: 'success',
          message: `Copied ${count} ${filterLabels[filter]} to clipboard`,
        });
      } catch {
        setCopyStatus({
          type: 'error',
          message: 'Failed to copy. Check clipboard permissions.',
        });
      }
    },
    [getLogs, getMetadata, generateCopyContent, filterLogsByType]
  );

  useEffect(() => {
    if (directoryStatus) {
      const timer = setTimeout(() => {
        setDirectoryStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [directoryStatus]);

  useEffect(() => {
    if (copyStatus) {
      const timer = setTimeout(() => {
        setCopyStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [copyStatus]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        if (toggleButtonRef.current?.contains(e.target as Node)) {
          return;
        }
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {/* Settings button for copy format */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  className={closeButtonStyles}
                  aria-label="Actions and settings"
                  aria-expanded={showSettings}
                  title="Actions and settings"
                >
                  ⚙️
                </button>
                {showSettings && (
                  <div className={settingsDropdownStyles} style={{ width: '220px' }}>
                    <div className={settingsDropdownHeaderStyles}>Copy Format</div>
                    {(['json', 'ecs.json', 'ai.txt'] as const).map((format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => {
                          setCopyFormat(format);
                          setShowSettings(false);
                        }}
                        className={`${settingsDropdownItemStyles} ${copyFormat === format ? settingsDropdownItemSelectedStyles : ''}`}
                      >
                        {copyFormat === format && '✓ '}
                        {format === 'json' && '📄 JSON'}
                        {format === 'ecs.json' && '📋 ECS (AI)'}
                        {format === 'ai.txt' && '🤖 AI-TXT'}
                      </button>
                    ))}

                    <div style={{ borderTop: '1px solid #f3f4f6', margin: '8px 0' }} />

                    <button
                      type="button"
                      onClick={() => {
                        handleSaveToDirectory();
                        setShowSettings(false);
                      }}
                      className={settingsDropdownItemStyles}
                      disabled={!('showDirectoryPicker' in window)}
                    >
                      📁 Save to Folder
                    </button>
                  </div>
                )}
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

          <div style={{ padding: '12px 16px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '6px',
              }}
            >
              <button
                type="button"
                onClick={() => handleCopyFiltered('logs')}
                className={actionButtonStyles}
                disabled={logCount === 0 || getFilteredLogCount(getLogs(), 'logs') === 0}
                aria-label="Copy only console logs"
              >
                📋 Logs
              </button>
              <button
                type="button"
                onClick={() => handleCopyFiltered('errors')}
                className={actionButtonStyles}
                disabled={logCount === 0 || getFilteredLogCount(getLogs(), 'errors') === 0}
                aria-label="Copy only errors"
              >
                ⚠️ Errors
              </button>
              <button
                type="button"
                onClick={() => handleCopyFiltered('network')}
                className={actionButtonStyles}
                disabled={logCount === 0 || getFilteredLogCount(getLogs(), 'network') === 0}
                aria-label="Copy only network requests"
              >
                🌐 Network
              </button>
              <hr />
              <hr />
              <hr />
              <button
                type="button"
                onClick={() => handleDownload('json')}
                className={actionButtonStyles}
                disabled={logCount === 0}
              >
                📄 JSON
              </button>
              <button
                type="button"
                onClick={() => handleDownload('txt')}
                className={actionButtonStyles}
                disabled={logCount === 0}
              >
                📝 TXT
              </button>
              <button
                type="button"
                onClick={() => handleDownload('jsonl')}
                className={actionButtonStyles}
                disabled={logCount === 0}
              >
                📦 JSONL
              </button>
              <button
                type="button"
                onClick={() => handleDownload('ecs.json')}
                className={actionButtonStyles}
                disabled={logCount === 0}
              >
                📋 ECS
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className={actionButtonStyles}
                disabled={logCount === 0}
              >
                📋 Copy
              </button>
              <button
                type="button"
                onClick={() => handleDownload('ai.txt')}
                className={actionButtonStyles}
                disabled={logCount === 0}
              >
                🤖 AI
              </button>

              {uploadEndpoint ? (
                <button
                  type="button"
                  onClick={handleUpload}
                  className={actionButtonStyles}
                  disabled={isUploading}
                >
                  ☁️ Upload
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>

          <div style={{ padding: '0 16px 12px' }}>
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

            {copyStatus && (
              <div
                role="status"
                aria-live="polite"
                className={
                  copyStatus.type === 'success' ? successMessageStyles : errorMessageStyles
                }
              >
                {copyStatus.message}
              </div>
            )}
          </div>

          <details
            className={detailsStyles}
            style={{ borderTop: '1px solid #f3f4f6', borderRadius: 0 }}
          >
            <summary className={summaryStyles}>
              <span>▸ Session Details</span>
            </summary>
            <div className={sessionInfoStyles}>
              <div>
                <strong>User</strong>
                <span>{metadata.userId || 'Anonymous'}</span>
              </div>
              <div>
                <strong>Browser</strong>
                <span>
                  {metadata.browser} ({metadata.platform})
                </span>
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

          <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'flex-end' }}>
            {!uploadEndpoint && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear all logs?')) {
                    clearLogs();
                  }
                }}
                className={dangerActionButtonStyles}
              >
                🗑️ Clear
              </button>
            )}
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
