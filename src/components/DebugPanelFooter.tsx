import { footerStyles, footerTipStyles } from './DebugPanel.styles';

export function DebugPanelFooter() {
  return (
    <div className={footerStyles}>
      <div className={footerTipStyles}>
        Press <kbd>Ctrl+Shift+D</kbd> to toggle
      </div>
    </div>
  );
}
