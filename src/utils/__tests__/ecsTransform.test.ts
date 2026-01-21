import { describe, it, expect } from 'vitest';
import { transformToECS, transformMetadataToECS, filterStackTrace } from '../ecsTransform';
import type { LogEntry, LogMetadata } from '../../types';

describe('ECS Transform', () => {
  describe('transformToECS', () => {
    const baseMetadata: LogMetadata = {
      sessionId: 'test-session-123',
      userId: 'user-456',
      environment: 'development',
      url: 'https://example.com',
      browser: 'Chrome',
      platform: 'MacIntel',
      screenResolution: '1920x1080',
      timezone: 'America/New_York',
      logCount: 0,
      errorCount: 0,
      networkErrorCount: 0,
      timestamp: '2026-01-20T10:00:00.000Z',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      language: 'en-US',
      viewport: '1920x1080',
      referrer: '',
    };

    it('transforms CONSOLE INFO log', () => {
      const log: LogEntry = {
        type: 'CONSOLE',
        level: 'log',
        time: '2026-01-20T10:00:00.000Z',
        data: 'Test message',
      };
      const ecs = transformToECS(log, baseMetadata);

      expect(ecs['@timestamp']).toBe('2026-01-20T10:00:00.000Z');
      expect(ecs.log?.level).toBe('info');
      expect(ecs.message).toBe('Test message');
      expect(ecs.event.category).toContain('console');
      expect(ecs.event.original).toEqual(log);
    });

    it('transforms CONSOLE WARN log', () => {
      const log: LogEntry = {
        type: 'CONSOLE',
        level: 'warn',
        time: '2026-01-20T10:01:00.000Z',
        data: 'Warning message',
      };
      const ecs = transformToECS(log, baseMetadata);
      expect(ecs.log?.level).toBe('warn');
    });

    it('transforms CONSOLE ERROR log', () => {
      const log: LogEntry = {
        type: 'CONSOLE',
        level: 'error',
        time: '2026-01-20T10:02:00.000Z',
        data: 'Error message',
      };
      const ecs = transformToECS(log, baseMetadata);
      expect(ecs.log?.level).toBe('error');
      expect(ecs.event.category).toContain('console');
    });

    it('transforms FETCH_REQ log', () => {
      const log: LogEntry = {
        type: 'FETCH_REQ',
        id: 'req-1',
        url: 'https://api.example.com/users',
        method: 'GET',
        headers: {},
        body: null,
        time: '2026-01-20T10:03:00.000Z',
      };
      const ecs = transformToECS(log, baseMetadata);

      expect(ecs.http?.request?.method).toBe('GET');
      expect(ecs.url?.full).toBe('https://api.example.com/users');
      expect(ecs.event.action).toBe('request');
      expect(ecs.event.category).toContain('network');
      expect(ecs.event.category).toContain('web');
      expect(ecs.event.id).toBe('req-1');
    });

    it('transforms FETCH_RES log', () => {
      const log: LogEntry = {
        type: 'FETCH_RES',
        id: 'req-1',
        url: 'https://api.example.com/users',
        status: 200,
        statusText: 'OK',
        duration: '500',
        body: null,
        time: '2026-01-20T10:03:50.000Z',
      };
      const ecs = transformToECS(log, baseMetadata);

      expect(ecs.http?.response?.status_code).toBe(200);
      expect(ecs.event.duration).toBe(500000000);
      expect(ecs.event.action).toBe('response');
      expect(ecs.event.id).toBe('req-1');
    });

    it('transforms FETCH_ERR log', () => {
      const log: LogEntry = {
        type: 'FETCH_ERR',
        id: 'req-2',
        url: 'https://api.example.com/users',
        error: 'Failed to fetch',
        duration: '100',
        time: '2026-01-20T10:04:00.000Z',
      };
      const ecs = transformToECS(log, baseMetadata);

      expect(ecs.error?.message).toBe('Failed to fetch');
      expect(ecs.event.action).toBe('error');
      expect(ecs.event.id).toBe('req-2');
      expect(ecs.event.duration).toBe(100000000);
    });

    it('transforms FETCH_ERR with stack trace', () => {
      const log: LogEntry = {
        type: 'FETCH_ERR',
        id: 'req-3',
        url: 'https://api.example.com/fail',
        error: 'Network error',
        duration: '200',
        time: '2026-01-20T10:05:00.000Z',
      };
      const logWithBody = log as LogEntry & { body: { frames: unknown[] } };
      logWithBody.body = {
        frames: [
          {
            filename: 'src/App.tsx',
            functionName: 'fetchData',
            lineNumber: 10,
            columnNumber: 5,
            ignored: false,
          },
          {
            filename: 'node_modules/react/index.js',
            functionName: 'dispatchAction',
            lineNumber: 100,
            columnNumber: 10,
            ignored: true,
          },
        ],
      };

      const ecs = transformToECS(logWithBody, baseMetadata);

      expect(ecs.error?.stack_trace).toBeDefined();
      expect(ecs.error?.stack_trace).toContain('fetchData');
      expect(ecs.error?.stack_trace).not.toContain('dispatchAction');
    });

    it('transforms XHR_REQ log', () => {
      const log: LogEntry = {
        type: 'XHR_REQ',
        id: 'xhr-1',
        url: 'https://api.example.com/data',
        method: 'POST',
        headers: {},
        body: { key: 'value' },
        time: '2026-01-20T10:06:00.000Z',
      };
      const ecs = transformToECS(log, baseMetadata);

      expect(ecs.http?.request?.method).toBe('POST');
      expect(ecs.url?.full).toBe('https://api.example.com/data');
      expect(ecs.event.action).toBe('request');
      expect(ecs.event.id).toBe('xhr-1');
    });

    it('transforms XHR_RES log', () => {
      const log: LogEntry = {
        type: 'XHR_RES',
        id: 'xhr-1',
        url: 'https://api.example.com/data',
        status: 201,
        statusText: 'Created',
        duration: '300',
        body: { id: 123 },
        time: '2026-01-20T10:06:30.000Z',
      };
      const ecs = transformToECS(log, baseMetadata);

      expect(ecs.http?.response?.status_code).toBe(201);
      expect(ecs.event.duration).toBe(300000000);
      expect(ecs.event.action).toBe('response');
    });

    it('transforms XHR_ERR log', () => {
      const log: LogEntry = {
        type: 'XHR_ERR',
        id: 'xhr-2',
        url: 'https://api.example.com/timeout',
        error: 'Request timeout',
        duration: '5000',
        time: '2026-01-20T10:07:00.000Z',
      };
      const ecs = transformToECS(log, baseMetadata);

      expect(ecs.error?.message).toBe('Request timeout');
      expect(ecs.event.action).toBe('error');
      expect(ecs.event.duration).toBe(5000000000);
    });
  });

  describe('transformMetadataToECS', () => {
    it('transforms basic metadata', () => {
      const metadata: LogMetadata = {
        sessionId: 'test-123',
        userId: 'user-456',
        environment: 'production',
        url: 'https://example.com',
        browser: 'Chrome',
        platform: 'MacIntel',
        screenResolution: '1920x1080',
        timezone: 'America/New_York',
        logCount: 10,
        errorCount: 5,
        networkErrorCount: 2,
        timestamp: '2026-01-20T10:00:00.000Z',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        language: 'en-US',
        viewport: '1920x1080',
        referrer: 'https://google.com',
      };
      const ecs = transformMetadataToECS(metadata);

      expect(ecs.service?.environment).toBe('production');
      expect(ecs.user?.id).toBe('user-456');
      expect(ecs.host?.name).toBe('Chrome');
      expect(ecs.host?.type).toBe('MacIntel');
    });

    it('handles null userId', () => {
      const metadata: LogMetadata = {
        sessionId: 'test-123',
        userId: null,
        environment: 'development',
        url: 'https://example.com',
        browser: 'Firefox',
        platform: 'Windows',
        screenResolution: '1920x1080',
        timezone: 'America/Los_Angeles',
        logCount: 0,
        errorCount: 0,
        networkErrorCount: 0,
        timestamp: '2026-01-20T10:00:00.000Z',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
        language: 'en-US',
        viewport: '1920x1080',
        referrer: '',
      };
      const ecs = transformMetadataToECS(metadata);

      expect(ecs.user).toBeUndefined();
      expect(ecs.service?.environment).toBe('development');
      expect(ecs.host?.name).toBe('Firefox');
    });
  });

  describe('filterStackTrace', () => {
    it('filters ignored frames', () => {
      const frames = [
        { filename: 'node_modules/react/index.js', ignored: true },
        { filename: 'src/App.tsx', ignored: false },
        { filename: 'node_modules/next/index.js', ignored: true },
      ];
      const result = filterStackTrace(frames);
      expect(result).toHaveLength(1);
      expect(result[0].filename).toBe('src/App.tsx');
    });

    it('limits to 20 frames', () => {
      const frames = Array.from({ length: 50 }, (_, i) => ({
        filename: `frame-${i}.js`,
        ignored: false,
      }));
      const result = filterStackTrace(frames);
      expect(result).toHaveLength(20);
    });

    it('handles empty frames', () => {
      expect(filterStackTrace([])).toEqual([]);
    });

    it('handles missing ignored field', () => {
      const frames = [{ filename: 'frame-1.js' }];
      const result = filterStackTrace(frames);
      expect(result).toHaveLength(1);
      expect(result[0].filename).toBe('frame-1.js');
    });

    it('preserves all non-ignored frame properties', () => {
      const frames = [
        {
          filename: 'src/utils.ts',
          functionName: 'helper',
          lineNumber: 42,
          columnNumber: 3,
          ignored: false,
        },
      ];
      const result = filterStackTrace(frames);
      expect(result[0].filename).toBe('src/utils.ts');
      expect(result[0].functionName).toBe('helper');
      expect(result[0].lineNumber).toBe(42);
      expect(result[0].columnNumber).toBe(3);
    });
  });
});
