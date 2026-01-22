import { detailsStyles, summaryStyles, sessionInfoStyles } from './DebugPanel.styles';
import type { LogMetadata } from '../types';
import { ChevronRight } from 'lucide-react';

interface DebugPanelSessionDetailsProps {
  metadata: LogMetadata;
}

export function DebugPanelSessionDetails({ metadata }: DebugPanelSessionDetailsProps) {
  return (
    <details
      className={detailsStyles}
      style={{ borderTop: '1px solid var(--border-color, #f3f4f6)', borderRadius: 0 }}
    >
      <summary className={summaryStyles}>
        <ChevronRight size={12} />
        <span>Session Details</span>
      </summary>
      <div className={sessionInfoStyles}>
        <div>
          <strong>User</strong>
          <span>{metadata.userId || 'Anonymous'}</span>
        </div>
        <div>
          <strong>Browser</strong>
          <span>
            {metadata.browser} ({metadata.platform})
          </span>
        </div>
        <div>
          <strong>Screen</strong>
          <span>{metadata.screenResolution}</span>
        </div>
        <div>
          <strong>Timezone</strong>
          <span>{metadata.timezone}</span>
        </div>
      </div>
    </details>
  );
}
