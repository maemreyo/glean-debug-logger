import { forwardRef, useState } from 'react';
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

interface DebugPanelHeaderProps {
  sessionId: string;
  onClose: () => void;
  onSaveToDirectory: () => void;
}

export const DebugPanelHeader = forwardRef<HTMLButtonElement, DebugPanelHeaderProps>(
  function DebugPanelHeader({ sessionId, onClose, onSaveToDirectory }, closeButtonRef) {
    const { copyFormat, setCopyFormat } = useCopyFormat();
    const [showSettings, setShowSettings] = useState(false);

    const formatOptions: CopyFormat[] = ['json', 'ecs.json', 'ai.txt'];

    return (
      <div className={headerStyles}>
        <div className={headerTitleWrapperStyles}>
          <h3 className={headerTitleStyles}>Debug</h3>
          <p className={headerSubtitleStyles}>{sessionId.substring(0, 36)}...</p>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={closeButtonStyles}
              aria-label="Actions and settings"
              aria-expanded={showSettings}
              title="Actions and settings"
            >
              ⚙️
            </button>
            {showSettings && (
              <div className={settingsDropdownStyles} style={{ width: '220px' }}>
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
                  >
                    {copyFormat === format && '✓ '}
                    {format === 'json' && '📄 JSON'}
                    {format === 'ecs.json' && '📋 ECS (AI)'}
                    {format === 'ai.txt' && '🤖 AI-TXT'}
                  </button>
                ))}

                <div style={{ borderTop: '1px solid #f3f4f6', margin: '8px 0' }} />

                <button
                  type="button"
                  onClick={() => {
                    onSaveToDirectory();
                    setShowSettings(false);
                  }}
                  className={settingsDropdownItemStyles}
                >
                  📁 Save to Folder
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
            ✕
          </button>
        </div>
      </div>
    );
  }
);
