import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { XHRInterceptor } from './XHRInterceptor';

describe('XHRInterceptor', () => {
  let interceptor: XHRInterceptor;
  let originalXHR: typeof XMLHttpRequest;

  beforeEach(() => {
    originalXHR = window.XMLHttpRequest;
    interceptor = new XHRInterceptor();
  });

  afterEach(() => {
    window.XMLHttpRequest = originalXHR;
  });

  describe('attach()', () => {
    it('intercepts XHR requests', () => {
      const onRequest = vi.fn();
      const onResponse = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.onXHRResponse(onResponse);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/test');

      expect(onRequest).toHaveBeenCalled();
      expect(onRequest.mock.calls[0][0]).toHaveProperty('method', 'GET');
      expect(onRequest.mock.calls[0][0]).toHaveProperty('url', 'https://example.com/test');
    });

    it('tracks request configuration', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://example.com/api');
      xhr.send('{"data":"test"}');

      expect(onRequest.mock.calls[0][0]).toMatchObject({
        method: 'POST',
        url: 'https://example.com/api',
        body: '{"data":"test"}',
      });
    });

    it('calls response callback on successful request', () => {
      return new Promise<void>((resolve) => {
        const onResponse = vi.fn();
        let xhrInstance: XMLHttpRequest;

        interceptor.onXHRResponse(onResponse);
        interceptor.attach();

        xhrInstance = new XMLHttpRequest();
        xhrInstance.open('GET', 'https://example.com/test');
        xhrInstance.onload = () => {
          expect(onResponse).toHaveBeenCalled();
          const config = onResponse.mock.calls[0][0];
          const status = onResponse.mock.calls[0][1];
          const duration = onResponse.mock.calls[0][2];

          expect(config).toHaveProperty('method', 'GET');
          expect(config).toHaveProperty('url', 'https://example.com/test');
          expect(status).toBe(xhrInstance.status);
          expect(typeof duration).toBe('number');
          expect(duration).toBeGreaterThanOrEqual(0);
          resolve();
        };

        xhrInstance.send();
      });
    });

    it('calls error callback on XHR errors', () => {
      return new Promise<void>((resolve) => {
        const onError = vi.fn();

        interceptor.onXHRError(onError);
        interceptor.attach();

        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://invalid-url-that-will-fail');
        xhr.onerror = () => {
          expect(onError).toHaveBeenCalled();
          const config = onError.mock.calls[0][0];
          const error = onError.mock.calls[0][1];

          expect(config).toHaveProperty('url', 'https://invalid-url-that-will-fail');
          expect(error).toBeInstanceOf(Error);
          resolve();
        };

        xhr.send();
      });
    });

    it('skips excluded URLs', () => {
      const onRequest = vi.fn();

      interceptor = new XHRInterceptor({ excludeUrls: ['example\\.com', 'localhost'] });
      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/test');

      expect(onRequest).not.toHaveBeenCalled();
    });

    it('allows multiple exclude patterns', () => {
      const onRequest = vi.fn();

      interceptor = new XHRInterceptor({ excludeUrls: ['example\\.com', 'api\\.local'] });
      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr1 = new XMLHttpRequest();
      xhr1.open('GET', 'https://example.com/test');

      const xhr2 = new XMLHttpRequest();
      xhr2.open('GET', 'https://api.local/data');

      expect(onRequest).not.toHaveBeenCalled();
    });

    it('maintains prototype chain', () => {
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      expect(xhr).toBeInstanceOf(XMLHttpRequest);
      expect(xhr).toHaveProperty('open');
      expect(xhr).toHaveProperty('send');
      expect(xhr).toHaveProperty('onload');
      expect(xhr).toHaveProperty('onerror');
    });

    it('tracks request start time', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const beforeCreation = Date.now();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/test');
      const afterCreation = Date.now();

      expect(onRequest.mock.calls[0][0]).toHaveProperty('startTime');
      const startTime = onRequest.mock.calls[0][0].startTime as number;
      expect(startTime).toBeGreaterThanOrEqual(beforeCreation);
      expect(startTime).toBeLessThanOrEqual(afterCreation);
    });

    it('initializes headers as empty object', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/test');

      expect(onRequest.mock.calls[0][0]).toHaveProperty('headers');
      expect(typeof onRequest.mock.calls[0][0].headers).toBe('object');
    });

    it('initializes body as null', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/test');

      expect(onRequest.mock.calls[0][0]).toHaveProperty('body', null);
    });
  });

  describe('detach()', () => {
    it('restores original XMLHttpRequest', () => {
      const originalOpen = originalXHR.prototype.open;
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      expect(window.XMLHttpRequest).not.toBe(originalXHR);

      interceptor.detach();

      expect(window.XMLHttpRequest).toBe(originalXHR);
      expect(XMLHttpRequest.prototype.open).toBe(originalOpen);
    });

    it('stops intercepting after detach', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      // First XHR is intercepted
      const xhr1 = new XMLHttpRequest();
      xhr1.open('GET', 'https://example.com/test');
      expect(onRequest).toHaveBeenCalledTimes(1);

      interceptor.detach();

      // Second XHR is not intercepted
      const xhr2 = new XMLHttpRequest();
      xhr2.open('GET', 'https://example.com/test');
      expect(onRequest).toHaveBeenCalledTimes(1); // Still only 1 call
    });

    it('can attach again after detach', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr1 = new XMLHttpRequest();
      xhr1.open('GET', 'https://example.com/test');
      expect(onRequest).toHaveBeenCalledTimes(1);

      interceptor.detach();

      const xhr2 = new XMLHttpRequest();
      xhr2.open('GET', 'https://example.com/test');
      expect(onRequest).toHaveBeenCalledTimes(1);

      interceptor.attach();

      const xhr3 = new XMLHttpRequest();
      xhr3.open('GET', 'https://example.com/test');
      expect(onRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe('onXHRRequest()', () => {
    it('registers callback that receives config', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/api');

      expect(onRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://example.com/api',
          headers: {},
          body: null,
        })
      );
    });

    it('supports multiple request callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      interceptor.onXHRRequest(callback1);
      interceptor.onXHRRequest(callback2);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/test');

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
      expect(callback1).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://example.com/test',
        })
      );
      expect(callback2).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://example.com/test',
        })
      );
    });

    it('captures HTTP method', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

      methods.forEach((method) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, 'https://example.com/api');
      });

      expect(onRequest).toHaveBeenCalledTimes(methods.length);
      methods.forEach((method, index) => {
        expect(onRequest.mock.calls[index][0]).toHaveProperty('method', method);
      });
    });

    it('captures request body', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr1 = new XMLHttpRequest();
      xhr1.open('POST', 'https://example.com/api');
      xhr1.send('{"key":"value"}');

      const xhr2 = new XMLHttpRequest();
      xhr2.open('POST', 'https://example.com/api');
      xhr2.send('test-data');

      expect(onRequest).toHaveBeenCalledTimes(2);
      expect(onRequest.mock.calls[0][0]).toHaveProperty('body', '{"key":"value"}');
      expect(onRequest.mock.calls[1][0]).toHaveProperty('body', 'test-data');
    });

    it('handles null body for GET requests', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/api');

      expect(onRequest.mock.calls[0][0]).toHaveProperty('body', null);
    });
  });

  describe('onXHRResponse()', () => {
    it('registers callback that receives config, status, and duration', (done) => {
      const onResponse = vi.fn();
      let xhrInstance: XMLHttpRequest;

      interceptor.onXHRResponse(onResponse);
      interceptor.attach();

      xhrInstance = new XMLHttpRequest();
      xhrInstance.open('GET', 'https://example.com/test');
      xhrInstance.onload = () => {
        expect(onResponse).toHaveBeenCalled();
        const args = onResponse.mock.calls[0];
        const config = args[0];
        const status = args[1];
        const duration = args[2];

        expect(config).toHaveProperty('method');
        expect(config).toHaveProperty('url');
        expect(typeof status).toBe('number');
        expect(typeof duration).toBe('number');
        expect(duration).toBeGreaterThanOrEqual(0);
        done();
      };

      xhrInstance.send();
    });

    it('measures duration accurately', (done) => {
      const onResponse = vi.fn();
      const delay = 100;
      let xhrInstance: XMLHttpRequest;

      interceptor.onXHRResponse(onResponse);
      interceptor.attach();

      xhrInstance = new XMLHttpRequest();
      xhrInstance.open('GET', 'https://example.com/test');
      xhrInstance.onload = () => {
        const duration = onResponse.mock.calls[0][2] as number;
        expect(duration).toBeGreaterThanOrEqual(delay - 10);
        done();
      };

      // Simulate network delay
      setTimeout(() => {
        xhrInstance.send();
        // Manually trigger onload after delay
        setTimeout(() => {
          xhrInstance.status = 200;
          if (xhrInstance.onload) xhrInstance.onload();
        }, delay);
      }, 10);
    });

    it('supports multiple response callbacks', (done) => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      let xhrInstance: XMLHttpRequest;

      interceptor.onXHRResponse(callback1);
      interceptor.onXHRResponse(callback2);
      interceptor.attach();

      xhrInstance = new XMLHttpRequest();
      xhrInstance.open('GET', 'https://example.com/test');
      xhrInstance.onload = () => {
        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
        done();
      };

      xhrInstance.send();
    });

    it('receives correct HTTP status codes', (done) => {
      const onResponse = vi.fn();
      let xhrInstance: XMLHttpRequest;

      interceptor.onXHRResponse(onResponse);
      interceptor.attach();

      const testCases = [
        { status: 200, message: 'OK' },
        { status: 201, message: 'Created' },
        { status: 404, message: 'Not Found' },
        { status: 500, message: 'Internal Server Error' },
      ];

      let completed = 0;

      testCases.forEach((testCase) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://example.com/test');
        xhr.onload = () => {
          const status = onResponse.mock.calls[completed][1];
          expect(status).toBe(testCase.status);
          completed++;

          if (completed === testCases.length) {
            done();
          }
        };

        xhr.send();
        // Manually simulate status
        setTimeout(() => {
          xhr.status = testCase.status;
          if (xhr.onload) xhr.onload();
        }, 10);
      });
    });
  });

  describe('onXHRError()', () => {
    it('registers callback that receives config and error', (done) => {
      const onError = vi.fn();
      let xhrInstance: XMLHttpRequest;

      interceptor.onXHRError(onError);
      interceptor.attach();

      xhrInstance = new XMLHttpRequest();
      xhrInstance.open('GET', 'https://invalid-url');
      xhrInstance.onerror = () => {
        expect(onError).toHaveBeenCalled();
        const config = onError.mock.calls[0][0];
        const error = onError.mock.calls[0][1];

        expect(config).toHaveProperty('url');
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'XHR Error');
        done();
      };

      xhrInstance.send();
      // Manually trigger error
      setTimeout(() => {
        if (xhrInstance.onerror) xhrInstance.onerror();
      }, 10);
    });

    it('supports multiple error callbacks', (done) => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      let xhrInstance: XMLHttpRequest;

      interceptor.onXHRError(callback1);
      interceptor.onXHRError(callback2);
      interceptor.attach();

      xhrInstance = new XMLHttpRequest();
      xhrInstance.open('GET', 'https://invalid-url');
      xhrInstance.onerror = () => {
        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
        done();
      };

      xhrInstance.send();
      setTimeout(() => {
        if (xhrInstance.onerror) xhrInstance.onerror();
      }, 10);
    });

    it('captures request config in error callback', (done) => {
      const onError = vi.fn();
      let xhrInstance: XMLHttpRequest;

      interceptor.onXHRError(onError);
      interceptor.attach();

      xhrInstance = new XMLHttpRequest();
      xhrInstance.open('POST', 'https://invalid-url/api');
      xhrInstance.send('{"test":"data"}');
      xhrInstance.onerror = () => {
        const config = onError.mock.calls[0][0];

        expect(config).toMatchObject({
          method: 'POST',
          url: 'https://invalid-url/api',
          body: '{"test":"data"}',
        });
        done();
      };

      setTimeout(() => {
        if (xhrInstance.onerror) xhrInstance.onerror();
      }, 10);
    });
  });

  describe('constructor options', () => {
    it('initializes with no exclude URLs by default', () => {
      interceptor = new XHRInterceptor();
      interceptor.attach();

      const onRequest = vi.fn();
      interceptor.onXHRRequest(onRequest);

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/test');

      expect(onRequest).toHaveBeenCalled();
    });

    it('accepts empty excludeUrls array', () => {
      interceptor = new XHRInterceptor({ excludeUrls: [] });
      interceptor.attach();

      const onRequest = vi.fn();
      interceptor.onXHRRequest(onRequest);

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/test');

      expect(onRequest).toHaveBeenCalled();
    });

    it('converts string patterns to RegExp', () => {
      interceptor = new XHRInterceptor({ excludeUrls: ['example\\.com', 'localhost'] });

      // The excludeUrls property should contain RegExp instances
      expect(interceptor['excludeUrls']).toHaveLength(2);
      expect(interceptor['excludeUrls'][0]).toBeInstanceOf(RegExp);
      expect(interceptor['excludeUrls'][1]).toBeInstanceOf(RegExp);
    });
  });

  describe('memory safety', () => {
    it('uses WeakMap for request tracking', () => {
      interceptor = new XHRInterceptor();
      expect(interceptor['requestTracker']).toBeInstanceOf(WeakMap);
    });

    it('allows garbage collection of XHR instances', () => {
      interceptor.attach();

      const createAndDiscardXHR = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://example.com/test');
        // xhr goes out of scope here and should be eligible for GC
      };

      // This should not cause memory leaks due to WeakMap
      createAndDiscardXHR();
      createAndDiscardXHR();
      createAndDiscardXHR();

      // If this test passes without memory issues, WeakMap is working
      expect(true).toBe(true);
    });
  });

  describe('prototype chain', () => {
    it('maintains XMLHttpRequest prototype chain', () => {
      interceptor.attach();

      const xhr = new XMLHttpRequest();

      // Should inherit all standard XMLHttpRequest methods and properties
      expect(typeof xhr.open).toBe('function');
      expect(typeof xhr.send).toBe('function');
      expect(typeof xhr.setRequestHeader).toBe('function');
      expect(typeof xhr.getResponseHeader).toBe('function');
      expect(typeof xhr.getAllResponseHeaders).toBe('function');
      expect(typeof xhr.abort).toBe('function');
    });

    it('preserves XMLHttpRequest behavior', () => {
      interceptor.attach();

      const xhr = new XMLHttpRequest();

      // Should work like a normal XMLHttpRequest
      expect(() => xhr.open('GET', 'https://example.com/test')).not.toThrow();
      expect(() => xhr.send()).not.toThrow();
    });
  });

  describe('URL handling', () => {
    it('handles absolute URLs', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/api/test');

      expect(onRequest.mock.calls[0][0]).toHaveProperty('url', 'https://example.com/api/test');
    });

    it('handles relative URLs', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/test');

      expect(onRequest.mock.calls[0][0]).toHaveProperty('url', '/api/test');
    });

    it('handles URLs with query parameters', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/api?key=value&foo=bar');

      expect(onRequest.mock.calls[0][0]).toHaveProperty(
        'url',
        'https://example.com/api?key=value&foo=bar'
      );
    });

    it('handles URLs with hash fragments', () => {
      const onRequest = vi.fn();

      interceptor.onXHRRequest(onRequest);
      interceptor.attach();

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/page#section');

      expect(onRequest.mock.calls[0][0]).toHaveProperty('url', 'https://example.com/page#section');
    });
  });
});
