// ==========================================
// Type Definitions for @zaob/glean-debug-logger
// ==========================================

// Log Types
export type LogType =
  | 'CONSOLE'
  | 'FETCH_REQ'
  | 'FETCH_RES'
  | 'FETCH_ERR'
  | 'XHR_REQ'
  | 'XHR_RES'
  | 'XHR_ERR';

export type ConsoleLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

// Console Log Entry
export interface ConsoleLogEntry {
  type: 'CONSOLE';
  level: string;
  time: string;
  data: string;
}

// Fetch Request Entry
export interface FetchRequestEntry {
  type: 'FETCH_REQ';
  id: string;
  url: string;
  method: string;
  headers: Record<string, unknown> | null;
  body: unknown;
  time: string;
}

// Fetch Response Entry
export interface FetchResponseEntry {
  type: 'FETCH_RES';
  id: string;
  url: string;
  status: number;
  statusText: string;
  duration: string;
  body: unknown;
  time: string;
}

// Fetch Error Entry
export interface FetchErrorEntry {
  type: 'FETCH_ERR';
  id: string;
  url: string;
  error: string;
  duration: string;
  time: string;
}

// XHR Request Entry
export interface XHRRequestEntry {
  type: 'XHR_REQ';
  id: string;
  url: string;
  method: string;
  headers: Record<string, unknown>;
  body: unknown;
  time: string;
}

// XHR Response Entry
export interface XHRResponseEntry {
  type: 'XHR_RES';
  id: string;
  url: string;
  status: number;
  statusText: string;
  duration: string;
  body: unknown;
  time: string;
}

// XHR Error Entry
export interface XHRErrorEntry {
  type: 'XHR_ERR';
  id: string;
  url: string;
  error: string;
  duration: string;
  time: string;
}

// Union Type for All Log Entries
export type LogEntry =
  | ConsoleLogEntry
  | FetchRequestEntry
  | FetchResponseEntry
  | FetchErrorEntry
  | XHRRequestEntry
  | XHRResponseEntry
  | XHRErrorEntry;

// Session Metadata
export interface LogMetadata {
  sessionId: string;
  environment: string;
  userId: string | null;
  timestamp: string;
  userAgent: string;
  browser: string;
  platform: string;
  language: string;
  screenResolution: string;
  viewport: string;
  url: string;
  referrer: string;
  timezone: string;
  logCount: number;
  errorCount: number;
  networkErrorCount: number;
}

// Configuration Options
export interface LogRecorderConfig {
  maxLogs: number;
  enablePersistence: boolean;
  persistenceKey: string;
  captureConsole: boolean;
  captureFetch: boolean;
  captureXHR: boolean;
  sanitizeKeys: string[];
  excludeUrls: string[];
  fileNameTemplate: string;
  environment: string;
  userId: string | null;
  sessionId: string | null;
  includeMetadata: boolean;
  uploadEndpoint: string | null;
  uploadOnError: boolean;
}

// Hook Return Type
export interface UseLogRecorderReturn {
  downloadLogs: (format?: 'json' | 'txt', customFilename?: string | null) => string | null;
  uploadLogs: (customEndpoint?: string | null) => Promise<{ success: boolean; data?: unknown; error?: string }>;
  clearLogs: () => void;
  getLogs: () => LogEntry[];
  getLogCount: () => number;
  getMetadata: () => LogMetadata;
  sessionId: string;
}

// Filename Template Placeholders
export type FilenamePlaceholder =
  | '{env}'
  | '{userId}'
  | '{sessionId}'
  | '{timestamp}'
  | '{date}'
  | '{time}'
  | '{errorCount}'
  | '{logCount}'
  | '{browser}'
  | '{platform}'
  | '{url}';

// Export Output Formats
export interface ExportOutput {
  metadata: LogMetadata;
  logs: LogEntry[];
}

// Upload Payload
export interface UploadPayload {
  metadata: LogMetadata;
  logs: LogEntry[];
  fileName: string;
}
