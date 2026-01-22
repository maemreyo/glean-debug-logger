"use client";

import { useState } from "react";

export default function TestXHR() {
  const [requests, setRequests] = useState<{ url: string; method: string; status: number }[]>([]);

  const simulateXHR = () => {
    // Since fetch is already captured, we'll use XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
      const req = {
        url: "https://jsonplaceholder.typicode.com/posts/1",
        method: "GET",
        status: xhr.status,
      };
      setRequests((prev) => [...prev, req]);
      console.log("XHR Request completed:", req);
    };

    xhr.onerror = function () {
      console.error("XHR Request failed");
    };

    xhr.send();
  };

  const simulateFailedXHR = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://jsonplaceholder.typicode.com/invalid-endpoint");
    xhr.onload = function () {
      const req = {
        url: "https://jsonplaceholder.typicode.com/invalid-endpoint",
        method: "GET",
        status: xhr.status,
      };
      setRequests((prev) => [...prev, req]);
      console.log("XHR Request completed:", req);
    };
    xhr.onerror = function () {
      console.error("XHR Request error");
    };
    xhr.send();
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">XHR Request Test</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Test XHR request capturing (XMLHttpRequest)
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={simulateXHR}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
        >
          Simulate XHR (Success)
        </button>
        <button
          type="button"
          onClick={simulateFailedXHR}
          className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500 transition-colors"
        >
          Simulate XHR (Error)
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
