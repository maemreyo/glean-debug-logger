import {
  actionsStyles,
  actionGroupStyles,
  labelStyles,
  buttonGrid3Styles,
  actionButtonStyles,
  uploadButtonStyles,
} from './DebugPanel.styles';
import type { ExportFormat } from '../types';
import {
  FileJson,
  FileText,
  Database,
  Copy,
  CloudUpload,
  AlertCircle,
  Globe,
  Terminal,
} from 'lucide-react';

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
  const isDisabled = logCount === 0;

  return (
    <div className={actionsStyles}>
      <div className={actionGroupStyles}>
        <div className={labelStyles}>Copy Filtered</div>
        <div className={buttonGrid3Styles}>
          <button
            type="button"
            onClick={() => onCopyFiltered('logs')}
            className={actionButtonStyles}
            disabled={isDisabled || getFilteredLogCount('logs') === 0}
            aria-label="Copy only console logs"
          >
            <Terminal size={18} />
            Logs
          </button>
          <button
            type="button"
            onClick={() => onCopyFiltered('errors')}
            className={actionButtonStyles}
            disabled={isDisabled || getFilteredLogCount('errors') === 0}
            aria-label="Copy only errors"
          >
            <AlertCircle size={18} />
            Errors
          </button>
          <button
            type="button"
            onClick={() => onCopyFiltered('network')}
            className={actionButtonStyles}
            disabled={isDisabled || getFilteredLogCount('network') === 0}
            aria-label="Copy only network requests"
          >
            <Globe size={18} />
            Network
          </button>
        </div>
      </div>

      <div className={actionGroupStyles}>
        <div className={labelStyles}>Export</div>
        <div className={buttonGrid3Styles}>
          <button
            type="button"
            onClick={() => onDownload('json')}
            className={actionButtonStyles}
            disabled={isDisabled}
            aria-label="Download as JSON"
          >
            <FileJson size={18} />
            JSON
          </button>
          <button
            type="button"
            onClick={() => onDownload('txt')}
            className={actionButtonStyles}
            disabled={isDisabled}
            aria-label="Download as TXT"
          >
            <FileText size={18} />
            TXT
          </button>
          <button
            type="button"
            onClick={() => onDownload('jsonl')}
            className={actionButtonStyles}
            disabled={isDisabled}
            aria-label="Download as JSONL"
          >
            <Database size={18} />
            JSONL
          </button>
        </div>
      </div>

      <div className={actionGroupStyles}>
        <div className={labelStyles}>Actions</div>
        <div className={buttonGrid3Styles}>
          <button
            type="button"
            onClick={onCopy}
            className={actionButtonStyles}
            disabled={isDisabled}
            aria-label="Copy all to clipboard"
          >
            <Copy size={18} />
            Copy
          </button>
          <button
            type="button"
            onClick={() => onDownload('ai.txt')}
            className={actionButtonStyles}
            disabled={isDisabled}
            aria-label="Download AI-optimized format"
          >
            <FileText size={18} />
            AI-TXT
          </button>
          {hasUploadEndpoint ? (
            <button
              type="button"
              onClick={onUpload}
              className={uploadButtonStyles}
              disabled={isUploading}
              aria-label="Upload logs to server"
            >
              <CloudUpload size={18} />
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
