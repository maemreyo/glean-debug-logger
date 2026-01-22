import type { LogEntry, LogMetadata, LogRecorderConfig } from '../../types';
import { generateFilename } from '../../utils';

export interface LogOperations {
  addLog: (logEntry: LogEntry) => void;
  updateMetadata: () => void;
}

export interface LogStateRefs {
  logsRef: React.MutableRefObject<LogEntry[]>;
  metadataRef: React.MutableRefObject<LogMetadata>;
  errorCountRef: React.MutableRefObject<number>;
}

export interface LogOperationOptions {
  maxLogs: number;
  enablePersistence: boolean;
  persistenceKey: string;
  uploadEndpoint: string | null;
  uploadOnErrorCount: number;
  sanitizeKeys: string[];
  environment: string;
  userId: string | null;
}

export function createLogOperations(
  stateRefs: LogStateRefs,
  options: LogOperationOptions,
  safeStringify: (obj: unknown) => string,
  setLogCount: (count: number) => void
): LogOperations {
  const addLog = (logEntry: LogEntry): void => {
    stateRefs.logsRef.current.push(logEntry);

    if (stateRefs.logsRef.current.length > options.maxLogs) {
      stateRefs.logsRef.current.shift();
    }

    setLogCount(stateRefs.logsRef.current.length);

    // Track errors for auto-upload
    if (logEntry.type === 'CONSOLE') {
      const consoleEntry = logEntry as { level: string };
      if (consoleEntry.level === 'ERROR') {
        stateRefs.errorCountRef.current++;
      } else {
        stateRefs.errorCountRef.current = 0;
      }
    } else if (logEntry.type === 'FETCH_ERR' || logEntry.type === 'XHR_ERR') {
      stateRefs.errorCountRef.current++;
    } else {
      stateRefs.errorCountRef.current = 0;
    }

    // Auto-upload check
    const uploadThreshold = options.uploadOnErrorCount ?? 5;
    if (stateRefs.errorCountRef.current >= uploadThreshold && options.uploadEndpoint) {
      const uploadPayload = {
        metadata: { ...stateRefs.metadataRef.current, logCount: stateRefs.logsRef.current.length },
        logs: stateRefs.logsRef.current,
        fileName: generateFilename('json', {}, {
          fileNameTemplate: '{env}_{userId}_{sessionId}_{timestamp}',
          environment: options.environment,
          userId: options.userId,
          sessionId: null,
        } as LogRecorderConfig),
      };

      fetch(options.uploadEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: safeStringify(uploadPayload),
      }).catch(() => {
        // Silently fail auto-upload
      });

      stateRefs.errorCountRef.current = 0;
    }

    if (options.enablePersistence && typeof window !== 'undefined') {
      try {
        localStorage.setItem(options.persistenceKey, safeStringify(stateRefs.logsRef.current));
      } catch {
        console.warn('[useLogRecorder] Failed to persist logs');
      }
    }
  };

  const updateMetadata = (): void => {
    const errorCount = stateRefs.logsRef.current
      .filter((l) => l.type === 'CONSOLE')
      .reduce((count, log) => {
        const consoleLog = log as { level: string };
        return consoleLog.level === 'ERROR' ? count + 1 : count;
      }, 0);
    const networkErrorCount = stateRefs.logsRef.current.filter(
      (l) => l.type === 'FETCH_ERR' || l.type === 'XHR_ERR'
    ).length;

    stateRefs.metadataRef.current = {
      ...stateRefs.metadataRef.current,
      logCount: stateRefs.logsRef.current.length,
      errorCount,
      networkErrorCount,
    };
  };

  return {
    addLog,
    updateMetadata,
  };
}

export function createSafeStringify(): (obj: unknown) => string {
  return (obj: unknown): string => {
    const seen = new Set<object>();
    return JSON.stringify(obj, (_key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
      }
      return value;
    });
  };
}
