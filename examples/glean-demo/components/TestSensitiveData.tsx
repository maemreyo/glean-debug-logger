"use client";

import { useState } from "react";

export default function TestSensitiveData() {
  const [result, setResult] = useState<string>("");

  const testWithSensitiveData = () => {
    const sensitiveData = {
      username: "user123",
      password: "super_secret_password_123!",
      apiKey: "sk_live_abc123xyz789",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      authorization: "Bearer abc123xyz",
      creditCard: "4532-1234-5678-9012",
      secretKey: "sk_test_5555555555555555",
      nonSensitive: "This should be visible",
    };

    console.log("Testing sensitive data redaction:", sensitiveData);
    setResult(JSON.stringify(sensitiveData, null, 2));
  };

  const testWithFormData = () => {
    const formData = {
      email: "user@example.com",
      password: "my_password_123!",
      confirmPassword: "my_password_123!",
      apiToken: "token_abc_123",
      accessKey: "AKIAIOSFODNN7EXAMPLE",
      nonSensitiveField: "Regular data here",
    };

    console.log("Form submission with sensitive data:", formData);
    setResult(JSON.stringify(formData, null, 2));
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Sensitive Data Redaction Test</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Test that sensitive keys like password, apiKey, token, etc. are automatically redacted by GleanDebugger
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={testWithSensitiveData}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
        >
          Log Object with Sensitive Data
        </button>
        <button
          type="button"
          onClick={testWithFormData}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
        >
          Log Form Data
        </button>
        <button
          type="button"
          onClick={() => setResult("")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded h-48 overflow-y-auto font-mono text-sm">
          <pre className="text-gray-800 dark:text-gray-200">{result}</pre>
        </div>
      )}
    </div>
  );
}
