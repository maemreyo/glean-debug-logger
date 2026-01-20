interface XHRRequestConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: unknown;
  startTime: number;
}

export class XHRInterceptor {
  private originalXHR: typeof XMLHttpRequest;
  private onRequest: ((config: XHRRequestConfig) => void)[];
  private onResponse: ((config: XHRRequestConfig, status: number, duration: number) => void)[];
  private onError: ((config: XHRRequestConfig, error: Error) => void)[];
  private requestTracker: WeakMap<XMLHttpRequest, XHRRequestConfig>;
  private excludeUrls: RegExp[];

  constructor(options: { excludeUrls?: string[] } = {}) {
    this.originalXHR = window.XMLHttpRequest;
    this.onRequest = [];
    this.onResponse = [];
    this.onError = [];
    this.requestTracker = new WeakMap();
    this.excludeUrls = (options.excludeUrls || []).map((url) => new RegExp(url));
  }

  attach(): void {
    const OriginalXHR = this.originalXHR;
    const interceptor = this;

    const MyXMLHttpRequest = function (this: XMLHttpRequest) {
      const xhr = new OriginalXHR();
      interceptor.requestTracker.set(xhr, {
        method: '',
        url: '',
        headers: {},
        body: null,
        startTime: Date.now(),
      });
      return xhr;
    } as unknown as typeof XMLHttpRequest;

    MyXMLHttpRequest.prototype = OriginalXHR.prototype;
    Object.setPrototypeOf(MyXMLHttpRequest.prototype, OriginalXHR.prototype);

    const originalOpen = OriginalXHR.prototype.open;
    MyXMLHttpRequest.prototype.open = function (method: string, url: string) {
      const config = interceptor.requestTracker.get(this);
      if (config) {
        config.method = method;
        config.url = url;

        if (interceptor.excludeUrls.some((regex) => regex.test(url))) {
          return originalOpen.apply(this, [method, url] as never);
        }

        for (const cb of interceptor.onRequest) {
          cb(config);
        }
      }
      return originalOpen.apply(this, [method, url] as never);
    };

    const originalSend = OriginalXHR.prototype.send;
    MyXMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
      const config = interceptor.requestTracker.get(this);
      if (config) {
        config.body = body;
        this.onload = () => {
          const duration = Date.now() - config.startTime;
          for (const cb of interceptor.onResponse) {
            cb(config, this.status, duration);
          }
        };
        this.onerror = () => {
          for (const cb of interceptor.onError) {
            cb(config, new Error('XHR Error'));
          }
        };
      }
      return originalSend.apply(this, [body] as never);
    };

    window.XMLHttpRequest = MyXMLHttpRequest;
  }

  detach(): void {
    window.XMLHttpRequest = this.originalXHR;
  }

  onXHRRequest(callback: (config: XHRRequestConfig) => void): void {
    this.onRequest.push(callback);
  }

  onXHRResponse(
    callback: (config: XHRRequestConfig, status: number, duration: number) => void
  ): void {
    this.onResponse.push(callback);
  }

  onXHRError(callback: (config: XHRRequestConfig, error: Error) => void): void {
    this.onError.push(callback);
  }
}
