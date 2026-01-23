'use client';

import { useState, useEffect } from 'react';
import { useLogRecorder } from '../hooks/useLogRecorder/index';

interface DebugPanelMinimalProps {
  fileNameTemplate?: string;
}

export function DebugPanelMinimal({
  fileNameTemplate = 'debug_{timestamp}',
}: DebugPanelMinimalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logCount, setLogCount] = useState(0);
  const { downloadLogs, clearLogs, getLogCount } = useLogRecorder({
    fileNameTemplate,
  });

  useEffect(() => {
    setLogCount(getLogCount());
    const interval = setInterval(() => {
      setLogCount(getLogCount());
    }, 100);
    return () => clearInterval(interval);
  }, [getLogCount]);

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '12px 20px',
          background: '#1f2937',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>{logCount}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: 9999,
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <button
            onClick={() => downloadLogs('json')}
            style={{
              width: '100%',
              padding: '10px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Download JSON
          </button>
          <button
            onClick={() => {
              if (confirm('Clear all logs?')) {
                clearLogs();
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Clear Logs
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#6b7280',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
