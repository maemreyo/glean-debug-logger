import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import type {
  LogRecorderConfig,
  LogEntry,
  LogMetadata,
  UseLogRecorderReturn,
  ExportFormat,
  DownloadOptions,
} from '../types';
import { sanitizeData, generateSessionId, generateFilename, collectMetadata } from '../utils';
import { transformToECS, transformMetadataToECS } from '../utils/ecsTransform';
import { stringifyJSONL } from '../utils/jsonl';
import { ConsoleInterceptor } from '../interceptors/ConsoleInterceptor';
import { NetworkInterceptor } from '../interceptors/NetworkInterceptor';
import { XHRInterceptor } from '../interceptors/XHRInterceptor';
import { FileService } from '../services/FileService';

const DEFAULT_CONFIG: LogRecorderConfig = {
  maxLogs: 1000,
  enablePersistence: true,
  persistenceKey: 'debug_logs',
  captureConsole: true,
  captureFetch: true,
  captureXHR: true,
  enableDirectoryPicker: false,
  sanitizeKeys: ['password', 'token', 'apiKey', 'secret', 'authorization', 'creditCard'],
  excludeUrls: [],
  fileNameTemplate: '{env}_{userId}_{sessionId}_{timestamp}',
  environment: 'development',
  userId: null,
  sessionId: null,
  includeMetadata: true,
  uploadEndpoint: null,
  uploadOnError: false,
  uploadOnErrorCount: 5,
};

