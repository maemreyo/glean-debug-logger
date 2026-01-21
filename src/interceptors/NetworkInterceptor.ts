export class NetworkInterceptor {
  private originalFetch: typeof window.fetch;
  private onRequest: ((url: string, options: RequestInit) => void)[];
  private onResponse: ((url: string, status: number, duration: number) => void)[];
  private onError: ((url: string, error: Error) => void)[];
  private excludeUrls: RegExp[];

  constructor(options: { excludeUrls?: string[] } = {}) {
    this.originalFetch = window.fetch.bind(window);
    this.onRequest = [];
    this.onResponse = [];
    this.onError = [];
    this.excludeUrls = (options.excludeUrls || []).map((url) => new RegExp(url));
  }

  attach(): void {
    window.fetch = async (...args: [RequestInfo | URL, RequestInit?]) => {
      const [url, options] = args;
      const urlStr = url.toString();

      if (this.excludeUrls.some((regex) => regex.test(urlStr))) {
        return this.originalFetch(...args);
      }

      const startTime = Date.now();
      this.onRequest.forEach((cb) => cb(urlStr, options || {}));

      try {
        const response = await this.originalFetch(...args);
        const duration = Date.now() - startTime;

        this.onResponse.forEach((cb) => cb(urlStr, response.status, duration));
        return response;
      } catch (error) {
        this.onError.forEach((cb) => cb(urlStr, error as Error));
        throw error;
      }
    };
  }

  detach(): void {
    window.fetch = this.originalFetch;
  }

  onFetchRequest(callback: (url: string, options: RequestInit) => void): void {
    this.onRequest.push(callback);
  }

  onFetchResponse(callback: (url: string, status: number, duration: number) => void): void {
    this.onResponse.push(callback);
  }

  onFetchError(callback: (url: string, error: Error) => void): void {
    this.onError.push(callback);
  }
}
