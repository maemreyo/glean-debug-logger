// Singleton pattern - only one instance exists even with HMR module reloads

export class ConsoleInterceptor {
  private static instance: ConsoleInterceptor | null = null;
  private static isGloballyAttached: boolean = false;
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

  // Private constructor - use getInstance() instead
  private constructor() {
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

    // If another singleton was already attached, inherit its attached state
    // This prevents overwriting already-patched console methods
    if (ConsoleInterceptor.isGloballyAttached) {
      this.isAttached = true;
    }

    ConsoleInterceptor.instance = this;
    this.originalLog(
      `[ConsoleInterceptor#${this.instanceId}] ✅ Created singleton instance (total: ${ConsoleInterceptor.instanceCount})`
    );
  }

  static getInstance(): ConsoleInterceptor {
    if (!ConsoleInterceptor.instance) {
      ConsoleInterceptor.instance = new ConsoleInterceptor();
    }
    return ConsoleInterceptor.instance;
  }

  // For testing purposes only - creates a new instance without singleton pattern
  static createNew(): ConsoleInterceptor {
    return new ConsoleInterceptor();
  }

  static resetInstance(): void {
    if (ConsoleInterceptor.instance) {
      ConsoleInterceptor.instance.forceDetach();
      ConsoleInterceptor.instance = null;
    }
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
    ConsoleInterceptor.isGloballyAttached = true;
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
    // Only remove callback of this instance
    // Don't set singleton = null here
    if (!this.isAttached) {
      this.debugLog(
        `[ConsoleInterceptor#${this.instanceId}] ALREADY DETACHED - skipping duplicate detach`
      );
      return;
    }

    // Always force detach to restore original console methods
    // The callback check was removed to match original expected behavior
    this.forceDetach();
  }

  private forceDetach(): void {
    if (!this.isAttached) return;
    this.isAttached = false;
    ConsoleInterceptor.isGloballyAttached = false;

    const levels: (keyof typeof this.originalConsole)[] = ['log', 'error', 'warn', 'info', 'debug'];
    levels.forEach((level) => {
      (console as unknown as Record<string, (...args: unknown[]) => void>)[level] =
        this.originalConsole[level];
    });

    this.debugLog(`[ConsoleInterceptor#${this.instanceId}] Force detached`);
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