export function useLogRecorder(
  customConfig: Partial<LogRecorderConfig> = {}
): UseLogRecorderReturn {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const config = { ...DEFAULT_CONFIG, ...customConfig };

  const configRef = useRef({
    maxLogs: config.maxLogs,
    enablePersistence: config.enablePersistence,
    persistenceKey: config.persistenceKey,
    captureConsole: config.captureConsole,
    captureFetch: config.captureFetch,
    captureXHR: config.captureXHR,
    sanitizeKeys: config.sanitizeKeys,
    includeMetadata: config.includeMetadata,
    uploadEndpoint: config.uploadEndpoint,
    uploadOnErrorCount: config.uploadOnErrorCount,
  });

  // Update ref when config changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    configRef.current = {
      maxLogs: config.maxLogs,
      enablePersistence: config.enablePersistence,
      persistenceKey: config.persistenceKey,
      captureConsole: config.captureConsole,
      captureFetch: config.captureFetch,
      captureXHR: config.captureXHR,
      sanitizeKeys: config.sanitizeKeys,
      includeMetadata: config.includeMetadata,
      uploadEndpoint: config.uploadEndpoint,
      uploadOnErrorCount: config.uploadOnErrorCount,
    };
  }, [config]);

  const logsRef = useRef<LogEntry[]>([]);
  const sessionIdRef = useRef(config.sessionId || generateSessionId());
  const metadataRef = useRef<LogMetadata>(
    collectMetadata(sessionIdRef.current, config.environment, config.userId, 0)
  );
  const [logCount, setLogCount] = useState(0);
  const errorCountRef = useRef(0);
  const isInitialized = useRef(false);

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

  // Create interceptor instances once
  const consoleInterceptor = useMemo(() => new ConsoleInterceptor(), []);
  const networkInterceptor = useMemo(
    () => new NetworkInterceptor({ excludeUrls: config.excludeUrls }),
    [config.excludeUrls]
  );
  const xhrInterceptor = useMemo(
    () => new XHRInterceptor({ excludeUrls: config.excludeUrls }),
    [config.excludeUrls]
  );

  const addLog = useCallback(
    (logEntry: LogEntry) => {
      const cfg = configRef.current;
      logsRef.current.push(logEntry);

      if (logsRef.current.length > cfg.maxLogs) {
        logsRef.current.shift();
      }

      setLogCount(logsRef.current.length);

      // Track errors for auto-upload
      if (logEntry.type === 'CONSOLE') {
        const consoleEntry = logEntry as { level: string };
        if (consoleEntry.level === 'ERROR') {
          errorCountRef.current++;
        } else {
          errorCountRef.current = 0;
        }
      } else if (logEntry.type === 'FETCH_ERR' || logEntry.type === 'XHR_ERR') {
        errorCountRef.current++;
      } else {
        errorCountRef.current = 0;
      }

      // Auto-upload check
      const uploadThreshold = cfg.uploadOnErrorCount ?? 5;
      if (errorCountRef.current >= uploadThreshold && cfg.uploadEndpoint) {
        const uploadPayload = {
          metadata: { ...metadataRef.current, logCount: logsRef.current.length },
          logs: logsRef.current,
          fileName: generateFilename('json', {}, config),
        };

        fetch(cfg.uploadEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: safeStringify(uploadPayload),
        }).catch(() => {
          // Silently fail auto-upload
        });

        errorCountRef.current = 0;
      }

      if (cfg.enablePersistence && typeof window !== 'undefined') {
        try {
          localStorage.setItem(cfg.persistenceKey, safeStringify(logsRef.current));
        } catch {
          console.warn('[useLogRecorder] Failed to persist logs');
        }
      }
    },
    [safeStringify]
  );

  const updateMetadata = useCallback(() => {
    const errorCount = logsRef.current
      .filter((l) => l.type === 'CONSOLE')
      .reduce((count, log) => {
        const consoleLog = log as { level: string };
        return consoleLog.level === 'ERROR' ? count + 1 : count;
      }, 0);
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

  // Setup interceptors and callbacks
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return;
    isInitialized.current = true;

    // Load persisted logs first
    if (config.enablePersistence) {
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

    const cleanupFns: (() => void)[] = [];

    // Attach console interceptor
    if (config.captureConsole) {
      consoleInterceptor.attach();

      consoleInterceptor.onLog((level, args) => {
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
      });

      cleanupFns.push(() => consoleInterceptor.detach());
    }

    // Attach network interceptor
    if (config.captureFetch) {
      const requestIdMap = new Map<
        string,
        { url: string; method: string; headers: unknown; body: unknown }
      >();

      networkInterceptor.onFetchRequest((url, options) => {
        const requestId = Math.random().toString(36).substring(7);
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

        requestIdMap.set(requestId, {
          url,
          method: options?.method || 'GET',
          headers: sanitizeData(options?.headers as Record<string, unknown>, {
            keys: config.sanitizeKeys,
          }),
          body: requestBody,
        });

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
      });

      networkInterceptor.onFetchResponse((url, status, duration) => {
        for (const [requestId, reqInfo] of requestIdMap.entries()) {
          if (reqInfo.url === url) {
            requestIdMap.delete(requestId);
            addLog({
              type: 'FETCH_RES',
              id: requestId,
              url,
              status,
              statusText: '',
              duration: `${duration}ms`,
              body: '[Response captured by interceptor]',
              time: new Date().toISOString(),
            });
            break;
          }
        }
      });

      networkInterceptor.onFetchError((url, error) => {
        for (const [requestId, reqInfo] of requestIdMap.entries()) {
          if (reqInfo.url === url) {
            requestIdMap.delete(requestId);
            addLog({
              type: 'FETCH_ERR',
              id: requestId,
              url,
              error: error.toString(),
              duration: '[unknown]ms',
              time: new Date().toISOString(),
            });
            break;
          }
        }
      });

      networkInterceptor.attach();
      cleanupFns.push(() => networkInterceptor.detach());
    }

    // Attach XHR interceptor
    if (config.captureXHR) {
      xhrInterceptor.onXHRRequest((xhrConfig) => {
        addLog({
          type: 'XHR_REQ',
          id: Math.random().toString(36).substring(7),
          url: xhrConfig.url,
          method: xhrConfig.method,
          headers: xhrConfig.headers as Record<string, string>,
          body: xhrConfig.body,
          time: new Date().toISOString(),
        });
      });

      xhrInterceptor.onXHRResponse((xhrConfig, status, duration) => {
        addLog({
          type: 'XHR_RES',
          id: Math.random().toString(36).substring(7),
          url: xhrConfig.url,
          status,
          statusText: '',
          duration: `${duration}ms`,
          body: '[Response captured by interceptor]',
          time: new Date().toISOString(),
        });
      });

      xhrInterceptor.onXHRError((xhrConfig, error) => {
        addLog({
          type: 'XHR_ERR',
          id: Math.random().toString(36).substring(7),
          url: xhrConfig.url,
          error: error.message,
          duration: '[unknown]ms',
          time: new Date().toISOString(),
        });
      });

      xhrInterceptor.attach();
      cleanupFns.push(() => xhrInterceptor.detach());
    }

    return () => {
      cleanupFns.forEach((fn) => fn());
      isInitialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, addLog, safeStringify, consoleInterceptor, networkInterceptor, xhrInterceptor]);

  const downloadLogs = useCallback(
    (
      format?: ExportFormat,
      customFilename?: string | null,
      _options?: DownloadOptions
    ): string | null => {
      if (typeof window === 'undefined') return null;

      updateMetadata();
      // TODO: Add support for jsonl, ecs.json, ai.txt formats in future tasks
      let filename =
        customFilename || generateFilename(format as 'json' | 'txt' | undefined, {}, config);

      let content: string;
      let mimeType: string;

      if (format === 'json') {
        const output = config.includeMetadata
          ? { metadata: metadataRef.current, logs: logsRef.current }
          : logsRef.current;
        content = safeStringify(output);
        mimeType = 'application/json';
      } else if (format === 'jsonl') {
        // Transform logs to ECS and output as JSONL
        const ecsLogs = logsRef.current.map((log) => transformToECS(log, metadataRef.current));
        content = stringifyJSONL(ecsLogs);
        mimeType = 'application/x-ndjson';
        filename = customFilename || generateFilename('jsonl' as any, {}, config);
      } else if (format === 'ecs.json') {
        // ECS-compliant JSON with metadata wrapper
        const output = {
          metadata: transformMetadataToECS(metadataRef.current),
          logs: logsRef.current.map((log) => transformToECS(log, metadataRef.current)),
        };
        content = JSON.stringify(output, null, 2);
        mimeType = 'application/json';
        filename = customFilename || generateFilename('ecs-json' as any, {}, config);
      } else if (format === 'ai.txt') {
        // AI-optimized TXT format
        const meta = metadataRef.current;
        const metaSection = `# METADATA
service.name=${meta.environment || 'unknown'}
user.id=${meta.userId || 'anonymous'}
timestamp=${new Date().toISOString()}

# LOGS
`;

        const logLines = logsRef.current.map((log) => {
          const ecs = transformToECS(log, meta);
          const timestamp = ecs['@timestamp'];
          const level = ecs.log?.level || 'info';
          const category = ecs.event?.category?.[0] || 'unknown';

          let line = `[${timestamp}] ${level} ${category}`;

          if (ecs.message) {
            line += ` | message="${ecs.message}"`;
          }
          if (ecs.http?.request?.method) {
            line += ` | req.method=${ecs.http.request.method}`;
          }
          if (ecs.url?.full) {
            line += ` | url=${ecs.url.full}`;
          }
          if (ecs.http?.response?.status_code) {
            line += ` | res.status=${ecs.http.response.status_code}`;
          }
          if (ecs.error?.message) {
            line += ` | error="${ecs.error.message}"`;
          }

          return line;
        });

        content = metaSection + logLines.join('\n');
        mimeType = 'text/plain';
        filename = customFilename || generateFilename('ai-txt' as any, {}, config);
      } else {
        const metaHeader = config.includeMetadata
          ? `${'='.repeat(80)}\nMETADATA\n${'='.repeat(80)}\n${safeStringify(
              metadataRef.current
            )}\n${'='.repeat(80)}\n\n`
          : '';
        content =
          metaHeader +
          logsRef.current
            .map((log) => `[${log.time}] ${log.type}\n${safeStringify(log)}\n${'='.repeat(80)}`)
            .join('\n');
        mimeType = 'text/plain';
      }

      // Use FileService for download with fallback
      FileService.downloadWithFallback(content, filename, mimeType);
      return filename;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.uploadEndpoint, safeStringify, updateMetadata]
  );

  const clearLogs = useCallback(() => {
    logsRef.current = [];
    setLogCount(0);
    errorCountRef.current = 0;

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
