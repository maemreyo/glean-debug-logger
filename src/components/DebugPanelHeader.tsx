import { forwardRef, useState, useRef, useEffect } from 'react';
import {
  headerStyles,
  headerTitleWrapperStyles,
  headerTitleStyles,
  headerSubtitleStyles,
  closeButtonStyles,
  settingsDropdownStyles,
  settingsDropdownHeaderStyles,
  settingsDropdownItemSelectedStyles,
  settingsDropdownItemStyles,
} from './DebugPanel.styles';
import { useCopyFormat, CopyFormat } from '../hooks/useCopyFormat';
import { Settings, FileJson, FileText, Save, Trash2, X } from 'lucide-react';

interface DebugPanelHeaderProps {
  sessionId: string;
  onClose: () => void;
  onSaveToDirectory: () => void;
  onClear: () => void;
}

export const DebugPanelHeader = forwardRef<HTMLButtonElement, DebugPanelHeaderProps>(
  function DebugPanelHeader({ sessionId, onClose, onSaveToDirectory, onClear }, closeButtonRef) {
    const { copyFormat, setCopyFormat } = useCopyFormat();
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    const formatOptions: CopyFormat[] = ['json', 'ecs.json', 'ai.txt'];

    const formatIcons = {
      json: <FileJson size={14} />,
      'ecs.json': <FileText size={14} />,
      'ai.txt': <FileText size={14} />,
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
          setShowSettings(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className={headerStyles}>
        <div className={headerTitleWrapperStyles}>
          <h3 className={headerTitleStyles}>Debug</h3>
          <p className={headerSubtitleStyles}>{sessionId.substring(0, 36)}...</p>
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
    );
  }
);
