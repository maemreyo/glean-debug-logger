import { actionButtonStyles } from './DebugPanel.styles';
import type { ExportFormat } from '../types';

type CopyFilter = 'all' | 'logs' | 'errors' | 'network' | 'networkErrors';

interface DebugPanelActionsProps {
  logCount: number;
  hasUploadEndpoint: boolean;
  isUploading: boolean;
  getFilteredLogCount: (filter: CopyFilter) => number;
  onCopyFiltered: (filter: CopyFilter) => void;
  onDownload: (format: ExportFormat) => void;
  onCopy: () => void;
  onUpload: () => void;
}

export function DebugPanelActions({
  logCount,
  hasUploadEndpoint,
  isUploading,
  getFilteredLogCount,
  onCopyFiltered,
  onDownload,
  onCopy,
  onUpload,
}: DebugPanelActionsProps) {
  return (
    <div style={{ padding: '12px 16px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
        }}
      >
        <button
          type="button"
          onClick={() => onCopyFiltered('logs')}
          className={actionButtonStyles}
          disabled={logCount === 0 || getFilteredLogCount('logs') === 0}
          aria-label="Copy only console logs"
        >
          📋 Logs
        </button>
        <button
          type="button"
          onClick={() => onCopyFiltered('errors')}
          className={actionButtonStyles}
          disabled={logCount === 0 || getFilteredLogCount('errors') === 0}
          aria-label="Copy only errors"
        >
          ⚠️ Errors
        </button>
        <button
          type="button"
          onClick={() => onCopyFiltered('network')}
          className={actionButtonStyles}
          disabled={logCount === 0 || getFilteredLogCount('network') === 0}
          aria-label="Copy only network requests"
        >
          🌐 Network
        </button>
        <button
          type="button"
          onClick={() => onDownload('json')}
          className={actionButtonStyles}
          disabled={logCount === 0}
        >
          📄 JSON
        </button>
        <button
          type="button"
          onClick={() => onDownload('txt')}
          className={actionButtonStyles}
          disabled={logCount === 0}
        >
          📝 TXT
        </button>
        <button
          type="button"
          onClick={() => onDownload('jsonl')}
          className={actionButtonStyles}
          disabled={logCount === 0}
        >
          📦 JSONL
        </button>
        <button
          type="button"
          onClick={() => onDownload('ecs.json')}
          className={actionButtonStyles}
          disabled={logCount === 0}
        >
          📋 ECS
        </button>
        <button
          type="button"
          onClick={onCopy}
          className={actionButtonStyles}
          disabled={logCount === 0}
        >
          📋 Copy
        </button>
        <button
          type="button"
          onClick={() => onDownload('ai.txt')}
          className={actionButtonStyles}
          disabled={logCount === 0}
        >
          🤖 AI
        </button>

        {hasUploadEndpoint ? (
          <button
            type="button"
            onClick={onUpload}
            className={actionButtonStyles}
            disabled={isUploading}
          >
            ☁️ Upload
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
