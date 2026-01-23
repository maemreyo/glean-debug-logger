'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useLogRecorder } from '../hooks/useLogRecorder/index';
import { useDebugPanelControls } from '../hooks/useDebugPanelControls';
import { useCopyFormat } from '../hooks/useCopyFormat';
import { useStatusMessages } from '../hooks/useStatusMessages';
import { useSettingsDropdown } from '../hooks/useSettingsDropdown';
import { LogEntry, ConsoleLogEntry, ExportFormat } from '../types';
import { transformToECS, transformMetadataToECS } from '../utils/ecsTransform';
import { toggleButtonStyles, panelStyles, indicatorDotStyles } from './DebugPanel.styles';
import { DebugPanelHeader } from './DebugPanelHeader';
import { DebugPanelStats } from './DebugPanelStats';
import { DebugPanelActions } from './DebugPanelActions';
import { DebugPanelStatus } from './DebugPanelStatus';
import { DebugPanelFooter } from './DebugPanelFooter';
import { Bug } from 'lucide-react';

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

type CopyFilter = 'all' | 'logs' | 'errors' | 'network' | 'networkErrors';

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

export function DebugPanel({
  user,
  environment = process.env.NODE_ENV || 'development',
  uploadEndpoint,
  fileNameTemplate = '{env}_{date}_{time}_{userId}_{errorCount}errors',
  maxLogs = 2000,
  showInProduction = false,
}: DebugPanelProps) {
  const { isOpen, open, close } = useDebugPanelControls();
  const { isSettingsOpen, openSettings, closeSettings } = useSettingsDropdown();
  const { copyFormat } = useCopyFormat();
  const [isSessionDetailsOpen, setIsSessionDetailsOpen] = useState(false);

  const openSessionDetails = useCallback(() => {
    setIsSessionDetailsOpen(true);
  }, []);

  const closeSessionDetails = useCallback(() => {
    setIsSessionDetailsOpen(false);
  }, []);

  const {
    uploadStatus,
    setUploadStatus,
    directoryStatus,
    setDirectoryStatus,
    copyStatus,
    setCopyStatus,
  } = useStatusMessages();

  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { downloadLogs, uploadLogs, clearLogs, getLogs, getMetadata, _logCount } = useLogRecorder({
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

  const logCount = _logCount; // Use state value for re-renders
  const metadata = getMetadata();

  // Auto-upload on error threshold
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

  const generateCopyContent = useCallback(
    (logs: LogEntry[], meta: ReturnType<typeof getMetadata>): string => {
      if (copyFormat === 'json') {
        return JSON.stringify({ metadata: meta, logs }, null, 2);
      } else if (copyFormat === 'ecs.json') {
        const ecsLogs = logs.map((log) => transformToECS(log, meta));
        const output = {
          metadata: transformMetadataToECS(meta),
          logs: ecsLogs,
        };
        return JSON.stringify(output, null, 2);
      } else if (copyFormat === 'ai.txt') {
        const metaSection = `# METADATA
service.name=${meta.environment || 'unknown'}
user.id=${meta.userId || 'anonymous'}
timestamp=${new Date().toISOString()}

# LOGS
`;
        const logLines = logs.map((log) => {
          const ecs = transformToECS(log, meta);
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
      }
      return JSON.stringify({ metadata: meta, logs }, null, 2);
    },
    [copyFormat]
  );

  const handleUpload = useCallback(async () => {
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
    }
  }, [uploadLogs, setUploadStatus]);

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
    [downloadLogs, setUploadStatus]
  );

  const handleSaveToDirectory = useCallback(async () => {
    setDirectoryStatus(null);
    try {
      const filename = await downloadLogs('json', undefined, { showPicker: true });
      if (filename) {
        setDirectoryStatus({
          type: 'success',
          message: 'Saved to directory',
        });
      }
    } catch {
      setDirectoryStatus({
        type: 'error',
        message: 'Unable to save. Please try again or choose a different location.',
      });
    }
  }, [downloadLogs, setDirectoryStatus]);

  const handleCopy = useCallback(async () => {
    setCopyStatus(null);
    try {
      const logs = getLogs();
      const meta = getMetadata();
      const content = generateCopyContent(logs, meta);
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
  }, [getLogs, getMetadata, generateCopyContent, setCopyStatus]);

  const handleCopyFiltered = useCallback(
    async (filter: CopyFilter) => {
      setCopyStatus(null);
      try {
        const allLogs = getLogs();
        const meta = getMetadata();
        const filteredLogs = filterLogsByType(allLogs, filter);
        const count = filteredLogs.length;

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

        const content = generateCopyContent(filteredLogs, meta);
        await navigator.clipboard.writeText(content);

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
    [getLogs, getMetadata, generateCopyContent, setCopyStatus]
  );

  const getFilteredLogCount = useCallback(
    (filter: CopyFilter): number => {
      return filterLogsByType(getLogs(), filter).length;
    },
    [getLogs]
  );

  const shouldShow = showInProduction || environment === 'development' || user?.role === 'admin';

  if (!shouldShow) return null;

  return (
    <>
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          isOpen ? close() : open();
        }}
        className={toggleButtonStyles}
        aria-label={isOpen ? 'Close debug panel' : 'Open debug panel (Ctrl+Shift+D)'}
        aria-expanded={isOpen}
        aria-controls="debug-panel"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        <Bug size={18} />
        {metadata.errorCount > 0 && (
          <motion.span
            className={indicatorDotStyles}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={`err-${metadata.errorCount}`}
          />
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            ref={panelRef}
            id="debug-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Debug Logger Panel"
            className={panelStyles}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <ScrollArea.Root className="glean-scroll-area" style={{ flex: 1, overflow: 'hidden' }}>
              <ScrollArea.Viewport
                className="glean-scroll-viewport"
                style={{ width: '100%', height: '100%' }}
              >
                <DebugPanelHeader
                  metadata={metadata}
                  onClose={close}
                  onSaveToDirectory={handleSaveToDirectory}
                  onClear={() => {
                    if (confirm('Clear all logs?')) {
                      clearLogs();
                    }
                  }}
                  ref={closeButtonRef}
                  isSettingsOpen={isSettingsOpen}
                  openSettings={openSettings}
                  closeSettings={closeSettings}
                  isSessionDetailsOpen={isSessionDetailsOpen}
                  openSessionDetails={openSessionDetails}
                  closeSessionDetails={closeSessionDetails}
                />

                <DebugPanelStats
                  logCount={logCount}
                  errorCount={metadata.errorCount}
                  networkErrorCount={metadata.networkErrorCount}
                />

                {/* Test Buttons - For debugging interceptor only */}
                <div
                  style={{
                    padding: '8px 16px',
                    borderBottom: '1px solid var(--color-border, #e2e8f0)',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      console.log('[TEST] Console log test message');
                      console.error('[TEST] Console error test message');
                      console.warn('[TEST] Console warn test message');
                      console.info('[TEST] Console info test message');
                    }}
                    style={{
                      background: 'var(--color-primary, #6366f1)',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    🧪 Console
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      // Test successful fetch
                      try {
                        await fetch('https://jsonplaceholder.typicode.com/posts/1');
                      } catch {
                        // Ignore errors for test
                      }
                    }}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    🌐 Fetch (200)
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      // Test failed fetch
                      try {
                        await fetch('https://httpstat.us/404');
                      } catch {
                        // Ignore errors for test
                      }
                    }}
                    style={{
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    ⚠️ Fetch (404)
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      // Test failed fetch (network error)
                      try {
                        await fetch('https://this-domain-definitely-does-not-exist-12345.com');
                      } catch {
                        // Ignore errors for test
                      }
                    }}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    🔥 Fetch (Err)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Test successful XHR
                      const xhr = new XMLHttpRequest();
                      xhr.open('GET', 'https://jsonplaceholder.typicode.com/users/1');
                      xhr.onload = () => {
                        console.log('[TEST] XHR completed:', xhr.status);
                      };
                      xhr.onerror = () => {
                        console.error('[TEST] XHR error');
                      };
                      xhr.send();
                    }}
                    style={{
                      background: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    📡 XHR (200)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Test failed XHR
                      const xhr = new XMLHttpRequest();
                      xhr.open('GET', 'https://httpstat.us/500');
                      xhr.onload = () => {
                        console.log('[TEST] XHR completed:', xhr.status);
                      };
                      xhr.onerror = () => {
                        console.error('[TEST] XHR error');
                      };
                      xhr.send();
                    }}
                    style={{
                      background: '#ec4899',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    📡 XHR (500)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Test XHR network error
                      const xhr = new XMLHttpRequest();
                      xhr.open('GET', 'https://non-existent-domain-xyz-123.com');
                      xhr.timeout = 5000;
                      xhr.ontimeout = () => {
                        console.error('[TEST] XHR timeout');
                      };
                      xhr.onerror = () => {
                        console.error('[TEST] XHR network error');
                      };
                      xhr.send();
                    }}
                    style={{
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    💥 XHR (Err)
                  </button>
                </div>

                <DebugPanelActions
                  logCount={logCount}
                  hasUploadEndpoint={!!uploadEndpoint}
                  isUploading={false}
                  getFilteredLogCount={getFilteredLogCount}
                  onCopyFiltered={handleCopyFiltered}
                  onDownload={handleDownload}
                  onCopy={handleCopy}
                  onUpload={handleUpload}
                />

                <DebugPanelStatus
                  uploadStatus={uploadStatus}
                  directoryStatus={directoryStatus}
                  copyStatus={copyStatus}
                />

                <DebugPanelFooter />
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                className="glean-scrollbar"
                orientation="vertical"
                style={{
                  display: 'flex',
                  width: '6px',
                  userSelect: 'none',
                  touchAction: 'none',
                  padding: '2px',
                  background: 'transparent',
                }}
              >
                <ScrollArea.Thumb
                  className="glean-scrollbar-thumb"
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.15)',
                    borderRadius: '3px',
                    transition: 'background 0.15s ease',
                  }}
                />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
