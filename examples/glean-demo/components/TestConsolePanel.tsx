"use client";

import { useState } from "react";

export default function TestConsolePanel() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (level: string, message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${level}: ${message}`;
    setLogs((prev) => [...prev, logEntry]);

    switch (level) {
      case "log":
        console.log(logEntry);
        break;
      case "info":
        console.info(logEntry);
        break;
      case "warn":
        console.warn(logEntry);
        break;
      case "error":
        console.error(logEntry);
        break;
      case "debug":
        console.debug(logEntry);
        break;
    }
  };

  const handleFetch = async () => {
    const id = Math.random().toString(36).substring(7);
    addLog("info", `Fetching user data... (id: ${id})`);

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
      const data = await response.json();
      addLog("info", `Fetch successful: ${JSON.stringify(data).substring(0, 50)}...`);
    } catch {
      addLog("error", `Fetch failed: User ${id} not found`);
    }
  };

  const triggerError = () => {
    try {
      throw new Error("This is a test error for GleanDebugger!");
    } catch (e) {
      addLog("error", `Error caught: ${(e as Error).message}`);
      console.error("Test error stack:", (e as Error).stack);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Console & Network Test</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => addLog("log", "This is a log message")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Console Log
        </button>
        <button
          type="button"
          onClick={() => addLog("info", "This is an info message")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Console Info
        </button>
        <button
          type="button"
          onClick={() => addLog("warn", "This is a warning message")}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Console Warn
        </button>
        <button
          type="button"
          onClick={() => addLog("error", "This is an error message")}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Console Error
        </button>
        <button
          type="button"
          onClick={handleFetch}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Test Fetch
        </button>
        <button
          type="button"
          onClick={triggerError}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Trigger Error
        </button>
        <button
          type="button"
          onClick={clearLogs}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Clear Logs
        </button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded h-48 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <p className="text-gray-500">Click buttons above to generate logs...</p>
        ) : (
          logs.map((log, i) => (
            <div key={`log-${log.substring(0, 20)}-${i}`} className="mb-1 border-b border-gray-200 dark:border-gray-700 pb-1">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
