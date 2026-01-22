import {
  successMessageStyles,
  errorMessageStyles,
  statusContainerStyles,
  statusMessageContentStyles,
} from './DebugPanel.styles';
import type { StatusMessage } from '../hooks/useStatusMessages';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface DebugPanelStatusProps {
  uploadStatus: StatusMessage | null;
  directoryStatus: StatusMessage | null;
  copyStatus: StatusMessage | null;
}

function StatusMessageItem({ status }: { status: StatusMessage }) {
  return (
    <div
      aria-live="polite"
      className={status.type === 'success' ? successMessageStyles : errorMessageStyles}
    >
      {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
      <span className={statusMessageContentStyles}>{status.message}</span>
    </div>
  );
}

export function DebugPanelStatus({
  uploadStatus,
  directoryStatus,
  copyStatus,
}: DebugPanelStatusProps) {
  return (
    <div className={statusContainerStyles}>
      {uploadStatus && <StatusMessageItem status={uploadStatus} />}
      {directoryStatus && <StatusMessageItem status={directoryStatus} />}
      {copyStatus && <StatusMessageItem status={copyStatus} />}
    </div>
  );
}
