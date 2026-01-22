import {
  statsGridStyles,
  statItemStyles,
  statValueStyles,
  statLabelStyles,
  errorValueStyles,
  networkErrorValueStyles,
} from './DebugPanel.styles';

interface DebugPanelStatsProps {
  logCount: number;
  errorCount: number;
  networkErrorCount: number;
}

export function DebugPanelStats({ logCount, errorCount, networkErrorCount }: DebugPanelStatsProps) {
  return (
    <div className={statsGridStyles}>
      <div className={statItemStyles}>
        <div className={statValueStyles}>{logCount}</div>
        <div className={statLabelStyles}>Logs</div>
      </div>
      <div className={statItemStyles}>
        <div className={`${statValueStyles} ${errorValueStyles}`}>{errorCount}</div>
        <div className={statLabelStyles}>Errors</div>
      </div>
      <div className={statItemStyles}>
        <div className={`${statValueStyles} ${networkErrorValueStyles}`}>{networkErrorCount}</div>
        <div className={statLabelStyles}>Network</div>
      </div>
    </div>
  );
}
