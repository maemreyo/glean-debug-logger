"use client";

import { useState } from "react";

export default function TestXHR() {
  const [requests, setRequests] = useState<{ url: string; method: string; status: number }[]>([]);

  const testConsole = () => {
    console.log("[TEST] Console log test message");
    console.error("[TEST] Console error test message");
    console.warn("[TEST] Console warn test message");
    console.info("[TEST] Console info test message");
  };

  const testFetch200 = async () => {
    try {
      await fetch("https://jsonplaceholder.typicode.com/posts/1");
    } catch {
      // Ignore errors for test
    }
  };

  const testFetch404 = async () => {
    try {
      await fetch("https://httpstat.us/404");
    } catch {
      // Ignore errors for test
    }
  };

  const testFetchError = async () => {
    try {
      await fetch("https://this-domain-definitely-does-not-exist-12345.com");
    } catch {
      // Ignore errors for test
    }
  };

  const testXHR200 = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://jsonplaceholder.typicode.com/users/1");
    xhr.onload = () => {
      console.log("[TEST] XHR completed:", xhr.status);
    };
    xhr.onerror = () => {
      console.error("[TEST] XHR error");
    };
    xhr.send();
  };

  const testXHR500 = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://httpstat.us/500");
    xhr.onload = () => {
      console.log("[TEST] XHR completed:", xhr.status);
    };
    xhr.onerror = () => {
      console.error("[TEST] XHR error");
    };
    xhr.send();
  };

  const testXHRError = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://non-existent-domain-xyz-123.com");
    xhr.timeout = 5000;
    xhr.ontimeout = () => {
      console.error("[TEST] XHR timeout");
    };
    xhr.onerror = () => {
      console.error("[TEST] XHR network error");
    };
    xhr.send();
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Network Request Test</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Test network request capturing (Console, Fetch, XHR)
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={testConsole}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
        >
          🧪 Console
        </button>
        <button
          type="button"
          onClick={testFetch200}
          className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
        >
          🌐 Fetch (200)
        </button>
        <button
          type="button"
          onClick={testFetch404}
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
        >
          ⚠️ Fetch (404)
        </button>
        <button
          type="button"
          onClick={testFetchError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          🔥 Fetch (Err)
        </button>
        <button
          type="button"
          onClick={testXHR200}
          className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 transition-colors"
        >
          📡 XHR (200)
        </button>
        <button
          type="button"
          onClick={testXHR500}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
        >
          📡 XHR (500)
        </button>
        <button
          type="button"
          onClick={testXHRError}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          💥 XHR (Err)
        </button>
        <button
          type="button"
          onClick={() => setRequests([])}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>

      {requests.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded h-32 overflow-y-auto font-mono text-sm">
          {requests.map((req, i) => (
            <div key={`req-${req.url}-${i}`} className="mb-1 border-b border-gray-200 dark:border-gray-700 pb-1">
              {req.method} {req.url} - Status: {req.status}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
