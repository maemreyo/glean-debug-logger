'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  detailsStyles,
  summaryStyles,
  sessionIconWrapperStyles,
  sessionLabelStyles,
  sessionDividerStyles,
  sessionContentStyles,
  sessionInfoStyles,
  infoRowStyles,
  infoLabelStyles,
  infoValueStyles,
  sessionIdValueStyles,
} from './DebugPanel.styles';
import type { LogMetadata } from '../types';

interface DebugPanelSessionDetailsProps {
  metadata: LogMetadata;
}

export function DebugPanelSessionDetails({ metadata }: DebugPanelSessionDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<number | 'auto'>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setHeight(contentRef.current.scrollHeight);
        const timeout = setTimeout(() => {
          setHeight('auto');
        }, 300);
        return () => clearTimeout(timeout);
      } else {
        setHeight(contentRef.current.scrollHeight);
        requestAnimationFrame(() => {
          setHeight(0);
        });
      }
    }
    return undefined;
  }, [isOpen]);

  return (
    <div className={detailsStyles}>
      <button
        type="button"
        className={summaryStyles}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="session-content"
      >
        <span className={sessionIconWrapperStyles}>
          <ChevronDown
            size={14}
            className={`glean-session-chevron ${isOpen ? 'glean-open' : ''}`}
          />
        </span>
        <span className={sessionLabelStyles}>Session Details</span>
        <div className={sessionDividerStyles} />
      </button>

      <div
        id="session-content"
        ref={contentRef}
        className={sessionContentStyles}
        style={{
          height: typeof height === 'number' ? `${height}px` : 'auto',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className={sessionInfoStyles}>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>User</span>
            <span className={infoValueStyles}>{metadata.userId || 'Anonymous'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Session ID</span>
            <span className={sessionIdValueStyles}>{metadata.sessionId || 'N/A'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Browser</span>
            <span className={infoValueStyles}>
              {metadata.browser} · {metadata.platform}
            </span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Screen</span>
            <span className={infoValueStyles}>{metadata.screenResolution}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Timezone</span>
            <span className={infoValueStyles}>{metadata.timezone}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Language</span>
            <span className={infoValueStyles}>{metadata.language}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Viewport</span>
            <span className={infoValueStyles}>{metadata.viewport}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
