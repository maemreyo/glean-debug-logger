import { css } from 'goober';

// Toggle button
export const toggleButtonStyles = css`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9998;
  padding: 8px 14px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.15s ease;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const badgeStyles = css`
  background: #e5e7eb;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`;

export const errorBadgeStyles = css`
  background: #fee2e2;
  color: #dc2626;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`;

// Panel container
export const panelStyles = css`
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 9999;
  background: #fff;
  border-radius: 10px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  width: 360px;
  max-height: 580px;
  overflow: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

// Panel header
export const headerStyles = css`
  background: #fafafa;
  color: #374151;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
`;

export const headerTitleWrapperStyles = css`
  display: flex;
  gap: 8px;
`;

export const headerTitleStyles = css`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

export const headerSubtitleStyles = css`
  margin: 2px 0 0;
  font-size: 11px;
  color: #9ca3af;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
`;

export const closeButtonStyles = css`
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.15s ease;
  line-height: 1;

  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
`;

// Stats grid
export const statsGridStyles = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  padding: 0;
  background: #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`;

export const statItemStyles = css`
  text-align: center;
  background: #fff;
  padding: 10px 8px;
`;

export const statValueStyles = css`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
`;

export const statLabelStyles = css`
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

export const errorValueStyles = css`
  color: #dc2626;
`;

export const networkErrorValueStyles = css`
  color: #ea580c;
`;

// Collapsible section
export const detailsStyles = css`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
`;

export const summaryStyles = css`
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  font-size: 11px;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &::-webkit-details-marker {
    display: none;
  }
`;

export const sessionInfoStyles = css`
  margin-top: 10px;
  font-size: 11px;
  color: #6b7280;
  line-height: 1.6;

  & > div {
    margin-bottom: 4px;
    display: flex;
    gap: 6px;
  }

  strong {
    color: #374151;
    font-weight: 600;
    min-width: 75px;
  }
`;

// Action buttons container
export const actionsStyles = css`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const actionGroupStyles = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const labelStyles = css`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const buttonRowStyles = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`;

export const buttonGrid3Styles = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
`;

// Download buttons - Subtle neutral palette
export const downloadButtonStyles = css`
  padding: 6px 8px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover:not(:disabled) {
    background: #e5e7eb;
    border-color: #d1d5db;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    background: #d1d5db;
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #f3f4f6;
  }
`;

// Save to directory button - Soft indigo accent
export const saveToDirectoryButtonStyles = css`
  width: 100%;
  padding: 6px 8px;
  background: #f0f4ff;
  color: #4f46e5;
  border: 1px solid #e0e7ff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #e0e7ff;
    border-color: #c7d2fe;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    background: #c7d2fe;
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #f3f4f6;
    opacity: 0.6;
  }
`;

// Upload button - Subtle green
export const uploadButtonStyles = css`
  width: 100%;
  padding: 6px 8px;
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #dcfce7;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #dcfce7;
    border-color: #bbf7d0;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    background: #bbf7d0;
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #f3f4f6;
  }
`;

// Danger button (clear logs) - Subtle red
export const dangerButtonStyles = css`
  width: 100%;
  padding: 6px 8px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #fee2e2;
    border-color: #fecaca;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    background: #fecaca;
  }
`;

// Status message
export const successMessageStyles = css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
`;

export const errorMessageStyles = css`
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
`;

// Footer
export const footerStyles = css`
  padding: 12px 16px;
  background: #f3f4f6;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 12px 12px;
  font-size: 12px;
  color: #9ca3af;
`;

export const footerTipStyles = css`
  kbd {
    display: inline-block;
    padding: 2px 6px;
    background: #e5e7eb;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 11px;
    color: #6b7280;
  }
`;

// Settings dropdown styles - defined BEFORE darkModeStyles to avoid reference errors
export const settingsDropdownStyles = css`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  min-width: 180px;
  padding: 8px 0;
`;

export const settingsDropdownHeaderStyles = css`
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f3f4f6;
`;

export const settingsDropdownItemStyles = css`
  display: block;
  width: 100%;
  padding: 6px 8px;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 11px;
  color: #374151;
  transition: background 0.15s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

export const settingsDropdownItemSelectedStyles = css`
  background: #f3f4f6;
`;

export const actionButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f8f9fa;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  &:active:not(:disabled) {
    background: #e5e7eb;
    transform: translateY(0);
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #f3f4f6;
  }
`;

export const dangerActionButtonStyles = css`
  ${actionButtonStyles}
  color: #dc2626;
  border-color: #fee2e2;
  background: #fef2f2;

  &:hover:not(:disabled) {
    background: #fee2e2;
    border-color: #fecaca;
  }

  &:active:not(:disabled) {
    background: #fecaca;
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
      background: #0f172a;
      border-color: #1e293b;
    }

    ${headerTitleStyles} {
      color: #f1f5f9;
    }

    ${headerSubtitleStyles} {
      color: #64748b;
    }

    ${closeButtonStyles} {
      color: #64748b;

      &:hover {
        background: #1e293b;
        color: #94a3b8;
      }
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

    ${labelStyles} {
      color: #94a3b8;
    }

    ${downloadButtonStyles} {
      background: #1e293b;
      color: #e2e8f0;
      border-color: #334155;

      &:hover:not(:disabled) {
        background: #334155;
        border-color: #475569;
      }

      &:active:not(:disabled) {
        background: #475569;
      }
    }

    ${saveToDirectoryButtonStyles} {
      background: #1e293b;
      color: #818cf8;
      border-color: #334155;

      &:hover:not(:disabled) {
        background: #334155;
        border-color: #475569;
      }

      &:active:not(:disabled) {
        background: #475569;
      }
    }

    ${uploadButtonStyles} {
      background: #1e293b;
      color: #4ade80;
      border-color: #334155;

      &:hover:not(:disabled) {
        background: #334155;
        border-color: #475569;
      }

      &:active:not(:disabled) {
        background: #475569;
      }
    }

    ${dangerButtonStyles} {
      background: #1e293b;
      color: #f87171;
      border-color: #334155;

      &:hover {
        background: #334155;
        border-color: #475569;
      }

      &:active {
        background: #475569;
      }
    }

    ${successMessageStyles} {
      background: #064e3b;
      color: #6ee7b7;
      border-color: #065f46;
    }

    ${errorMessageStyles} {
      background: #7f1d1d;
      color: #fca5a5;
      border-color: #991b1b;
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
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

      &:hover {
        background: #334155;
        border-color: #475569;
      }
    }

    ${badgeStyles} {
      background: #334155;
      color: #94a3b8;
    }

    ${settingsDropdownStyles} {
      background: #1e293b;
      border-color: #334155;
    }

    ${settingsDropdownHeaderStyles} {
      color: #64748b;
      border-color: #334155;
    }

    ${settingsDropdownItemStyles} {
      color: #e2e8f0;

      &:hover {
        background: #334155;
      }
    }
  }
`;
