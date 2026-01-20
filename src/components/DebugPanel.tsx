"use client";

import { useState, useEffect, useCallback } from "react";
import { useLogRecorder } from "../hooks/useLogRecorder";

interface DebugPanelProps {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
  environment?: string;
  uploadEndpoint?: string;
  fileNameTemplate?: string;
  maxLogs?: number;
  showInProduction?: boolean;
}

export function DebugPanel({
  user,
  environment = process.env.NODE_ENV || "development",
  uploadEndpoint,
  fileNameTemplate = "{env}_{date}_{time}_{userId}_{errorCount}errors",
  maxLogs = 2000,
  showInProduction = false,
}: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    downloadLogs,
    uploadLogs,
    clearLogs,
    getLogCount,
    getMetadata,
    sessionId,
  } = useLogRecorder({
    fileNameTemplate,
    environment,
    userId: user?.id || user?.email || "guest",
    includeMetadata: true,
    uploadEndpoint,
    maxLogs,
    captureConsole: true,
    captureFetch: true,
    captureXHR: true,
    sanitizeKeys: [
      "password",
      "token",
      "apiKey",
      "secret",
      "authorization",
      "creditCard",
    ],
    excludeUrls: [
      "/api/analytics",
      "google-analytics.com",
      "facebook.com",
      "vercel.com",
    ],
  });

  const logCount = getLogCount();
  const metadata = getMetadata();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (metadata.errorCount >= 5 && uploadEndpoint) {
      const errorHandler = async () => {
        try {
          await uploadLogs();
        } catch {
          console.warn("[DebugPanel] Failed to auto-upload logs");
        }
      };
      window.addEventListener("error", errorHandler);
      return () => window.removeEventListener("error", errorHandler);
    }
    return undefined;
  }, [metadata.errorCount, uploadEndpoint, uploadLogs]);

  const handleUpload = useCallback(async () => {
    setIsUploading(true);
    setUploadStatus(null);

    try {
      const result = await uploadLogs();

      if (result.success) {
        setUploadStatus({
          type: "success",
          message: `Uploaded successfully! ${result.data ? JSON.stringify(result.data) : ""}`,
        });

        if (
          result.data &&
          typeof result.data === "object" &&
          "url" in result.data
        ) {
          await navigator.clipboard.writeText(
            String((result.data as { url: string }).url),
          );
        }
      } else {
        setUploadStatus({
          type: "error",
          message: `Upload failed: ${result.error}`,
        });
      }
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setIsUploading(false);
    }
  }, [uploadLogs]);

  const handleDownload = useCallback(
    (format: "json" | "txt") => {
      const filename = downloadLogs(format);
      if (filename) {
        setUploadStatus({
          type: "success",
          message: `Downloaded: ${filename}`,
        });
      }
    },
    [downloadLogs],
  );

  const shouldShow =
    showInProduction || environment === "development" || user?.role === "admin";

  if (!shouldShow) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9998,
          padding: "12px 20px",
          background: "#1f2937",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
        title="Press Ctrl+Shift+D to toggle"
      >
        <span>🐛 Debug</span>
        <span
          style={{
            background: metadata.errorCount > 0 ? "#ef4444" : "#374151",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "12px",
          }}
        >
          {logCount}
        </span>
        {metadata.errorCount > 0 && (
          <span
            style={{
              background: "#ef4444",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          >
            {metadata.errorCount} err
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            zIndex: 9999,
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            width: "384px",
            maxHeight: "600px",
            overflow: "auto",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #1f2937, #111827)",
              color: "#fff",
              padding: "16px",
              borderRadius: "12px 12px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                Debug Logger
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.8 }}>
                Session: {sessionId.substring(0, 20)}...
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              padding: "12px",
              background: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: "24px", fontWeight: 700, color: "#111827" }}
              >
                {logCount}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Total Logs
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: "24px", fontWeight: 700, color: "#dc2626" }}
              >
                {metadata.errorCount}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Errors</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: "24px", fontWeight: 700, color: "#ea580c" }}
              >
                {metadata.networkErrorCount}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Net Errors
              </div>
            </div>
          </div>

          <details
            style={{
              padding: "12px",
              borderBottom: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontWeight: 600,
                color: "#374151",
                fontSize: "14px",
                listStyle: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>📊</span> Session Info
            </summary>
            <div
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "#4b5563",
                lineHeight: 1.6,
              }}
            >
              <div>
                <strong>User:</strong> {metadata.userId || "Anonymous"}
              </div>
              <div>
                <strong>Browser:</strong> {metadata.browser} (
                {metadata.platform})
              </div>
              <div>
                <strong>Resolution:</strong> {metadata.screenResolution}
              </div>
              <div>
                <strong>URL:</strong> {metadata.url}
              </div>
              <div>
                <strong>Timezone:</strong> {metadata.timezone}
              </div>
            </div>
          </details>

          <div
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}
              >
                Download Logs
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleDownload("json")}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#1d4ed8")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#2563eb")
                  }
                >
                  📥 JSON
                </button>
                <button
                  onClick={() => handleDownload("txt")}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#1d4ed8")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#2563eb")
                  }
                >
                  📄 TXT
                </button>
              </div>
            </div>

            {uploadEndpoint && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Upload to Server
                </label>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: isUploading ? "#9ca3af" : "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isUploading ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => {
                    if (!isUploading)
                      e.currentTarget.style.background = "#15803d";
                  }}
                  onMouseOut={(e) => {
                    if (!isUploading)
                      e.currentTarget.style.background = "#16a34a";
                  }}
                >
                  {isUploading ? "⏳ Uploading..." : "☁️ Upload Logs"}
                </button>
              </div>
            )}

            {uploadStatus && (
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background:
                    uploadStatus.type === "success" ? "#dcfce7" : "#fee2e2",
                  color:
                    uploadStatus.type === "success" ? "#166534" : "#991b1b",
                  border: `1px solid ${uploadStatus.type === "success" ? "#86efac" : "#fca5a5"}`,
                }}
              >
                {uploadStatus.message}
              </div>
            )}

            <button
              onClick={() => {
                if (confirm("Clear all logs? This cannot be undone.")) {
                  clearLogs();
                  setUploadStatus(null);
                }
              }}
              style={{
                width: "100%",
                padding: "10px 16px",
                background: "#dc2626",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#b91c1c")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#dc2626")}
            >
              🗑️ Clear All Logs
            </button>
          </div>

          <div
            style={{
              padding: "12px",
              background: "#f9fafb",
              borderTop: "1px solid #e5e7eb",
              borderRadius: "0 0 12px 12px",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            <div style={{ marginBottom: "4px" }}>
              <strong>💡 Tip:</strong> Press{" "}
              <kbd
                style={{
                  padding: "2px 6px",
                  background: "#e5e7eb",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                }}
              >
                Ctrl+Shift+D
              </kbd>{" "}
              to toggle
            </div>
            <div style={{ marginBottom: "4px" }}>
              <strong>💾 Auto-save:</strong> Logs persist across page refreshes
            </div>
            <div>
              <strong>🔒 Security:</strong> Sensitive data is auto-redacted
            </div>
          </div>
        </div>
      )}
    </>
  );
}
