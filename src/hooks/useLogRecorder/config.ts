import type { LogRecorderConfig } from '../../types';
import { sanitizeData } from '../../utils';

export const DEFAULT_CONFIG: LogRecorderConfig = {
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

export function generateRequestId(): string {
  return Math.random().toString(36).substring(7);
}

export function sanitizeHeaders(
  headers: Record<string, unknown>,
  sanitizeKeys: string[]
): Record<string, unknown> {
  return sanitizeData(headers, { keys: sanitizeKeys });
}
