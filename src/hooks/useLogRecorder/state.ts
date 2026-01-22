import type { LogEntry, LogMetadata } from '../../types';
import { collectMetadata, generateSessionId } from '../../utils';

export interface LogState {
  logsRef: React.MutableRefObject<LogEntry[]>;
  sessionIdRef: React.MutableRefObject<string>;
  metadataRef: React.MutableRefObject<LogMetadata>;
  logCount: number;
  errorCountRef: React.MutableRefObject<number>;
  isInitialized: React.MutableRefObject<boolean>;
}

export interface LogStateOptions {
  maxLogs: number;
  environment: string;
  userId: string | null;
  sessionId: string | null;
}

export function createLogState(options: LogStateOptions): LogState {
  const sessionId = options.sessionId || generateSessionId();

  return {
    logsRef: { current: [] },
    sessionIdRef: { current: sessionId },
    metadataRef: {
      current: collectMetadata(sessionId, options.environment, options.userId, 0),
    },
    logCount: 0,
    errorCountRef: { current: 0 },
    isInitialized: { current: false },
  };
}

// Callback to notify parent hook of log count changes
export type LogCountUpdater = (count: number) => void;
