/**
 * Unit tests for metadata utility functions
 * Tests: collectMetadata(), getBrowserInfo()
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBrowserInfo, collectMetadata } from './sanitize';

describe('getBrowserInfo', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should identify Chrome browser', () => {
    expect(getBrowserInfo()).toBe('chrome');
  });

  it('should identify Safari browser', () => {
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    });
    expect(getBrowserInfo()).toBe('safari');
  });

  it('should identify Firefox browser', () => {
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
    });
    expect(getBrowserInfo()).toBe('firefox');
  });

  it('should identify Edge browser', () => {
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    });
    expect(getBrowserInfo()).toBe('edge');
  });

  it('should return unknown for unrecognized user agent', () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Unknown Bot/1.0',
    });
    expect(getBrowserInfo()).toBe('unknown');
  });

  it('should return unknown when navigator is undefined', () => {
    vi.unstubAllGlobals();
    expect(getBrowserInfo()).toBe('unknown');
  });
});

describe('collectMetadata', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return skeleton metadata in SSR environment', () => {
    // Mock SSR environment by removing window
    const originalWindow = globalThis.window;
    delete (globalThis as { window?: unknown }).window;

    const result = collectMetadata('test-session', 'server', 'user-123', 5);

    expect(result.environment).toBe('server');
    expect(result.browser).toBe('unknown');
    expect(result.timezone).toBe('');
    expect(result.sessionId).toBe('test-session');
    expect(result.userId).toBe('user-123');
    expect(result.logCount).toBe(5);
    expect(result.timestamp).toBeDefined();
    expect(result.screenResolution).toBe('0x0');
    expect(result.viewport).toBe('0x0');
    expect(result.userAgent).toBe('');
    expect(result.language).toBe('');
    expect(result.url).toBe('');
    expect(result.referrer).toBe('');
    expect(result.platform).toBe('');
    expect(result.errorCount).toBe(0);
    expect(result.networkErrorCount).toBe(0);

    // Restore window
    globalThis.window = originalWindow;
  });

  it('should return full metadata in browser environment', () => {
    // Mock browser environment
    vi.stubGlobal('window', {
      screen: { width: 1920, height: 1080 },
      innerWidth: 1280,
      innerHeight: 720,
      devicePixelRatio: 2,
      location: { href: 'https://example.com/page' },
    });
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      platform: 'MacIntel',
      language: 'en-US',
    });
    vi.stubGlobal('document', {
      referrer: 'https://google.com',
    });
    vi.stubGlobal('Intl', {
      DateTimeFormat: vi.fn().mockReturnValue({
        resolvedOptions: () => ({
          timeZone: 'America/New_York',
        }),
      }),
    });

    const result = collectMetadata('test-session', 'browser', 'user-123', 10);

    expect(result.environment).toBe('browser');
    expect(result.browser).toBe('chrome');
    expect(result.timezone).toBe('America/New_York');
    expect(result.sessionId).toBe('test-session');
    expect(result.userId).toBe('user-123');
    expect(result.logCount).toBe(10);
    expect(result.timestamp).toBeDefined();
    expect(result.screenResolution).toBe('1920x1080');
    expect(result.viewport).toBe('1280x720');
    expect(result.userAgent).toBe(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    expect(result.platform).toBe('MacIntel');
    expect(result.language).toBe('en-US');
    expect(result.url).toBe('https://example.com/page');
    expect(result.referrer).toBe('https://google.com');
    expect(result.errorCount).toBe(0);
    expect(result.networkErrorCount).toBe(0);
  });

  it('should handle missing screen gracefully', () => {
    vi.stubGlobal('window', {
      screen: undefined,
      innerWidth: 1280,
      innerHeight: 720,
      location: { href: '' },
    });
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      platform: 'MacIntel',
      language: 'en',
    });
    vi.stubGlobal('document', {
      referrer: '',
    });
    vi.stubGlobal('Intl', {
      DateTimeFormat: vi.fn().mockReturnValue({
        resolvedOptions: () => ({
          timeZone: 'UTC',
        }),
      }),
    });

    const result = collectMetadata('test-session', 'browser', 'user-123', 0);

    expect(result.screenResolution).toBe('0x0');
  });

  it('should handle Safari browser', () => {
    vi.stubGlobal('window', {
      screen: { width: 1440, height: 900 },
      innerWidth: 1440,
      innerHeight: 900,
      location: { href: '' },
    });
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      platform: 'MacIntel',
      language: 'en-GB',
    });
    vi.stubGlobal('document', {
      referrer: '',
    });
    vi.stubGlobal('Intl', {
      DateTimeFormat: vi.fn().mockReturnValue({
        resolvedOptions: () => ({
          timeZone: 'Europe/London',
        }),
      }),
    });

    const result = collectMetadata('safari-session', 'browser', 'user-456', 3);

    expect(result.browser).toBe('safari');
    expect(result.timezone).toBe('Europe/London');
    expect(result.language).toBe('en-GB');
  });

  it('should handle Firefox browser', () => {
    vi.stubGlobal('window', {
      screen: { width: 1920, height: 1080 },
      innerWidth: 1920,
      innerHeight: 1080,
      location: { href: '' },
    });
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
      platform: 'MacIntel',
      language: 'en-US',
    });
    vi.stubGlobal('document', {
      referrer: '',
    });
    vi.stubGlobal('Intl', {
      DateTimeFormat: vi.fn().mockReturnValue({
        resolvedOptions: () => ({
          timeZone: 'America/Los_Angeles',
        }),
      }),
    });

    const result = collectMetadata('firefox-session', 'browser', 'user-789', 7);

    expect(result.browser).toBe('firefox');
  });

  it('should handle null userId', () => {
    vi.stubGlobal('window', {
      screen: { width: 1920, height: 1080 },
      innerWidth: 1280,
      innerHeight: 720,
      location: { href: '' },
    });
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      platform: 'MacIntel',
      language: 'en-US',
    });
    vi.stubGlobal('document', {
      referrer: '',
    });
    vi.stubGlobal('Intl', {
      DateTimeFormat: vi.fn().mockReturnValue({
        resolvedOptions: () => ({
          timeZone: 'UTC',
        }),
      }),
    });

    const result = collectMetadata('session-no-user', 'browser', null, 0);

    expect(result.userId).toBeNull();
  });

  it('should include all required LogMetadata fields', () => {
    vi.stubGlobal('window', {
      screen: { width: 1920, height: 1080 },
      innerWidth: 1280,
      innerHeight: 720,
      location: { href: '' },
    });
    vi.stubGlobal('navigator', {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      platform: 'MacIntel',
      language: 'en-US',
    });
    vi.stubGlobal('document', {
      referrer: '',
    });
    vi.stubGlobal('Intl', {
      DateTimeFormat: vi.fn().mockReturnValue({
        resolvedOptions: () => ({
          timeZone: 'UTC',
        }),
      }),
    });

    const result = collectMetadata('full-session', 'browser', 'user-full', 42);

    // Verify all required fields are present
    expect(result).toHaveProperty('environment');
    expect(result).toHaveProperty('browser');
    expect(result).toHaveProperty('timezone');
    expect(result).toHaveProperty('sessionId');
    expect(result).toHaveProperty('userId');
    expect(result).toHaveProperty('logCount');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('screenResolution');
    expect(result).toHaveProperty('viewport');
    expect(result).toHaveProperty('userAgent');
    expect(result).toHaveProperty('platform');
    expect(result).toHaveProperty('language');
    expect(result).toHaveProperty('url');
    expect(result).toHaveProperty('referrer');
    expect(result).toHaveProperty('errorCount');
    expect(result).toHaveProperty('networkErrorCount');
  });
});
