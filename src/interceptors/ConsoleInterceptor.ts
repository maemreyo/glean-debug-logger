export class ConsoleInterceptor {
  private originalConsole: Record<string, (...args: unknown[]) => void>;
  private callbacks: ((level: string, args: unknown[]) => void)[];

  constructor() {
    this.originalConsole = {
      log: console.log.bind(console),
      error: console.error.bind(console),
      warn: console.warn.bind(console),
      info: console.info.bind(console),
      debug: console.debug.bind(console),
    };
    this.callbacks = [];
  }

  attach(): void {
    Object.keys(this.originalConsole).forEach((level) => {
      const original = this.originalConsole[level]!;
      (console as unknown as Record<string, (...args: unknown[]) => void>)[level] = (
        ...args: unknown[]
      ) => {
        this.callbacks.forEach((cb) => {
          cb(level, args);
        });
        original(...args);
      };
    });
  }

  detach(): void {
    Object.keys(this.originalConsole).forEach((level) => {
      (console as unknown as Record<string, (...args: unknown[]) => void>)[level] =
        this.originalConsole[level]!;
    });
  }

  onLog(callback: (level: string, args: unknown[]) => void): void {
    this.callbacks.push(callback);
  }

  removeLog(callback: (level: string, args: unknown[]) => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }
}
