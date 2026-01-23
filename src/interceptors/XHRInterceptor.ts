interface XHRRequestConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: unknown;
  startTime: number;
  requestId: string;
}

export class XHRInterceptor {
  private originalXHR: typeof XMLHttpRequest;
  private onRequest: ((config: XHRRequestConfig) => void)[];
  private onResponse: ((config: XHRRequestConfig, status: number, duration: number) => void)[];
  private onError: ((config: XHRRequestConfig, error: Error) => void)[];
  private requestTracker: WeakMap<XMLHttpRequest, XHRRequestConfig>;
  private excludeUrls: RegExp[];
  private originalOpen: (
    method: string,
    url: string | URL,
    async?: boolean,
    user?: string | null,
    password?: string | null
  ) => void;
  private originalSend: (body?: Document | XMLHttpRequestBodyInit | null) => void;
  private isAttached: boolean = false;
  private requestIdCounter: number = 0;

  private generateRequestId(): string {
    return `xhr_${++this.requestIdCounter}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  constructor(options: { excludeUrls?: string[] } = {}) {
    this.originalXHR = window.XMLHttpRequest;
    this.onRequest = [];
    this.onResponse = [];
    this.onError = [];
    this.requestTracker = new WeakMap();
    this.excludeUrls = (options.excludeUrls || []).map((url) => new RegExp(url));
    this.originalOpen = this.originalXHR.prototype.open;
    this.originalSend = this.originalXHR.prototype.send;
  }

  attach(): void {
    if (this.isAttached) return;
    this.isAttached = true;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const interceptor = this;

    this.originalXHR.prototype.open = function (
      this: XMLHttpRequest,
      method: string,
      url: string | URL,
      async?: boolean,
      user?: string | null,
      password?: string | null
    ) {
      const urlString = typeof url === 'string' ? url : url.href;

      interceptor.requestTracker.set(this, {
        method,
        url: urlString,
        headers: {},
        body: null,
        startTime: Date.now(),
        requestId: interceptor.generateRequestId(),
      });

      if (interceptor.excludeUrls.some((regex) => regex.test(urlString))) {
        return interceptor.originalOpen.call(this, method, url, async ?? true, user, password);
      }

      const config = interceptor.requestTracker.get(this)!;
      for (const cb of interceptor.onRequest) {
        cb(config);
      }

      return interceptor.originalOpen.call(this, method, url, async ?? true, user, password);
    };

    this.originalXHR.prototype.send = function (
      this: XMLHttpRequest,
      body?: Document | XMLHttpRequestBodyInit | null
    ) {
      const config = interceptor.requestTracker.get(this);
      if (config) {
        config.body = body;

        const originalOnLoad = this.onload;
        const originalOnError = this.onerror;

        this.onload = function (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) {
          const duration = Date.now() - config.startTime;
          for (const cb of interceptor.onResponse) {
            cb(config, this.status, duration);
          }
          if (originalOnLoad) {
            originalOnLoad.call(this, ev);
          }
        };

        this.onerror = function (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) {
          for (const cb of interceptor.onError) {
            cb(config, new Error('XHR Error'));
          }
          if (originalOnError) {
            originalOnError.call(this, ev);
          }
        };
      }

      return interceptor.originalSend.call(this, body);
    };
  }

  detach(): void {
    if (!this.isAttached) return;
    this.isAttached = false;
    this.originalXHR.prototype.open = this.originalOpen;
    this.originalXHR.prototype.send = this.originalSend;
  }

  onXHRRequest(callback: (config: XHRRequestConfig) => void): void {
    this.onRequest.push(callback);
  }

  removeXHRRequest(callback: (config: XHRRequestConfig) => void): void {
    const index = this.onRequest.indexOf(callback);
    if (index > -1) this.onRequest.splice(index, 1);
  }

  onXHRResponse(
    callback: (config: XHRRequestConfig, status: number, duration: number) => void
  ): void {
    this.onResponse.push(callback);
  }

  removeXHRResponse(
    callback: (config: XHRRequestConfig, status: number, duration: number) => void
  ): void {
    const index = this.onResponse.indexOf(callback);
    if (index > -1) this.onResponse.splice(index, 1);
  }

  onXHRError(callback: (config: XHRRequestConfig, error: Error) => void): void {
    this.onError.push(callback);
  }

  removeXHRError(callback: (config: XHRRequestConfig, error: Error) => void): void {
    const index = this.onError.indexOf(callback);
    if (index > -1) this.onError.splice(index, 1);
  }
}
