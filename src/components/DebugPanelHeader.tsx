import { forwardRef } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  headerStyles,
  headerTitleWrapperStyles,
  headerTitleStyles,
  closeButtonStyles,
  deleteButtonStyles,
  iconButtonStyles,
  dropdownContentStyles,
  dropdownSectionStyles,
  dropdownInfoRowStyles,
  dropdownInfoLabelStyles,
  dropdownInfoValueStyles,
  dropdownMonoValueStyles,
  dropdownItemStyles,
  dropdownItemCheckStyles,
  dropdownDividerStyles,
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
  return (
    <div className={dropdownContentStyles}>
      <div className={dropdownSectionStyles}>Session Details</div>
      <div className={dropdownInfoRowStyles}>
        <span className={dropdownInfoLabelStyles}>User</span>
        <span className={dropdownInfoValueStyles}>{metadata.userId || 'Anonymous'}</span>
      </div>
      <div className={dropdownInfoRowStyles}>
        <span className={dropdownInfoLabelStyles}>Session ID</span>
        <span className={dropdownMonoValueStyles}>{metadata.sessionId || 'N/A'}</span>
      </div>
      <div className={dropdownInfoRowStyles}>
        <span className={dropdownInfoLabelStyles}>Browser</span>
        <span className={dropdownInfoValueStyles}>
          {metadata.browser} · {metadata.platform}
        </span>
      </div>
      <div className={dropdownInfoRowStyles}>
        <span className={dropdownInfoLabelStyles}>Screen</span>
        <span className={dropdownInfoValueStyles}>{metadata.screenResolution}</span>
      </div>
      <div className={dropdownInfoRowStyles}>
        <span className={dropdownInfoLabelStyles}>Timezone</span>
        <span className={dropdownInfoValueStyles}>{metadata.timezone}</span>
      </div>
      <div className={dropdownInfoRowStyles}>
        <span className={dropdownInfoLabelStyles}>Language</span>
        <span className={dropdownInfoValueStyles}>{metadata.language}</span>
      </div>
      <div className={dropdownInfoRowStyles}>
        <span className={dropdownInfoLabelStyles}>Viewport</span>
        <span className={dropdownInfoValueStyles}>{metadata.viewport}</span>
      </div>
    </div>
  );
}

// Settings dropdown content
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
    <div className={dropdownContentStyles}>
      <div className={dropdownSectionStyles}>Export format</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {formatOptions.map((format) => (
          <button
            key={format}
            type="button"
            className={dropdownItemStyles}
            style={
              copyFormat === format
                ? {
                    background: 'rgba(0, 0, 0, 0.06)',
                    color: 'rgba(0, 0, 0, 0.9)',
                  }
                : undefined
            }
            onClick={() => {
              setCopyFormat(format);
              onCloseDropdown();
            }}
          >
            {formatIcons[format]}
            <span style={{ flex: 1 }}>
              {format === 'json' && 'JSON'}
              {format === 'ecs.json' && 'ECS (AI)'}
              {format === 'ai.txt' && 'AI-TXT'}
            </span>
            {copyFormat === format && <span className={dropdownItemCheckStyles}>✓</span>}
          </button>
        ))}
      </div>

      <div className={dropdownDividerStyles} />

      <div className={dropdownSectionStyles}>Actions</div>
      <button
        type="button"
        className={dropdownItemStyles}
        onClick={() => {
          onSaveToDirectory();
          onCloseDropdown();
        }}
      >
        <Save size={14} />
        <span>Save to folder</span>
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
