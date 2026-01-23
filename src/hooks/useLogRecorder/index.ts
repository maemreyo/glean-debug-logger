/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */
import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import type { LogRecorderConfig, LogEntry, LogMetadata, UseLogRecorderReturn } from '../../types';
import { sanitizeData, generateSessionId, collectMetadata } from '../../utils';
import { ConsoleInterceptor } from '../../interceptors/ConsoleInterceptor';
import { NetworkInterceptor } from '../../interceptors/NetworkInterceptor';
import { XHRInterceptor } from '../../interceptors/XHRInterceptor';

import { DEFAULT_CONFIG, generateRequestId, sanitizeHeaders } from './config';
import { createLogOperations, createSafeStringify } from './operations';
import { createExportHandler } from './export';
import { createUploadHandler } from './upload';

export { DEFAULT_CONFIG } from './config';

export function useLogRecorder(
  customConfig: Partial<LogRecorderConfig> = {}
): UseLogRecorderReturn {
  const config = { ...DEFAULT_CONFIG, ...customConfig };

  // Store config in ref to avoid useEffect re-runs when config object changes
  const configRef = useRef(config);
  configRef.current = config;

  const logsRef = useRef<LogEntry[]>([]);
  const sessionIdRef = useRef(config.sessionId || generateSessionId());
  const metadataRef = useRef<LogMetadata>(
    collectMetadata(sessionIdRef.current, config.environment, config.userId, 0)
  );
  const [_logCount, setLogCount] = useState(0);
  const errorCountRef = useRef(0);

  const safeStringify = useMemo(() => createSafeStringify(), []);

  const consoleInterceptor = useMemo(() => ConsoleInterceptor.getInstance(), []);
  const networkInterceptor = useMemo(
    () => new NetworkInterceptor({ excludeUrls: config.excludeUrls }),
    [config.excludeUrls]
  );
  const xhrInterceptor = useMemo(
    () => new XHRInterceptor({ excludeUrls: config.excludeUrls }),
    [config.excludeUrls]
  );

  const logOperations = useMemo(
    () =>
      createLogOperations(
        { logsRef, metadataRef, errorCountRef },
        {
          maxLogs: config.maxLogs,
          enablePersistence: config.enablePersistence,
          persistenceKey: config.persistenceKey,
          uploadEndpoint: config.uploadEndpoint,
          uploadOnErrorCount: config.uploadOnErrorCount ?? 5,
          sanitizeKeys: config.sanitizeKeys,
          environment: config.environment,
          userId: config.userId,
        },
        safeStringify,
        setLogCount
      ),
    [config, safeStringify]
  );

  const updateMetadata = logOperations.updateMetadata;

  // Use ref for addLog to avoid closure staleness in interceptor callbacks
  const addLogRef = useRef(logOperations.addLog);
  addLogRef.current = logOperations.addLog;

  const downloadLogs = useMemo(
    () => createExportHandler(logsRef, metadataRef, safeStringify, updateMetadata),
    [safeStringify, updateMetadata]
  );

  const uploadLogs = useMemo(
    () => createUploadHandler(logsRef, metadataRef, safeStringify, updateMetadata),
    [safeStringify, updateMetadata]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentConfig = configRef.current;

    if (currentConfig.enablePersistence) {
      try {
        const stored = localStorage.getItem(currentConfig.persistenceKey);
        if (stored) {
          logsRef.current = JSON.parse(stored);
          setLogCount(logsRef.current.length);
        }
      } catch {
        // Silently fail
      }
    }

    const cleanupFns: (() => void)[] = [];

    if (currentConfig.captureConsole) {
      consoleInterceptor.attach();

      const consoleCallback = (level: string, args: unknown[]) => {
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

        addLogRef.current({
          type: 'CONSOLE',
          level: level.toUpperCase(),
          time: new Date().toISOString(),
          data: data.substring(0, 5000),
        });
      };

      consoleInterceptor.onLog(consoleCallback);

      cleanupFns.push(() => {
        consoleInterceptor.removeLog(consoleCallback);
        consoleInterceptor.detach();
      });
    }

    if (currentConfig.captureFetch) {
      const requestIdMap = new Map<
        string,
        { url: string; method: string; headers: unknown; body: unknown; timeoutId: number }
      >();

      const fetchRequestCallback = (url: string, options: RequestInit) => {
        const requestId = generateRequestId();
        let requestBody: unknown = null;
        if (options?.body) {
          try {
            requestBody =
              typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
            requestBody = sanitizeData(requestBody, { keys: currentConfig.sanitizeKeys });
          } catch {
            requestBody = String(options.body).substring(0, 1000);
          }
        }

        // Cleanup after 30s if no response comes (prevents memory leak)
        const timeoutId = window.setTimeout(() => {
          requestIdMap.delete(requestId);
        }, 30000);

        requestIdMap.set(requestId, {
          url,
          method: options?.method || 'GET',
          headers: sanitizeHeaders(
            options?.headers as Record<string, unknown>,
            currentConfig.sanitizeKeys
          ),
          body: requestBody,
          timeoutId,
        });

        addLogRef.current({
          type: 'FETCH_REQ',
          id: requestId,
          url,
          method: options?.method || 'GET',
          headers: sanitizeHeaders(
            options?.headers as Record<string, unknown>,
            currentConfig.sanitizeKeys
          ),
          body: requestBody,
          time: new Date().toISOString(),
        });
      };

      const fetchResponseCallback = (url: string, status: number, duration: number) => {
        for (const [requestId, reqInfo] of requestIdMap.entries()) {
          if (reqInfo.url === url) {
            clearTimeout(reqInfo.timeoutId); // Clear timeout on response
            requestIdMap.delete(requestId);
            addLogRef.current({
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
      };

      const fetchErrorCallback = (url: string, error: Error) => {
        for (const [requestId, reqInfo] of requestIdMap.entries()) {
          if (reqInfo.url === url) {
            clearTimeout(reqInfo.timeoutId); // Clear timeout on error
            requestIdMap.delete(requestId);
            addLogRef.current({
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
      };

      networkInterceptor.onFetchRequest(fetchRequestCallback);
      networkInterceptor.onFetchResponse(fetchResponseCallback);
      networkInterceptor.onFetchError(fetchErrorCallback);

      networkInterceptor.attach();
      cleanupFns.push(() => {
        networkInterceptor.removeFetchRequest(fetchRequestCallback);
        networkInterceptor.removeFetchResponse(fetchResponseCallback);
        networkInterceptor.removeFetchError(fetchErrorCallback);
        networkInterceptor.detach();
      });
    }

    if (currentConfig.captureXHR) {
      const xhrRequestIdMap = new Map<
        string,
        {
          url: string;
          method: string;
          headers: Record<string, string>;
          body: unknown;
          timeoutId: number;
        }
      >();

      const xhrRequestCallback = (xhrConfig: {
        method: string;
        url: string;
        headers: Record<string, string>;
        body: unknown;
        requestId: string;
      }) => {
        // Cleanup after 30s if no response comes (prevents memory leak)
        const timeoutId = window.setTimeout(() => {
          xhrRequestIdMap.delete(xhrConfig.requestId);
        }, 30000);

        xhrRequestIdMap.set(xhrConfig.requestId, {
          url: xhrConfig.url,
          method: xhrConfig.method,
          headers: xhrConfig.headers,
          body: xhrConfig.body,
          timeoutId,
        });

        addLogRef.current({
          type: 'XHR_REQ',
          id: xhrConfig.requestId,
          url: xhrConfig.url,
          method: xhrConfig.method,
          headers: xhrConfig.headers as Record<string, string>,
          body: xhrConfig.body,
          time: new Date().toISOString(),
        });
      };

      const xhrResponseCallback = (
        xhrConfig: {
          method: string;
          url: string;
          headers: Record<string, string>;
          body: unknown;
          requestId: string;
        },
        status: number,
        duration: number
      ) => {
        const reqInfo = xhrRequestIdMap.get(xhrConfig.requestId);
        if (reqInfo) {
          clearTimeout(reqInfo.timeoutId); // Clear timeout on response
          xhrRequestIdMap.delete(xhrConfig.requestId);
          addLogRef.current({
            type: 'XHR_RES',
            id: xhrConfig.requestId,
            url: xhrConfig.url,
            status,
            statusText: '',
            duration: `${duration}ms`,
            body: '[Response captured by interceptor]',
            time: new Date().toISOString(),
          });
        }
      };

      const xhrErrorCallback = (
        xhrConfig: {
          method: string;
          url: string;
          headers: Record<string, string>;
          body: unknown;
          requestId: string;
        },
        error: Error
      ) => {
        const reqInfo = xhrRequestIdMap.get(xhrConfig.requestId);
        if (reqInfo) {
          clearTimeout(reqInfo.timeoutId); // Clear timeout on error
          xhrRequestIdMap.delete(xhrConfig.requestId);
          addLogRef.current({
            type: 'XHR_ERR',
            id: xhrConfig.requestId,
            url: xhrConfig.url,
            error: error.message,
            duration: '[unknown]ms',
            time: new Date().toISOString(),
          });
        }
      };

      xhrInterceptor.onXHRRequest(xhrRequestCallback);
      xhrInterceptor.onXHRResponse(xhrResponseCallback);
      xhrInterceptor.onXHRError(xhrErrorCallback);

      xhrInterceptor.attach();
      cleanupFns.push(() => {
        xhrInterceptor.removeXHRRequest(xhrRequestCallback);
        xhrInterceptor.removeXHRResponse(xhrResponseCallback);
        xhrInterceptor.removeXHRError(xhrErrorCallback);
        xhrInterceptor.detach();
      });
    }

    if (currentConfig.enablePersistence && currentConfig.persistAcrossReloads === false) {
      const clearOnUnload = () => {
        try {
          localStorage.removeItem(currentConfig.persistenceKey);
        } catch {
          // Silently fail
        }
      };
      window.addEventListener('beforeunload', clearOnUnload);
      cleanupFns.push(() => window.removeEventListener('beforeunload', clearOnUnload));
    }

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []); // Empty deps - run once on mount

  const clearLogs = useCallback(() => {
    logsRef.current = [];
    setLogCount(0);
    errorCountRef.current = 0;

    if (config.enablePersistence && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(config.persistenceKey);
      } catch {
        // Silently fail
      }
    }
  }, [config.enablePersistence, config.persistenceKey]);

  const getLogs = useCallback(() => {
    return [...logsRef.current];
  }, []);

  const getLogCount = useCallback(() => {
    return logsRef.current.length;
  }, []);

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
    _logCount, // Expose state for triggering re-renders in DebugPanel
  };
}
