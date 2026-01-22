import { successMessageStyles, errorMessageStyles } from './DebugPanel.styles';
import type { StatusMessage } from '../hooks/useStatusMessages';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface DebugPanelStatusProps {
  uploadStatus: StatusMessage | null;
  directoryStatus: StatusMessage | null;
  copyStatus: StatusMessage | null;
}

export function DebugPanelStatus({
  uploadStatus,
  directoryStatus,
  copyStatus,
}: DebugPanelStatusProps) {
  return (
    <div style={{ padding: '0 16px 12px' }}>
      {uploadStatus && (
        <div
          role="status"
          aria-live="polite"
          className={uploadStatus.type === 'success' ? successMessageStyles : errorMessageStyles}
        >
          {uploadStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {uploadStatus.message}
        </div>
      )}

      {directoryStatus && (
        <div
          role="status"
          aria-live="polite"
          className={directoryStatus.type === 'success' ? successMessageStyles : errorMessageStyles}
        >
          {directoryStatus.type === 'success' ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {directoryStatus.message}
        </div>
      )}

      {copyStatus && (
        <div
          role="status"
          aria-live="polite"
          className={copyStatus.type === 'success' ? successMessageStyles : errorMessageStyles}
        >
          {copyStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {copyStatus.message}
        </div>
      )}
    </div>
  );
}
