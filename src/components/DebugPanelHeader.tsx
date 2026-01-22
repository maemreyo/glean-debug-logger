import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  headerStyles,
  headerTitleWrapperStyles,
  headerTitleStyles,
  closeButtonStyles,
  deleteButtonStyles,
  iconButtonStyles,
  sessionTooltipStyles,
  sessionTooltipRowStyles,
  sessionTooltipLabelStyles,
  sessionTooltipValueStyles,
} from './DebugPanel.styles';
import { useCopyFormat, CopyFormat } from '../hooks/useCopyFormat';
import { Settings, FileJson, FileText, Save, Trash2, X, Info } from 'lucide-react';
import type { LogMetadata } from '../types';

interface DebugPanelHeaderProps {
  sessionId: string;
  metadata: LogMetadata;
  onClose: () => void;
  onSaveToDirectory: () => void;
  onClear: () => void;
}

// Custom styled dropdown content component
function SettingsDropdownContent({
  copyFormat,
  setCopyFormat,
  onSaveToDirectory,
  onCloseDropdown,
}: {
  copyFormat: CopyFormat;
  setCopyFormat: (format: CopyFormat) => void;
  onSaveToDirectory: () => void;
  onCloseDropdown: () => void;
}) {
  const formatOptions: CopyFormat[] = ['json', 'ecs.json', 'ai.txt'];

  const formatIcons = {
    json: <FileJson size={14} />,
    'ecs.json': <FileText size={14} />,
    'ai.txt': <FileText size={14} />,
  };

  return (
    <div
      style={{
        minWidth: 180,
        background: 'var(--glass-bg, rgba(255,255,255,0.95))',
        backdropFilter: 'blur(20px)',
        borderRadius: 10,
        padding: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
        animation: 'gleanDropdownIn 0.15s ease-out',
      }}
    >
      <div
        style={{
          padding: '8px 10px 6px',
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--muted, #a0aec0)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        Copy Format
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {formatOptions.map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => {
              setCopyFormat(format);
              onCloseDropdown();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '10px 12px',
              textAlign: 'left',
              background:
                copyFormat === format ? 'var(--primary-bg, rgba(14,165,233,0.08))' : 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              color: copyFormat === format ? 'var(--accent, #0ea5e9)' : 'var(--secondary, #4a5568)',
              transition: 'all 0.12s ease',
            }}
          >
            {formatIcons[format]}
            <span style={{ flex: 1 }}>
              {format === 'json' && 'JSON'}
              {format === 'ecs.json' && 'ECS (AI)'}
              {format === 'ai.txt' && 'AI-TXT'}
            </span>
            {copyFormat === format && <span>✓</span>}
          </button>
        ))}
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border-color, rgba(0,0,0,0.06))',
          margin: '8px 0',
        }}
      />

      <button
        type="button"
        onClick={() => {
          onSaveToDirectory();
          onCloseDropdown();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '10px 12px',
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 12,
          color: 'var(--secondary, #4a5568)',
          transition: 'all 0.12s ease',
        }}
      >
        <Save size={14} />
        <span>Save to Folder</span>
      </button>
    </div>
  );
}

