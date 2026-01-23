import * as Tooltip from '@radix-ui/react-tooltip';
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

function TooltipButton({
  children,
  content,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  content: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Tooltip.Provider delayDuration={200} skipDelayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button type="button" disabled={disabled} {...props}>
            {children}
          </button>
        </Tooltip.Trigger>
        {!disabled && (
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              sideOffset={6}
              align="center"
              style={{
                background: 'var(--color-primary, #1a1a2e)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 500,
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                zIndex: 100000,
              }}
            >
              {content}
              <Tooltip.Arrow
                style={{
                  fill: 'var(--color-primary, #1a1a2e)',
                }}
              />
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  );
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
          <TooltipButton
            content="Copy only console logs"
            disabled={isDisabled || getFilteredLogCount('logs') === 0}
            onClick={() => onCopyFiltered('logs')}
            className={actionButtonStyles}
            aria-label="Copy only console logs"
          >
            <Terminal size={18} />
            Logs
          </TooltipButton>
          <TooltipButton
            content="Copy only errors"
            disabled={isDisabled || getFilteredLogCount('errors') === 0}
            onClick={() => onCopyFiltered('errors')}
            className={actionButtonStyles}
            aria-label="Copy only errors"
          >
            <AlertCircle size={18} />
            Errors
          </TooltipButton>
          <TooltipButton
            content="Copy only network requests"
            disabled={isDisabled || getFilteredLogCount('network') === 0}
            onClick={() => onCopyFiltered('network')}
            className={actionButtonStyles}
            aria-label="Copy only network requests"
          >
            <Globe size={18} />
            Network
          </TooltipButton>
        </div>
      </div>

      <div className={actionGroupStyles}>
        <div className={labelStyles}>Export</div>
        <div className={buttonGrid3Styles}>
          <TooltipButton
            content="Download as JSON"
            disabled={isDisabled}
            onClick={() => onDownload('json')}
            className={actionButtonStyles}
            aria-label="Download as JSON"
          >
            <FileJson size={18} />
            JSON
          </TooltipButton>
          <TooltipButton
            content="Download as TXT"
            disabled={isDisabled}
            onClick={() => onDownload('txt')}
            className={actionButtonStyles}
            aria-label="Download as TXT"
          >
            <FileText size={18} />
            TXT
          </TooltipButton>
          <TooltipButton
            content="Download as JSONL"
            disabled={isDisabled}
            onClick={() => onDownload('jsonl')}
            className={actionButtonStyles}
            aria-label="Download as JSONL"
          >
            <Database size={18} />
            JSONL
          </TooltipButton>
        </div>
      </div>

      <div className={actionGroupStyles}>
        <div className={labelStyles}>Actions</div>
        <div className={buttonGrid3Styles}>
          <TooltipButton
            content="Copy all to clipboard"
            disabled={isDisabled}
            onClick={onCopy}
            className={actionButtonStyles}
            aria-label="Copy all to clipboard"
          >
            <Copy size={18} />
            Copy
          </TooltipButton>
          <TooltipButton
            content="Download AI-optimized format"
            disabled={isDisabled}
            onClick={() => onDownload('ai.txt')}
            className={actionButtonStyles}
            aria-label="Download AI-optimized format"
          >
            <FileText size={18} />
            AI-TXT
          </TooltipButton>
          {hasUploadEndpoint ? (
            <TooltipButton
              content="Upload logs to server"
              disabled={isUploading}
              onClick={onUpload}
              className={uploadButtonStyles}
              aria-label="Upload logs to server"
            >
              <CloudUpload size={18} />
              {isUploading ? 'Uploading...' : 'Upload'}
            </TooltipButton>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
