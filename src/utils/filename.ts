import { sanitizeFilename, getBrowserInfo } from './sanitize';
import { LogMetadata } from '../types';

export interface FilenameOptions {
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

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function generateFilename(
  format: 'json' | 'txt' = 'json',
  customData: Record<string, string | number> = {},
  options: FilenameOptions = {}
): string {
  const {
    fileNameTemplate = '{env}_{userId}_{sessionId}_{timestamp}',
    environment = 'development',
    userId = 'anonymous',
    sessionId = 'unknown',
  } = options;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0] as string;
  const date = new Date().toISOString().split('T')[0] as string;
  const time = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).replace(/:/g, '-') as string;

  const browser = options.browser || getBrowserInfo();
  const platform = options.platform || (typeof navigator !== 'undefined' ? navigator.platform : 'unknown');
  const url = options.url || (typeof window !== 'undefined' ? window.location.pathname.replace(/\//g, '_') : 'unknown');
  const sanitizedUrl = url.split('?')[0] || 'unknown';

  const errorCount = String(options.errorCount ?? customData.errorCount ?? 0);
  const logCountStr = String(options.logCount ?? customData.logCount ?? 0);

  let filename = fileNameTemplate
    .replace('{env}', sanitizeFilename(environment))
    .replace('{userId}', sanitizeFilename(userId ?? 'anonymous'))
    .replace('{sessionId}', sanitizeFilename(sessionId ?? 'unknown'))
    .replace('{timestamp}', timestamp)
    .replace('{date}', date)
    .replace('{time}', time)
    .replace(/\{errorCount\}/g, errorCount)
    .replace(/\{logCount\}/g, logCountStr)
    .replace('{browser}', sanitizeFilename(browser))
    .replace('{platform}', sanitizeFilename(platform))
    .replace('{url}', sanitizeFilename(sanitizedUrl));

  for (const [key, value] of Object.entries(customData)) {
    filename = filename.replace(`{${key}}`, String(value));
  }

  return `${filename}.${format}`;
}

export function generateExportFilename(
  metadata: LogMetadata,
  format: 'json' | 'txt' = 'json'
): string {
  const sanitizedUrl = metadata.url.split('?')[0] || 'unknown';
  return generateFilename(format, {}, {
    environment: metadata.environment,
    userId: metadata.userId,
    sessionId: metadata.sessionId,
    browser: metadata.browser,
    platform: metadata.platform,
    url: sanitizedUrl,
    errorCount: metadata.errorCount,
    logCount: metadata.logCount,
  });
}
