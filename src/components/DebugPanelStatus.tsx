import { successMessageStyles, errorMessageStyles } from './DebugPanel.styles';
import type { StatusMessage } from '../hooks/useStatusMessages';

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
          {uploadStatus.message}
        </div>
      )}

      {directoryStatus && (
        <div
          role="status"
          aria-live="polite"
          className={directoryStatus.type === 'success' ? successMessageStyles : errorMessageStyles}
        >
          {directoryStatus.message}
        </div>
      )}

      {copyStatus && (
        <div
          role="status"
          aria-live="polite"
          className={copyStatus.type === 'success' ? successMessageStyles : errorMessageStyles}
        >
          {copyStatus.message}
        </div>
      )}
    </div>
  );
}
