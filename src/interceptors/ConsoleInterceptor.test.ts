import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConsoleInterceptor } from './ConsoleInterceptor';

describe('ConsoleInterceptor', () => {
  let interceptor: ConsoleInterceptor;
  let originalConsole: Pick<Console, 'log' | 'error' | 'warn' | 'info' | 'debug'>;

  beforeEach(() => {
    // Store original console before each test
    originalConsole = {
      log: console.log.bind(console),
      error: console.error.bind(console),
      warn: console.warn.bind(console),
      info: console.info.bind(console),
      debug: console.debug.bind(console),
    };

    interceptor = new ConsoleInterceptor();
  });

  afterEach(() => {
    // Detach interceptor and restore original console
    interceptor.detach();
  });

  describe('constructor', () => {
    it('should initialize with empty callbacks array', () => {
      expect((interceptor as any).callbacks).toEqual([]);
    });

    it('should store original console methods', () => {
      const storedOriginal = (interceptor as any).originalConsole;

      expect(storedOriginal.log).toBeDefined();
      expect(storedOriginal.error).toBeDefined();
      expect(storedOriginal.warn).toBeDefined();
      expect(storedOriginal.info).toBeDefined();
      expect(storedOriginal.debug).toBeDefined();
    });
  });

  describe('onLog', () => {
    it('should register a callback', () => {
      const callback = vi.fn();
      interceptor.onLog(callback);

      expect((interceptor as any).callbacks).toHaveLength(1);
      expect((interceptor as any).callbacks[0]).toBe(callback);
    });

    it('should register multiple callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      interceptor.onLog(callback1);
      interceptor.onLog(callback2);

      expect((interceptor as any).callbacks).toHaveLength(2);
    });
  });

  describe('attach', () => {
    it('should intercept console.log calls', () => {
      const callback = vi.fn();
      interceptor.onLog(callback);
      interceptor.attach();

      console.log('test message');

      expect(callback).toHaveBeenCalledWith('log', ['test message']);
    });

    it('should intercept console.error calls', () => {
      const callback = vi.fn();
      interceptor.onLog(callback);
      interceptor.attach();

      console.error('error message');

      expect(callback).toHaveBeenCalledWith('error', ['error message']);
    });

    it('should intercept console.warn calls', () => {
      const callback = vi.fn();
      interceptor.onLog(callback);
      interceptor.attach();

      console.warn('warning message');

      expect(callback).toHaveBeenCalledWith('warn', ['warning message']);
    });

    it('should intercept console.info calls', () => {
      const callback = vi.fn();
      interceptor.onLog(callback);
      interceptor.attach();

      console.info('info message');

      expect(callback).toHaveBeenCalledWith('info', ['info message']);
    });

    it('should intercept console.debug calls', () => {
      const callback = vi.fn();
      interceptor.onLog(callback);
      interceptor.attach();

      console.debug('debug message');

      expect(callback).toHaveBeenCalledWith('debug', ['debug message']);
    });

    it('should call all registered callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      interceptor.onLog(callback1);
      interceptor.onLog(callback2);
      interceptor.attach();

      console.log('test');

      expect(callback1).toHaveBeenCalledWith('log', ['test']);
      expect(callback2).toHaveBeenCalledWith('log', ['test']);
    });

    it('should pass multiple arguments to callbacks', () => {
      const callback = vi.fn();
      interceptor.onLog(callback);
      interceptor.attach();

      console.log('message', { data: 123 }, ['array']);

      expect(callback).toHaveBeenCalledWith('log', ['message', { data: 123 }, ['array']]);
    });
  });

  describe('detach', () => {
    it('should restore original console methods', () => {
      const callback = vi.fn();
      interceptor.onLog(callback);
      interceptor.attach();

      // Verify callback is called while attached
      console.log('test');
      expect(callback).toHaveBeenCalledTimes(1);

      // Detach and verify callback is no longer called
      interceptor.detach();
      callback.mockClear();

      console.log('test after detach');
      expect(callback).not.toHaveBeenCalled();
    });

    it('should allow re-attaching after detach', () => {
      const callback = vi.fn();
      interceptor.onLog(callback);
      interceptor.attach();

      console.log('test1');
      expect(callback).toHaveBeenCalledTimes(1);

      interceptor.detach();
      callback.mockClear();

      console.log('test2');
      expect(callback).not.toHaveBeenCalled();

      // Re-attach
      interceptor.attach();
      console.log('test3');
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should restore all console methods', () => {
      interceptor.attach();
      interceptor.detach();

      // Verify console methods still work (no errors thrown)
      expect(() => {
        console.log('log');
        console.error('error');
        console.warn('warn');
        console.info('info');
        console.debug('debug');
      }).not.toThrow();
    });
  });

  describe('integration tests', () => {
    it('should handle attach/detach cycles correctly', () => {
      const callback = vi.fn();
      interceptor.onLog(callback);

      // First attach
      interceptor.attach();
      console.log('test1');
      expect(callback).toHaveBeenCalledTimes(1);

      // Detach
      interceptor.detach();
      callback.mockClear();

      // Second attach
      interceptor.attach();
      console.log('test2');
      expect(callback).toHaveBeenCalledTimes(1);

      // Final detach
      interceptor.detach();
      callback.mockClear();

      console.log('test3');
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle multiple log levels in sequence', () => {
      const callback = vi.fn();
      interceptor.onLog(callback);
      interceptor.attach();

      console.log('log');
      console.error('error');
      console.warn('warn');
      console.info('info');
      console.debug('debug');

      expect(callback).toHaveBeenCalledTimes(5);
      expect(callback).toHaveBeenNthCalledWith(1, 'log', ['log']);
      expect(callback).toHaveBeenNthCalledWith(2, 'error', ['error']);
      expect(callback).toHaveBeenNthCalledWith(3, 'warn', ['warn']);
      expect(callback).toHaveBeenNthCalledWith(4, 'info', ['info']);
      expect(callback).toHaveBeenNthCalledWith(5, 'debug', ['debug']);
    });
  });
});
