import { LogMetadata } from '../types';

const DEFAULT_SANITIZE_KEYS = [
  'password',
  'token',
  'apiKey',
  'secret',
  'authorization',
  'creditCard',
  'cardNumber',
  'cvv',
  'ssn',
];

export interface SanitizeOptions {
  keys?: string[];
}

export function sanitizeData<T>(data: T, options: SanitizeOptions = {}): T {
  const keys = options.keys || DEFAULT_SANITIZE_KEYS;

  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = Array.isArray(data) ? [...data] : { ...data };

  const sanitizeRecursive = (obj: Record<string, unknown>): Record<string, unknown> => {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const lowerKey = key.toLowerCase();
        const shouldRedact = keys.some((k) => lowerKey.includes(k.toLowerCase()));

        if (shouldRedact) {
          obj[key] = '***REDACTED***';
        } else if (obj[key] !== null && typeof obj[key] === 'object') {
          obj[key] = sanitizeRecursive(obj[key] as Record<string, unknown>);
        }
      }
    }

    return obj;
  };

  return sanitizeRecursive(sanitized as Record<string, unknown>) as T;
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9_\-]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

export function getBrowserInfo(): string {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }

  const ua = navigator.userAgent;

  if (ua.includes('Edg')) return 'edge';
  if (ua.includes('Chrome')) return 'chrome';
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Safari')) return 'safari';

  return 'unknown';
}

export function collectMetadata(
  sessionId: string,
  environment: string,
  userId: string | null,
  logCount: number
): LogMetadata {
  if (typeof window === 'undefined') {
    return {
      sessionId,
      environment,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: '',
      browser: 'unknown',
      platform: '',
      language: '',
      screenResolution: '0x0',
      viewport: '0x0',
      url: '',
      referrer: '',
      timezone: '',
      logCount,
      errorCount: 0,
      networkErrorCount: 0,
    };
  }

  const screenRes =
    typeof window.screen !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '0x0';
  const viewportRes =
    typeof window.innerWidth !== 'undefined' && typeof window.innerHeight !== 'undefined'
      ? `${window.innerWidth}x${window.innerHeight}`
      : '0x0';

  return {
    sessionId,
    environment,
    userId,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    browser: getBrowserInfo(),
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: screenRes,
    viewport: viewportRes,
    url: window.location.href,
    referrer: document.referrer,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    logCount,
    errorCount: 0,
    networkErrorCount: 0,
  };
}
