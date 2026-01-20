import { css } from 'goober';

// Toggle button
export const toggleButtonStyles = css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9998;
  padding: 12px 20px;
  background: #1f2937;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const badgeStyles = css`
  background: #374151;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

export const errorBadgeStyles = css`
  background: #ef4444;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

// Panel container
export const panelStyles = css`
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 9999;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 384px;
  max-height: 600px;
  overflow: auto;
  border: 1px solid #e5e7eb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

// Panel header
export const headerStyles = css`
  background: linear-gradient(to right, #1f2937, #111827);
  color: #fff;
  padding: 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const headerTitleStyles = css`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`;

export const headerSubtitleStyles = css`
  margin: 4px 0 0;
  font-size: 12px;
  opacity: 0.8;
`;

export const closeButtonStyles = css`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

// Stats grid
export const statsGridStyles = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const statItemStyles = css`
  text-align: center;
`;

export const statValueStyles = css`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
`;

export const statLabelStyles = css`
  font-size: 12px;
  color: #6b7280;
`;

export const errorValueStyles = css`
  color: #dc2626;
`;

export const networkErrorValueStyles = css`
  color: #ea580c;
`;

// Collapsible section
export const detailsStyles = css`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

export const summaryStyles = css`
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &::-webkit-details-marker {
    display: none;
  }
`;

export const sessionInfoStyles = css`
  margin-top: 8px;
  font-size: 12px;
  color: #4b5563;
  line-height: 1.6;

  & > div {
    margin-bottom: 4px;
  }

  strong {
    color: #374151;
  }
`;

// Action buttons container
export const actionsStyles = css`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const actionGroupStyles = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const labelStyles = css`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

export const buttonRowStyles = css`
  display: flex;
  gap: 8px;
`;

// Primary action button
export const primaryButtonStyles = css`
  flex: 1;
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

// Secondary action button (directory picker)
export const secondaryButtonStyles = css`
  width: 100%;
  padding: 10px 16px;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #6d28d9;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Upload button
export const uploadButtonStyles = css`
  width: 100%;
  padding: 10px 16px;
  background: #16a34a;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #15803d;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

// Danger button (clear logs)
export const dangerButtonStyles = css`
  width: 100%;
  padding: 10px 16px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Status message
export const successMessageStyles = css`
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
`;

export const errorMessageStyles = css`
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
`;

// Footer
export const footerStyles = css`
  padding: 12px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  font-size: 12px;
  color: #6b7280;
`;

export const footerTipStyles = css`
  margin-bottom: 4px;

  kbd {
    padding: 2px 6px;
    background: #e5e7eb;
    border-radius: 4px;
    font-family: monospace;
  }
`;

// Dark mode support
export const darkModeStyles = css`
  @media (prefers-color-scheme: dark) {
    ${panelStyles} {
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    ${headerStyles} {
      background: linear-gradient(to right, #334155, #0f172a);
    }

    ${statsGridStyles} {
      background: #0f172a;
      border-color: #334155;
    }

    ${statValueStyles} {
      color: #f1f5f9;
    }

    ${detailsStyles} {
      background: #0f172a;
      border-color: #334155;
    }

    ${summaryStyles} {
      color: #e2e8f0;
    }

    ${sessionInfoStyles} {
      color: #94a3b8;

      strong {
        color: #e2e8f0;
      }
    }

    ${footerStyles} {
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }

    ${footerTipStyles} kbd {
      background: #334155;
      color: #e2e8f0;
    }

    ${toggleButtonStyles} {
      background: #334155;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

      &:hover {
        background: #475569;
      }
    }
  }
`;
