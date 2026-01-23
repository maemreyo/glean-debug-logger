import { forwardRef } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  headerStyles,
  headerTitleWrapperStyles,
  headerTitleStyles,
  closeButtonStyles,
  deleteButtonStyles,
  iconButtonStyles,
} from './DebugPanel.styles';
import { useCopyFormat, CopyFormat } from '../hooks/useCopyFormat';
import { Settings, FileJson, FileText, Save, Trash2, X, Info } from 'lucide-react';
import type { LogMetadata } from '../types';

interface DebugPanelHeaderProps {
  metadata: LogMetadata;
  onClose: () => void;
  onSaveToDirectory: () => void;
  onClear: () => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  isSessionDetailsOpen: boolean;
  openSessionDetails: () => void;
  closeSessionDetails: () => void;
}

// Session details dropdown content
function SessionDetailsDropdownContent({ metadata }: { metadata: LogMetadata }) {
  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '12px',
    padding: '4px 0',
    fontSize: 13,
    lineHeight: 1.6,
  };

  const infoLabelStyle = {
    fontWeight: 600,
    color: '#8a857f',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    fontSize: 13,
    minWidth: 100,
  };

  const infoValueStyle = {
    fontWeight: 500,
    color: '#4a4543',
    textAlign: 'right' as const,
    flex: 1,
    fontSize: 14,
  };

  const sessionIdValueStyle = {
    fontWeight: 500,
    color: '#4a4543',
    textAlign: 'right' as const,
    flex: 1,
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    fontSize: 13,
    background: 'rgba(0, 0, 0, 0.03)',
    padding: '3px 8px',
    borderRadius: 4,
  };

  return (
    <div
      style={{
        minWidth: 220,
        background: 'var(--glass-bg, rgba(255,255,255,0.95))',
        backdropFilter: 'blur(20px)',
        borderRadius: 10,
        padding: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
        animation: 'gleanDropdownIn 0.15s ease-out',
      }}
    >
      <div
        style={{
          padding: '6px 8px 8px',
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--muted, #a0aec0)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        Session Details
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>User</span>
          <span style={infoValueStyle}>{metadata.userId || 'Anonymous'}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Session ID</span>
          <span style={sessionIdValueStyle}>{metadata.sessionId || 'N/A'}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Browser</span>
          <span style={infoValueStyle}>
            {metadata.browser} · {metadata.platform}
          </span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Screen</span>
          <span style={infoValueStyle}>{metadata.screenResolution}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Timezone</span>
          <span style={infoValueStyle}>{metadata.timezone}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Language</span>
          <span style={infoValueStyle}>{metadata.language}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Viewport</span>
          <span style={infoValueStyle}>{metadata.viewport}</span>
        </div>
      </div>
    </div>
  );
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
    {
      metadata,
      onClose,
      onSaveToDirectory,
      onClear,
      isSettingsOpen,
      openSettings,
      closeSettings,
      isSessionDetailsOpen,
      openSessionDetails,
      closeSessionDetails,
    },
    closeButtonRef
  ) {
    const { copyFormat, setCopyFormat } = useCopyFormat();

    return (
      <>
        <div className={headerStyles}>
          <div className={headerTitleWrapperStyles}>
            <h3 className={headerTitleStyles}>Debug</h3>
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
            <DropdownMenu.Root
              open={isSessionDetailsOpen}
              onOpenChange={(open) => {
                open ? openSessionDetails() : closeSessionDetails();
              }}
            >
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className={iconButtonStyles}
                  aria-label="Session details"
                  title="Session details"
                >
                  <Info size={16} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={6}
                  align="end"
                  style={{ zIndex: 100000 }}
                  onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('#debug-panel')) {
                      e.preventDefault();
                    }
                  }}
                >
                  <SessionDetailsDropdownContent metadata={metadata} />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <DropdownMenu.Root
              open={isSettingsOpen}
              onOpenChange={(open) => {
                console.log('[DebugPanelHeader] Dropdown onOpenChange:', open);
                open ? openSettings() : closeSettings();
              }}
            >
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className={iconButtonStyles}
                  aria-label="Actions and settings"
                  title="Actions and settings"
                  data-settings-trigger="true"
                >
                  <Settings size={16} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  data-settings-dropdown="true"
                  sideOffset={6}
                  align="end"
                  style={{ zIndex: 100000 }}
                  onPointerDownOutside={(e) => {
                    // Prevent Radix UI from closing the dropdown when clicking inside the debug panel
                    // This allows the debug panel's mousedown handler to decide whether to close
                    const target = e.target as HTMLElement;
                    if (target.closest('#debug-panel')) {
                      e.preventDefault();
                    }
                  }}
                >
                  <SettingsDropdownContent
                    copyFormat={copyFormat}
                    setCopyFormat={setCopyFormat}
                    onSaveToDirectory={onSaveToDirectory}
                    onCloseDropdown={() => closeSettings()}
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
      </>
    );
  }
);
