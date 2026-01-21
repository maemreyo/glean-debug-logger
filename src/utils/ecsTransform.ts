// ==========================================
// ECS (Elastic Common Schema) Transformation
// ==========================================
// Transforms LogEntry and LogMetadata to ECS 1.12.0 format

import type { LogEntry, LogMetadata } from '../types';

// ==========================================
// Type Definitions
// ==========================================

/**
 * Stack frame interface for error stack traces
 */
export interface StackFrame {
  filename?: string;
  functionName?: string;
  lineNumber?: number;
  columnNumber?: number;
  ignored?: boolean;
}

/**
 * ECS Document representing a single log entry in ECS format
 */
export interface ECSDocument {
  '@timestamp': string;
  event: {
    id?: string;
    category: string[];
    action?: string;
    duration?: number;
    original?: LogEntry;
  };
  log?: {
    level?: string;
  };
  message?: string;
  http?: {
    request?: {
      method?: string;
    };
    response?: {
      status_code?: number;
    };
  };
  url?: {
    full?: string;
  };
  error?: {
    message?: string;
    stack_trace?: string;
  };
  service?: {
    environment?: string;
  };
  user?: {
    id?: string;
  };
  host?: {
    name?: string;
    type?: string;
  };
}

// ==========================================
// Constants
// ==========================================

const MAX_STACK_FRAMES = 20;

/**
 * Maps console log levels to ECS log.level format
 */
const LEVEL_MAP: Record<string, string> = {
  log: 'info',
  info: 'info',
  warn: 'warn',
  error: 'error',
  debug: 'debug',
};

// ==========================================
// Helper Functions
// ==========================================

/**
 * Convert duration string (ms) to nanoseconds for ECS
 */
function convertDurationToNanoseconds(durationStr: string): number {
  const ms = parseFloat(durationStr);
  return isNaN(ms) ? 0 : Math.round(ms * 1_000_000);
}

/**
 * Transform console level to ECS log.level
 */
function transformConsoleLevel(level: string): string {
  return LEVEL_MAP[level.toLowerCase()] || 'info';
}

// ==========================================
// Main Functions
// ==========================================

/**
 * Filter stack trace frames (exclude ignored, max 20)
 */
export function filterStackTrace(frames: StackFrame[]): StackFrame[] {
  return frames.filter((frame) => !frame.ignored).slice(0, MAX_STACK_FRAMES);
}

/**
 * Transform LogMetadata to ECS service/host/user fields
 */
export function transformMetadataToECS(metadata: LogMetadata): Partial<ECSDocument> {
  return {
    service: {
      environment: metadata.environment,
    },
    user: metadata.userId ? { id: metadata.userId } : undefined,
    host: {
      name: metadata.browser,
      type: metadata.platform,
    },
  };
}

/**
 * Transform a LogEntry to ECS format
 */
export function transformToECS(log: LogEntry, metadata: LogMetadata): ECSDocument {
  const baseDoc: ECSDocument = {
    '@timestamp': log.time,
    event: {
      original: log,
      category: [],
    },
  };

  // Add metadata fields
  const metadataFields = transformMetadataToECS(metadata);
  Object.assign(baseDoc, metadataFields);

  // Transform based on log type
  switch (log.type) {
    case 'CONSOLE': {
      baseDoc.log = { level: transformConsoleLevel(log.level) };
      baseDoc.message = log.data;
      baseDoc.event.category = ['console'];
      break;
    }

    case 'FETCH_REQ':
    case 'XHR_REQ': {
      baseDoc.http = {
        request: {
          method: log.method,
        },
      };
      baseDoc.url = { full: log.url };
      baseDoc.event.category = ['network', 'web'];
      baseDoc.event.action = 'request';
      baseDoc.event.id = log.id;
      break;
    }

    case 'FETCH_RES':
    case 'XHR_RES': {
      baseDoc.http = {
        response: {
          status_code: log.status,
        },
      };
      baseDoc.url = { full: log.url };
      baseDoc.event.duration = convertDurationToNanoseconds(log.duration);
      baseDoc.event.category = ['network', 'web'];
      baseDoc.event.action = 'response';
      baseDoc.event.id = log.id;
      break;
    }

    case 'FETCH_ERR':
    case 'XHR_ERR': {
      baseDoc.error = {
        message: log.error,
      };
      baseDoc.url = { full: log.url };
      baseDoc.event.duration = convertDurationToNanoseconds(log.duration);
      baseDoc.event.category = ['network', 'web'];
      baseDoc.event.action = 'error';
      baseDoc.event.id = log.id;

      // Extract stack trace from body if present (may be added dynamically)
      const logWithBody = log as LogEntry & { body?: unknown };
      if (typeof logWithBody.body === 'object' && logWithBody.body !== null) {
        const body = logWithBody.body as Record<string, unknown>;
        if (Array.isArray(body.frames)) {
          const filteredFrames = filterStackTrace(body.frames as StackFrame[]);
          baseDoc.error.stack_trace = filteredFrames
            .map(
              (frame) =>
                `  at ${frame.functionName || '?'} (${frame.filename || '?'}:${frame.lineNumber || 0}:${frame.columnNumber || 0})`
            )
            .join('\n');
        }
      }
      break;
    }

    default: {
      // Unknown log type, preserve as much as possible
      baseDoc.message = JSON.stringify(log);
      break;
    }
  }

  return baseDoc;
}
