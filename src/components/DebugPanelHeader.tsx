import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  headerStyles,
  headerTitleWrapperStyles,
  headerTitleStyles,
  closeButtonStyles,
  settingsDropdownStyles,
  settingsDropdownHeaderStyles,
  settingsDropdownItemSelectedStyles,
  settingsDropdownItemStyles,
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

export const DebugPanelHeader = forwardRef<HTMLButtonElement, DebugPanelHeaderProps>(
  function DebugPanelHeader(
    { sessionId, metadata, onClose, onSaveToDirectory, onClear },
    closeButtonRef
  ) {
    const { copyFormat, setCopyFormat } = useCopyFormat();
    const [showSettings, setShowSettings] = useState(false);
    const [showSessionTooltip, setShowSessionTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const settingsRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const iconButtonRef = useRef<HTMLButtonElement>(null);

    const formatOptions: CopyFormat[] = ['json', 'ecs.json', 'ai.txt'];

    const formatIcons = {
      json: <FileJson size={14} />,
      'ecs.json': <FileText size={14} />,
      'ai.txt': <FileText size={14} />,
    };

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
        if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
          setShowSettings(false);
        }
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
              ref={tooltipRef}
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
              className={closeButtonStyles}
              aria-label="Clear all logs"
              title="Clear logs"
            >
              <Trash2 size={16} />
            </button>
            <div ref={settingsRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={closeButtonStyles}
                aria-label="Actions and settings"
                aria-expanded={showSettings}
                title="Actions and settings"
              >
                <Settings size={16} />
              </button>
              {showSettings && (
                <div className={settingsDropdownStyles} style={{ width: '200px' }}>
                  <div className={settingsDropdownHeaderStyles}>Copy Format</div>
                  {formatOptions.map((format) => (
                    <button
                      key={format}
                      type="button"
                      onClick={() => {
                        setCopyFormat(format);
                        setShowSettings(false);
                      }}
                      className={`${settingsDropdownItemStyles} ${copyFormat === format ? settingsDropdownItemSelectedStyles : ''}`}
                      style={{ gap: '8px' }}
                    >
                      {formatIcons[format]}
                      <span>
                        {format === 'json' && 'JSON'}
                        {format === 'ecs.json' && 'ECS (AI)'}
                        {format === 'ai.txt' && 'AI-TXT'}
                      </span>
                      {copyFormat === format && <span style={{ marginLeft: 'auto' }}>✓</span>}
                    </button>
                  ))}

                  <div
                    style={{ borderTop: '1px solid var(--border-color, #f3f4f6)', margin: '8px 0' }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      onSaveToDirectory();
                      setShowSettings(false);
                    }}
                    className={settingsDropdownItemStyles}
                    style={{ gap: '8px' }}
                  >
                    <Save size={14} />
                    <span>Save to Folder</span>
                  </button>
                </div>
              )}
            </div>
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
