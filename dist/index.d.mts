import * as react_jsx_runtime from 'react/jsx-runtime';

type LogType = 'CONSOLE' | 'FETCH_REQ' | 'FETCH_RES' | 'FETCH_ERR' | 'XHR_REQ' | 'XHR_RES' | 'XHR_ERR';
type ConsoleLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';
interface ConsoleLogEntry {
    type: 'CONSOLE';
    level: string;
    time: string;
    data: string;
}
interface FetchRequestEntry {
    type: 'FETCH_REQ';
    id: string;
    url: string;
    method: string;
    headers: Record<string, unknown> | null;
    body: unknown;
    time: string;
}
interface FetchResponseEntry {
    type: 'FETCH_RES';
    id: string;
    url: string;
    status: number;
    statusText: string;
    duration: string;
    body: unknown;
    time: string;
}
interface FetchErrorEntry {
    type: 'FETCH_ERR';
    id: string;
    url: string;
    error: string;
    duration: string;
    time: string;
}
interface XHRRequestEntry {
    type: 'XHR_REQ';
    id: string;
    url: string;
    method: string;
    headers: Record<string, unknown>;
    body: unknown;
    time: string;
}
interface XHRResponseEntry {
    type: 'XHR_RES';
    id: string;
    url: string;
    status: number;
    statusText: string;
    duration: string;
    body: unknown;
    time: string;
}
interface XHRErrorEntry {
    type: 'XHR_ERR';
    id: string;
    url: string;
    error: string;
    duration: string;
    time: string;
}
type LogEntry = ConsoleLogEntry | FetchRequestEntry | FetchResponseEntry | FetchErrorEntry | XHRRequestEntry | XHRResponseEntry | XHRErrorEntry;
interface LogMetadata {
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
interface LogRecorderConfig {
    maxLogs: number;
    enablePersistence: boolean;
    /** Enable directory picker for downloads (Chrome 86+, Edge 86+ only) */
    enableDirectoryPicker?: boolean;
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
    /** Number of consecutive errors before auto-upload triggers */
    uploadOnErrorCount?: number;
}
interface UseLogRecorderReturn {
    downloadLogs: (format?: 'json' | 'txt', customFilename?: string | null, options?: DownloadOptions) => string | null;
    uploadLogs: (customEndpoint?: string | null) => Promise<{
        success: boolean;
        data?: unknown;
        error?: string;
    }>;
    clearLogs: () => void;
    getLogs: () => LogEntry[];
    getLogCount: () => number;
    getMetadata: () => LogMetadata;
    sessionId: string;
}
type FilenamePlaceholder = '{env}' | '{userId}' | '{sessionId}' | '{timestamp}' | '{date}' | '{time}' | '{errorCount}' | '{logCount}' | '{browser}' | '{platform}' | '{url}';
interface ExportOutput {
    metadata: LogMetadata;
    logs: LogEntry[];
}
interface UploadPayload {
    metadata: LogMetadata;
    logs: LogEntry[];
    fileName: string;
}
/** Options for downloadLogs function */
interface DownloadOptions {
    /** Show directory picker instead of default download location */
    showPicker?: boolean;
}

declare function useLogRecorder(customConfig?: Partial<LogRecorderConfig>): UseLogRecorderReturn;

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
declare function DebugPanel({ user, environment, uploadEndpoint, fileNameTemplate, maxLogs, showInProduction, }: DebugPanelProps): react_jsx_runtime.JSX.Element | null;

interface DebugPanelMinimalProps {
    fileNameTemplate?: string;
}
declare function DebugPanelMinimal({ fileNameTemplate, }: DebugPanelMinimalProps): react_jsx_runtime.JSX.Element;

interface SanitizeOptions {
    keys?: string[];
}
declare function sanitizeData<T>(data: T, options?: SanitizeOptions): T;
declare function sanitizeFilename(name: string): string;
declare function getBrowserInfo(): string;
declare function collectMetadata(sessionId: string, environment: string, userId: string | null, logCount: number): LogMetadata;

interface FilenameOptions {
    fileNameTemplate?: string;
    environment?: string;
    userId?: string | null;
    sessionId?: string | null;
    browser?: string;
    platform?: string;
    url?: string;
    errorCount?: number;
    logCount?: number;
}
declare function generateSessionId(): string;
declare function generateFilename(format?: 'json' | 'txt', customData?: Record<string, string | number>, options?: FilenameOptions): string;
declare function generateExportFilename(metadata: LogMetadata, format?: 'json' | 'txt'): string;

export { type ConsoleLevel, type ConsoleLogEntry, DebugPanel, DebugPanelMinimal, type DownloadOptions, type ExportOutput, type FetchErrorEntry, type FetchRequestEntry, type FetchResponseEntry, type FilenameOptions, type FilenamePlaceholder, type LogEntry, type LogMetadata, type LogRecorderConfig, type LogType, type SanitizeOptions, type UploadPayload, type UseLogRecorderReturn, type XHRErrorEntry, type XHRRequestEntry, type XHRResponseEntry, collectMetadata, generateExportFilename, generateFilename, generateSessionId, getBrowserInfo, sanitizeData, sanitizeFilename, useLogRecorder };