export const DebugPanelHeader = forwardRef<HTMLButtonElement, DebugPanelHeaderProps>(
  function DebugPanelHeader(
    { sessionId, metadata, onClose, onSaveToDirectory, onClear },
    closeButtonRef
  ) {
    const { copyFormat, setCopyFormat } = useCopyFormat();
    const [showSettings, setShowSettings] = useState(false);
    const [showSessionTooltip, setShowSessionTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);
    const iconButtonRef = useRef<HTMLButtonElement>(null);

    const updateTooltipPosition = useCallback(() => {
      if (iconButtonRef.current) {
        const rect = iconButtonRef.current.getBoundingClientRect();
        const tooltipWidth = 200;
        const tooltipHeight = 140;

        let left = rect.right - tooltipWidth + 20;
        let top = rect.top - tooltipHeight - 8;

        if (left + tooltipWidth > window.innerWidth - 10) {
          left = window.innerWidth - tooltipWidth - 10;
        }
        if (left < 10) {
          left = 10;
        }
        if (top < 10) {
          top = rect.bottom + 8;
        }

        setTooltipPosition({ top, left });
      }
    }, []);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
          setShowSessionTooltip(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      if (showSessionTooltip) {
        updateTooltipPosition();
        window.addEventListener('resize', updateTooltipPosition);
        window.addEventListener('scroll', updateTooltipPosition, true);
        return () => {
          window.removeEventListener('resize', updateTooltipPosition);
          window.removeEventListener('scroll', updateTooltipPosition, true);
        };
      }
    }, [showSessionTooltip, updateTooltipPosition]);

    const shortSessionId =
      sessionId.length > 16
        ? `${sessionId.substring(0, 8)}...${sessionId.substring(sessionId.length - 6)}`
        : sessionId;

    const tooltipElement = showSessionTooltip ? (
      <div
        ref={tooltipRef}
        className={sessionTooltipStyles}
        style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
      >
        <div className={sessionTooltipRowStyles}>
          <span className={sessionTooltipLabelStyles}>User</span>
          <span className={sessionTooltipValueStyles}>{metadata.userId || 'Anonymous'}</span>
        </div>
        <div className={sessionTooltipRowStyles}>
          <span className={sessionTooltipLabelStyles}>Browser</span>
          <span className={sessionTooltipValueStyles}>{metadata.browser}</span>
        </div>
        <div className={sessionTooltipRowStyles}>
          <span className={sessionTooltipLabelStyles}>OS</span>
          <span className={sessionTooltipValueStyles}>{metadata.platform}</span>
        </div>
        <div className={sessionTooltipRowStyles}>
          <span className={sessionTooltipLabelStyles}>Screen</span>
          <span className={sessionTooltipValueStyles}>{metadata.screenResolution}</span>
        </div>
        <div className={sessionTooltipRowStyles}>
          <span className={sessionTooltipLabelStyles}>TZ</span>
          <span className={sessionTooltipValueStyles}>{metadata.timezone}</span>
        </div>
      </div>
    ) : null;

    return (
      <>
        <div className={headerStyles}>
          <div className={headerTitleWrapperStyles}>
            <h3 className={headerTitleStyles}>Debug</h3>
            <div
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span className="font-mono text-[10px]" style={{ color: 'var(--muted, #a0aec0)' }}>
                {shortSessionId}
              </span>
              <button
                ref={iconButtonRef}
                type="button"
                onMouseEnter={() => {
                  setShowSessionTooltip(true);
                  updateTooltipPosition();
                }}
                onMouseLeave={() => setShowSessionTooltip(false)}
                onClick={() => {
                  setShowSessionTooltip(!showSessionTooltip);
                  updateTooltipPosition();
                }}
                className={closeButtonStyles}
                aria-label="Session info"
                style={{ width: '18px', height: '18px' }}
              >
                <Info size={12} />
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onClear}
              className={deleteButtonStyles}
              aria-label="Clear all logs"
              title="Clear logs"
            >
              <Trash2 size={16} />
            </button>
            <DropdownMenu.Root open={showSettings} onOpenChange={(open) => setShowSettings(open)}>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className={iconButtonStyles}
                  aria-label="Actions and settings"
                  title="Actions and settings"
                >
                  <Settings size={16} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content sideOffset={6} align="end" style={{ zIndex: 100000 }}>
                  <SettingsDropdownContent
                    copyFormat={copyFormat}
                    setCopyFormat={setCopyFormat}
                    onSaveToDirectory={onSaveToDirectory}
                    onCloseDropdown={() => setShowSettings(false)}
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className={closeButtonStyles}
              aria-label="Close debug panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {typeof document !== 'undefined' && createPortal(tooltipElement, document.body)}
      </>
    );
  }
);
