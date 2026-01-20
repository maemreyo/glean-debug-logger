import { useEffect, useRef, useCallback, useState } from 'react';
import type {
  LogRecorderConfig,
  LogEntry,
  LogMetadata,
  UseLogRecorderReturn,
  DownloadOptions,
} from '../types';

declare global {
  interface Window {
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
  }
}
import { sanitizeData, generateSessionId, generateFilename, collectMetadata } from '../utils';

const DEFAULT_CONFIG: LogRecorderConfig = {
  maxLogs: 1000,
  enablePersistence: true,
  persistenceKey: 'debug_logs',
  captureConsole: true,
  captureFetch: true,
  captureXHR: true,
  enableDirectoryPicker: false, // Enable directory picker for downloads (Chrome 86+, Edge 86+ only)
  sanitizeKeys: ['password', 'token', 'apiKey', 'secret', 'authorization', 'creditCard'],
  excludeUrls: [],
  fileNameTemplate: '{env}_{userId}_{sessionId}_{timestamp}',
  environment: 'development',
  userId: null,
  sessionId: null,
  includeMetadata: true,
  uploadEndpoint: null,
  uploadOnError: false,
};

export function useLogRecorder(
  customConfig: Partial<LogRecorderConfig> = {}
): UseLogRecorderReturn {
  const config = { ...DEFAULT_CONFIG, ...customConfig };
  const logsRef = useRef<LogEntry[]>([]);
  const isInitialized = useRef(false);
  const sessionIdRef = useRef(config.sessionId || generateSessionId());
  const metadataRef = useRef<LogMetadata>(
    collectMetadata(sessionIdRef.current, config.environment, config.userId, 0)
  );
  const [logCount, setLogCount] = useState(0);

  const safeStringify = useCallback((obj: unknown): string => {
    const seen = new Set<object>();
    return JSON.stringify(obj, (_key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
      }
      return value;
    });
  }, []);

  const addLog = useCallback(
    (logEntry: LogEntry) => {
      logsRef.current.push(logEntry);

      if (logsRef.current.length > config.maxLogs) {
        logsRef.current.shift();
      }

      setLogCount(logsRef.current.length);

      if (config.enablePersistence && typeof window !== 'undefined') {
        try {
          localStorage.setItem(config.persistenceKey, safeStringify(logsRef.current));
        } catch {
          console.warn('[useLogRecorder] Failed to persist logs');
        }
      }
    },
    [config.maxLogs, config.enablePersistence, config.persistenceKey, safeStringify]
  );

  const loadPersistedLogs = useCallback(() => {
    if (config.enablePersistence && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(config.persistenceKey);
        if (stored) {
          logsRef.current = JSON.parse(stored);
          setLogCount(logsRef.current.length);
        }
      } catch {
        console.warn('[useLogRecorder] Failed to load persisted logs');
      }
    }
  }, [config.enablePersistence, config.persistenceKey]);

  const shouldExcludeUrl = useCallback(
    (url: string): boolean => {
      return config.excludeUrls.some((excluded) => url.includes(excluded));
    },
    [config.excludeUrls]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return;
    isInitialized.current = true;

    loadPersistedLogs();

    const cleanupFns: (() => void)[] = [];

    if (config.captureConsole) {
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
        debug: console.debug,
      };

      const captureConsole = (level: string, args: unknown[]) => {
        try {
          const data = args
            .map((arg) => {
              if (typeof arg === 'object') {
                try {
                  return safeStringify(arg);
                } catch {
                  return String(arg);
                }
              }
              return String(arg);
            })
            .join(' ');

          addLog({
            type: 'CONSOLE',
            level: level.toUpperCase(),
            time: new Date().toISOString(),
            data: data.substring(0, 5000),
          });
        } catch {
          // Silent fail
        }
      };

      (Object.keys(originalConsole) as Array<keyof typeof originalConsole>).forEach((level) => {
        const originalFn = originalConsole[level];
        console[level] = (...args: unknown[]) => {
          captureConsole(level, args);
          originalFn.apply(console, args);
        };
      });

      cleanupFns.push(() => {
        (Object.keys(originalConsole) as Array<keyof typeof originalConsole>).forEach((level) => {
          console[level] = originalConsole[level];
        });
      });
    }

    if (config.captureFetch && typeof window !== 'undefined') {
      const originalFetch = window.fetch;

      window.fetch = async (...args: Parameters<typeof fetch>) => {
        const [resource, options] = args;
        const url = typeof resource === 'string' ? resource : (resource as Request).url || '';

        if (shouldExcludeUrl(url)) {
          return originalFetch(...args);
        }

        const startTime = Date.now();
        const requestId = Math.random().toString(36).substring(7);

        try {
          let requestBody: unknown = null;
          if (options?.body) {
            try {
              requestBody =
                typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
              requestBody = sanitizeData(requestBody, { keys: config.sanitizeKeys });
            } catch {
              requestBody = String(options.body).substring(0, 1000);
            }
          }

          addLog({
            type: 'FETCH_REQ',
            id: requestId,
            url,
            method: options?.method || 'GET',
            headers: sanitizeData(options?.headers as Record<string, unknown>, {
              keys: config.sanitizeKeys,
            }),
            body: requestBody,
            time: new Date().toISOString(),
          });

          const response = await originalFetch(...args);

          const clone = response.clone();
          let responseBody: unknown = null;

          try {
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
              responseBody = await clone.json();
              responseBody = sanitizeData(responseBody, { keys: config.sanitizeKeys });
            } else {
              const text = await clone.text();
              responseBody = text.substring(0, 1000);
            }
          } catch {
            responseBody = '[Unable to parse response]';
          }

          addLog({
            type: 'FETCH_RES',
            id: requestId,
            url,
            status: response.status,
            statusText: response.statusText,
            duration: `${Date.now() - startTime}ms`,
            body: responseBody,
            time: new Date().toISOString(),
          });

          return response;
        } catch (error) {
          addLog({
            type: 'FETCH_ERR',
            id: requestId,
            url,
            error: error instanceof Error ? error.toString() : String(error),
            duration: `${Date.now() - startTime}ms`,
            time: new Date().toISOString(),
          });
          throw error;
        }
      };

      cleanupFns.push(() => {
        window.fetch = originalFetch;
      });
    }

    if (config.captureXHR && typeof window !== 'undefined') {
      const OriginalXHR = window.XMLHttpRequest;

      const MyXMLHttpRequest = function (this: XMLHttpRequest) {
        const xhr = new OriginalXHR();
        const requestId = Math.random().toString(36).substring(7);
        let method: string | undefined;
        let url: string | undefined;
        const startTime = Date.now();

        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        const originalSetRequestHeader = xhr.setRequestHeader;

        const headers: Record<string, string> = {};

        xhr.setRequestHeader = function (header, value) {
          headers[header] = value;
          return originalSetRequestHeader.call(xhr, header, value);
        };

        xhr.open = function (m: string, u: string, async: boolean = true) {
          method = m;
          url = u;

          if (shouldExcludeUrl(u)) {
            return originalOpen.call(xhr, m, u, async);
          }

          return originalOpen.call(xhr, m, u, async);
        };

        xhr.send = function (body: Document | XMLHttpRequestBodyInit | null) {
          if (url && !shouldExcludeUrl(url)) {
            let parsedBody: unknown = null;
            if (body) {
              try {
                parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
                parsedBody = sanitizeData(parsedBody, { keys: config.sanitizeKeys });
              } catch {
                parsedBody = String(body).substring(0, 1000);
              }
            }

            addLog({
              type: 'XHR_REQ',
              id: requestId,
              url: url || 'unknown',
              method: method || 'GET',
              headers: sanitizeData(headers, { keys: config.sanitizeKeys }),
              body: parsedBody,
              time: new Date().toISOString(),
            });

            xhr.addEventListener('load', function () {
              let responseBody: unknown = null;
              try {
                const contentType = xhr.getResponseHeader('content-type');
                if (contentType?.includes('application/json')) {
                  responseBody = JSON.parse(xhr.responseText);
                  responseBody = sanitizeData(responseBody, { keys: config.sanitizeKeys });
                } else {
                  responseBody = xhr.responseText.substring(0, 1000);
                }
              } catch {
                responseBody = '[Unable to parse response]';
              }

              addLog({
                type: 'XHR_RES',
                id: requestId,
                url: url || 'unknown',
                status: xhr.status,
                statusText: xhr.statusText,
                duration: `${Date.now() - startTime}ms`,
                body: responseBody,
                time: new Date().toISOString(),
              });
            });

            xhr.addEventListener('error', function () {
              addLog({
                type: 'XHR_ERR',
                id: requestId,
                url: url || 'unknown',
                error: 'Network request failed',
                duration: `${Date.now() - startTime}ms`,
                time: new Date().toISOString(),
              });
            });
          }

          return originalSend.call(xhr, body);
        };

        Object.setPrototypeOf(xhr, OriginalXHR.prototype);
        return xhr;
      };

      Object.setPrototypeOf(MyXMLHttpRequest.prototype, OriginalXHR.prototype);
      (window as { XMLHttpRequest: typeof OriginalXHR }).XMLHttpRequest =
        MyXMLHttpRequest as unknown as typeof OriginalXHR;

      cleanupFns.push(() => {
        window.XMLHttpRequest = OriginalXHR;
      });
    }

    return () => {
      cleanupFns.forEach((fn) => fn());
      isInitialized.current = false;
    };
  }, [config, addLog, loadPersistedLogs, shouldExcludeUrl, safeStringify]);

  const updateMetadata = useCallback(() => {
    const errorCount = logsRef.current.filter(
      (l) => l.type === 'CONSOLE' && (l as { level: string }).level === 'ERROR'
    ).length;
    const networkErrorCount = logsRef.current.filter(
      (l) => l.type === 'FETCH_ERR' || l.type === 'XHR_ERR'
    ).length;

    metadataRef.current = {
      ...metadataRef.current,
      logCount: logsRef.current.length,
      errorCount,
      networkErrorCount,
    };
  }, []);

  function supportsFileSystemAccess(): boolean {
    return 'showDirectoryPicker' in window;
  }

  async function saveToDirectory(content: string, filename: string): Promise<void> {
    const dirHandle = await window.showDirectoryPicker();
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  const downloadLogs = useCallback(
    (
      format: 'json' | 'txt' = 'json',
      customFilename?: string | null,
      options?: DownloadOptions
    ): string | null => {
      if (typeof window === 'undefined') return null;

      const executeDownload = async (): Promise<string | null> => {
        try {
          updateMetadata();
          const filename = customFilename || generateFilename(format, {}, config);

          let content: string;
          let mimeType: string;

          if (format === 'json') {
            const output = config.includeMetadata
              ? { metadata: metadataRef.current, logs: logsRef.current }
              : logsRef.current;
            content = safeStringify(output);
            mimeType = 'application/json';
          } else {
            const metaHeader = config.includeMetadata
              ? `${'='.repeat(80)}\nMETADATA\n${'='.repeat(80)}\n${safeStringify(metadataRef.current)}\n${'='.repeat(80)}\n\n`
              : '';
            content =
              metaHeader +
              logsRef.current
                .map((log) => `[${log.time}] ${log.type}\n${safeStringify(log)}\n${'='.repeat(80)}`)
                .join('\n');
            mimeType = 'text/plain';
          }

          // Check if should show picker
          const showPicker = options?.showPicker || config.enableDirectoryPicker;

          if (showPicker && supportsFileSystemAccess()) {
            try {
              await saveToDirectory(content, filename);
              return filename;
            } catch (err) {
              if (err instanceof DOMException) {
                if (err.name === 'AbortError') {
                  // User cancelled - silent return
                  return null;
                }
                if (err.name === 'NotAllowedError') {
                  // Permission denied - log error for UI to handle
                  console.error('[useLogRecorder] Directory permission denied');
                  // Fall through to standard download
                }
              }
              // Other errors or permission denied - fall through to standard download
            }
          }

          // Fallback: standard download (EXACTLY as before)
          const blob = new Blob([content], { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          return filename;
        } catch {
          console.error('[useLogRecorder] Failed to download logs');
          return null;
        }
      };

      executeDownload().catch((err) => {
        console.error('[useLogRecorder] Download error:', err);
      });

      return null;
    },
    [config, safeStringify, updateMetadata]
  );

  const uploadLogs = useCallback(
    async (
      customEndpoint?: string | null
    ): Promise<{ success: boolean; data?: unknown; error?: string }> => {
      const endpoint = customEndpoint || config.uploadEndpoint;

      if (!endpoint) {
        return { success: false, error: 'No endpoint configured' };
      }

      try {
        updateMetadata();
        const payload = {
          metadata: metadataRef.current,
          logs: logsRef.current,
          fileName: generateFilename('json', {}, config),
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: safeStringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }

        const result = await response.json();
        return { success: true, data: result };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[useLogRecorder] Failed to upload logs:', error);
        return { success: false, error: errorMessage };
      }
    },
    [config.uploadEndpoint, safeStringify, updateMetadata]
  );

  const clearLogs = useCallback(() => {
    logsRef.current = [];
    setLogCount(0);

    if (config.enablePersistence && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(config.persistenceKey);
      } catch {
        console.warn('[useLogRecorder] Failed to clear persisted logs');
      }
    }
  }, [config.enablePersistence, config.persistenceKey]);

  const getLogs = useCallback(() => {
    return [...logsRef.current];
  }, []);

  const getLogCount = useCallback(() => {
    return logCount;
  }, [logCount]);

  const getMetadata = useCallback(() => {
    updateMetadata();
    return { ...metadataRef.current };
  }, [updateMetadata]);

  return {
    downloadLogs,
    uploadLogs,
    clearLogs,
    getLogs,
    getLogCount,
    getMetadata,
    sessionId: sessionIdRef.current,
  };
}
