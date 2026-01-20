import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NetworkInterceptor } from './NetworkInterceptor';

describe('NetworkInterceptor', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', window.fetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('attach()', () => {
    it('intercepts fetch calls', async () => {
      const onRequest = vi.fn();
      const onResponse = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test response', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchRequest(onRequest);
      interceptor.onFetchResponse(onResponse);
      interceptor.attach();

      await fetch('https://example.com/test');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).toBe('https://example.com/test');
      expect(onRequest).toHaveBeenCalledWith('https://example.com/test', {});
      expect(onResponse).toHaveBeenCalledWith('https://example.com/test', 200, expect.any(Number));
    });

    it('clones response for body reading', async () => {
      const onResponse = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test response', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchResponse(onResponse);
      interceptor.attach();

      const response = await fetch('https://example.com/test');

      const text = await response.text();
      expect(text).toBe('test response');
      expect(onResponse).toHaveBeenCalledWith('https://example.com/test', 200, expect.any(Number));
    });

    it('skips excluded URLs', async () => {
      const onRequest = vi.fn();
      const onResponse = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor({ excludeUrls: ['example\\.com', 'localhost'] });
      interceptor.onFetchRequest(onRequest);
      interceptor.onFetchResponse(onResponse);
      interceptor.attach();

      await fetch('https://example.com/test');

      expect(onRequest).not.toHaveBeenCalled();
      expect(onResponse).not.toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).toBe('https://example.com/test');
    });

    it('allows multiple exclude patterns', async () => {
      const onRequest = vi.fn();
      const onResponse = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor({ excludeUrls: ['example\\.com', 'api\\.local'] });
      interceptor.onFetchRequest(onRequest);
      interceptor.onFetchResponse(onResponse);
      interceptor.attach();

      await fetch('https://example.com/test');
      await fetch('https://api.local/data');

      expect(onRequest).not.toHaveBeenCalled();
      expect(onResponse).not.toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('calls error callback on fetch errors', async () => {
      const onRequest = vi.fn();
      const onResponse = vi.fn();
      const onError = vi.fn();
      const mockError = new Error('Network error');
      const mockFetch = vi.fn().mockRejectedValue(mockError);

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchRequest(onRequest);
      interceptor.onFetchResponse(onResponse);
      interceptor.onFetchError(onError);
      interceptor.attach();

      await expect(fetch('https://example.com/test')).rejects.toThrow('Network error');

      expect(onRequest).toHaveBeenCalledWith('https://example.com/test', {});
      expect(onResponse).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith('https://example.com/test', mockError);
    });

    it('preserves request options', async () => {
      const onRequest = vi.fn();
      const options: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"test":"data"}',
      };
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 201 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchRequest(onRequest);
      interceptor.attach();

      await fetch('https://example.com/api', options);

      expect(onRequest).toHaveBeenCalledWith('https://example.com/api', options);
      expect(mockFetch).toHaveBeenCalledWith('https://example.com/api', options);
    });
  });

  describe('detach()', () => {
    it('restores original fetch', () => {
      const onRequest = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchRequest(onRequest);
      interceptor.attach();

      expect(window.fetch).not.toBe(mockFetch);

      interceptor.detach();

      expect(typeof window.fetch).toBe('function');
    });

    it('stops intercepting after detach', async () => {
      const onRequest = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchRequest(onRequest);
      interceptor.attach();

      await fetch('https://example.com/test');
      expect(onRequest).toHaveBeenCalledTimes(1);

      interceptor.detach();

      await fetch('https://example.com/test');
      expect(onRequest).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('onFetchRequest()', () => {
    it('registers callback that receives URL and options', async () => {
      const onRequest = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchRequest(onRequest);
      interceptor.attach();

      await fetch('https://example.com/api', { method: 'POST' });

      expect(onRequest).toHaveBeenCalledWith('https://example.com/api', { method: 'POST' });
    });

    it('supports multiple request callbacks', async () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchRequest(callback1);
      interceptor.onFetchRequest(callback2);
      interceptor.attach();

      await fetch('https://example.com/test');

      expect(callback1).toHaveBeenCalledWith('https://example.com/test', {});
      expect(callback2).toHaveBeenCalledWith('https://example.com/test', {});
    });
  });

  describe('onFetchResponse()', () => {
    it('registers callback that receives URL, status, and duration', async () => {
      const onResponse = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchResponse(onResponse);
      interceptor.attach();

      await fetch('https://example.com/test');

      expect(onResponse).toHaveBeenCalledWith('https://example.com/test', 200, expect.any(Number));
      expect(typeof onResponse.mock.calls[0][2]).toBe('number');
      expect(onResponse.mock.calls[0][2]).toBeGreaterThanOrEqual(0);
    });

    it('measures duration accurately', async () => {
      const onResponse = vi.fn();
      let delay = 100;
      const mockFetch = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return new Response('test', { status: 200 });
      });

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchResponse(onResponse);
      interceptor.attach();

      await fetch('https://example.com/test');

      const duration = onResponse.mock.calls[0][2] as number;
      expect(duration).toBeGreaterThanOrEqual(delay - 10);
    });

    it('supports multiple response callbacks', async () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchResponse(callback1);
      interceptor.onFetchResponse(callback2);
      interceptor.attach();

      await fetch('https://example.com/test');

      expect(callback1).toHaveBeenCalledWith('https://example.com/test', 200, expect.any(Number));
      expect(callback2).toHaveBeenCalledWith('https://example.com/test', 200, expect.any(Number));
    });
  });

  describe('onFetchError()', () => {
    it('registers callback that receives URL and error', async () => {
      const onError = vi.fn();
      const mockError = new Error('Failed to fetch');
      const mockFetch = vi.fn().mockRejectedValue(mockError);

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchError(onError);
      interceptor.attach();

      await expect(fetch('https://example.com/test')).rejects.toThrow('Failed to fetch');

      expect(onError).toHaveBeenCalledWith('https://example.com/test', mockError);
    });

    it('supports multiple error callbacks', async () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const mockError = new Error('Network error');
      const mockFetch = vi.fn().mockRejectedValue(mockError);

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchError(callback1);
      interceptor.onFetchError(callback2);
      interceptor.attach();

      await expect(fetch('https://example.com/test')).rejects.toThrow('Network error');

      expect(callback1).toHaveBeenCalledWith('https://example.com/test', mockError);
      expect(callback2).toHaveBeenCalledWith('https://example.com/test', mockError);
    });
  });

  describe('constructor options', () => {
    it('initializes with no exclude URLs by default', async () => {
      const onRequest = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchRequest(onRequest);
      interceptor.attach();

      await fetch('https://example.com/test');

      expect(onRequest).toHaveBeenCalledWith('https://example.com/test', {});
    });

    it('accepts empty excludeUrls array', async () => {
      const onRequest = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor({ excludeUrls: [] });
      interceptor.onFetchRequest(onRequest);
      interceptor.attach();

      await fetch('https://example.com/test');

      expect(onRequest).toHaveBeenCalledWith('https://example.com/test', {});
    });
  });

  describe('URL handling', () => {
    it('handles URL objects', async () => {
      const onRequest = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchRequest(onRequest);
      interceptor.attach();

      const url = new URL('https://example.com/test');
      await fetch(url);

      expect(onRequest).toHaveBeenCalledWith('https://example.com/test', {});
    });

    it('handles relative URLs', async () => {
      const onRequest = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue(new Response('test', { status: 200 }));

      vi.stubGlobal('fetch', mockFetch);
      const interceptor = new NetworkInterceptor();
      interceptor.onFetchRequest(onRequest);
      interceptor.attach();

      await fetch('/api/test');

      expect(onRequest).toHaveBeenCalledWith('/api/test', {});
    });
  });
});
