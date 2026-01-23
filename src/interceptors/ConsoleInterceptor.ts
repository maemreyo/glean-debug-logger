// Singleton pattern - only one instance exists even with HMR module reloads
let singletonInstance: ConsoleInterceptor | null = null;

export class ConsoleInterceptor {
  private originalConsole!: {
    log: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
  };
  private callbacks: ((level: string, args: unknown[]) => void)[];
  private static instanceCount = 0;
  private instanceId: number;
  private isAttached: boolean = false;
  // Store reference to original log for debug output (avoids recursion)
  private originalLog: (...args: unknown[]) => void;

  constructor() {
    ConsoleInterceptor.instanceCount++;
    this.instanceId = ConsoleInterceptor.instanceCount;
    // Store original log before any patching
    this.originalLog = console.log.bind(console);

    // Initialize originalConsole first
    this.originalConsole = {
      log: console.log.bind(console),
      error: console.error.bind(console),
      warn: console.warn.bind(console),
      info: console.info.bind(console),
      debug: console.debug.bind(console),
    };
    this.callbacks = [];

    // Singleton: if instance already exists, return it instead of creating new one
    if (singletonInstance) {
      this.originalLog(
        `[ConsoleInterceptor#${this.instanceId}] ⚠️  Singleton violation - returning existing instance #${singletonInstance.instanceId}`
      );
      // Don't copy callbacks - just return early and let the singleton handle everything
      return;
    }

    singletonInstance = this;
    this.originalLog(
      `[ConsoleInterceptor#${this.instanceId}] ✅ Created singleton instance (total: ${ConsoleInterceptor.instanceCount})`
    );
  }

  private debugLog(...args: unknown[]): void {
    // Always use stored original to avoid recursion
    this.originalLog(...args);
  }

  attach(): void {
    this.debugLog(
      `[ConsoleInterceptor#${this.instanceId}] attach() - isAttached=${this.isAttached}, callbacks=${this.callbacks.length}`
    );
    if (this.isAttached) {
      this.debugLog(
        `[ConsoleInterceptor#${this.instanceId}] ALREADY ATTACHED - skipping duplicate attach`
      );
      return;
    }
    this.isAttached = true;
    const levels: (keyof typeof this.originalConsole)[] = ['log', 'error', 'warn', 'info', 'debug'];
    levels.forEach((level) => {
      const original = this.originalConsole[level];
      (console as unknown as Record<string, (...args: unknown[]) => void>)[level] = (
        ...args: unknown[]
      ) => {
        this.debugLog(
          `[ConsoleInterceptor#${this.instanceId}] 🔥 ${level}() triggered (${this.callbacks.length} callbacks)`
        );
        for (const cb of this.callbacks) {
          cb(level, args);
        }
        original(...args);
      };
    });
  }

  // Only detach if no callbacks remain - prevents breaking other consumers
  detach(): void {
    if (this.callbacks.length > 0) {
      this.debugLog(
        `[ConsoleInterceptor#${this.instanceId}] detach() SKIPPED - ${this.callbacks.length} callbacks still active`
      );
      return;
    }
    this.debugLog(
      `[ConsoleInterceptor#${this.instanceId}] detach() - isAttached=${this.isAttached}`
    );
    if (!this.isAttached) {
      this.debugLog(
        `[ConsoleInterceptor#${this.instanceId}] ALREADY DETACHED - skipping duplicate detach`
      );
      return;
    }
    this.isAttached = false;
    const levels: (keyof typeof this.originalConsole)[] = ['log', 'error', 'warn', 'info', 'debug'];
    levels.forEach((level) => {
      (console as unknown as Record<string, (...args: unknown[]) => void>)[level] =
        this.originalConsole[level];
    });
  }

  onLog(callback: (level: string, args: unknown[]) => void): void {
    this.debugLog(
      `[ConsoleInterceptor#${this.instanceId}] onLog() - callback count before: ${this.callbacks.length}`
    );
    this.callbacks.push(callback);
    this.debugLog(
      `[ConsoleInterceptor#${this.instanceId}] onLog() - callback count after: ${this.callbacks.length}`
    );
  }

  removeLog(callback: (level: string, args: unknown[]) => void): void {
    const index = this.callbacks.indexOf(callback);
    this.debugLog(
      `[ConsoleInterceptor#${this.instanceId}] removeLog() - callback found at index: ${index}, total: ${this.callbacks.length}`
    );
    if (index > -1) this.callbacks.splice(index, 1);
    this.debugLog(
      `[ConsoleInterceptor#${this.instanceId}] removeLog() - callback count after: ${this.callbacks.length}`
    );
  }
}
