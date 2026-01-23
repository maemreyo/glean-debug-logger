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
    persistAcrossReloads: config.persistAcrossReloads,
  });

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
      persistAcrossReloads: config.persistAcrossReloads,
    };
  }, [config]);

  const logsRef = useRef<LogEntry[]>([]);
  const sessionIdRef = useRef(config.sessionId || generateSessionId());
  const metadataRef = useRef<LogMetadata>(
    collectMetadata(sessionIdRef.current, config.environment, config.userId, 0)
  );
  const [_logCount, setLogCount] = useState(0);
  const errorCountRef = useRef(0);
  const isInitialized = useRef(false);

  const safeStringify = useMemo(() => createSafeStringify(), []);

  const consoleInterceptor = useMemo(() => new ConsoleInterceptor(), []);
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
    [config, safeStringify, setLogCount]
  );

  const addLog = logOperations.addLog;
  const updateMetadata = logOperations.updateMetadata;

  const downloadLogs = useMemo(
    () => createExportHandler(logsRef, metadataRef, safeStringify, updateMetadata),
    [safeStringify, updateMetadata]
  );

  const uploadLogs = useMemo(
    () => createUploadHandler(logsRef, metadataRef, safeStringify, updateMetadata),
    [safeStringify, updateMetadata]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return;
    isInitialized.current = true;

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

    if (config.captureFetch) {
      const requestIdMap = new Map<
        string,
        { url: string; method: string; headers: unknown; body: unknown }
      >();

      networkInterceptor.onFetchRequest((url, options) => {
        const requestId = generateRequestId();
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
          headers: sanitizeHeaders(
            options?.headers as Record<string, unknown>,
            config.sanitizeKeys
          ),
          body: requestBody,
        });

        addLog({
          type: 'FETCH_REQ',
          id: requestId,
          url,
          method: options?.method || 'GET',
          headers: sanitizeHeaders(
            options?.headers as Record<string, unknown>,
            config.sanitizeKeys
          ),
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

    if (config.captureXHR) {
      xhrInterceptor.onXHRRequest((xhrConfig) => {
        addLog({
          type: 'XHR_REQ',
          id: generateRequestId(),
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
          id: generateRequestId(),
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
          id: generateRequestId(),
          url: xhrConfig.url,
          error: error.message,
          duration: '[unknown]ms',
          time: new Date().toISOString(),
        });
      });

      xhrInterceptor.attach();
      cleanupFns.push(() => xhrInterceptor.detach());
    }

    // Clear persisted logs on page unload if persistAcrossReloads is false
    if (config.enablePersistence && config.persistAcrossReloads === false) {
      const clearOnUnload = () => {
        try {
          localStorage.removeItem(config.persistenceKey);
        } catch {
          // Silently fail
        }
      };
      window.addEventListener('beforeunload', clearOnUnload);
      cleanupFns.push(() => window.removeEventListener('beforeunload', clearOnUnload));
    }

    return () => {
      cleanupFns.forEach((fn) => fn());
      isInitialized.current = false;
    };
  }, [config, addLog, safeStringify, consoleInterceptor, networkInterceptor, xhrInterceptor]);

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
  };
}
