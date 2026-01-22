import { css } from 'goober';

// ============================================
// DESIGN SYSTEM - Glassmorphism & Refined
// ============================================

// CSS Variables for consistent theming
const theme = {
  // Glass effect colors
  glassBg: 'rgba(255, 255, 255, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',
  glassShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',

  // Refined color palette - warm, sophisticated
  colors: {
    primary: '#1a1a2e',
    secondary: '#4a5568',
    muted: '#a0aec0',
    background: '#f7fafc',
    surface: '#ffffff',
    border: 'rgba(0, 0, 0, 0.06)',

    // Semantic colors - subtle and refined
    success: '#059669',
    successBg: 'rgba(5, 150, 105, 0.08)',
    successBorder: 'rgba(5, 150, 105, 0.2)',

    error: '#dc2626',
    errorBg: 'rgba(220, 38, 38, 0.06)',
    errorBorder: 'rgba(220, 38, 38, 0.15)',

    warning: '#d97706',
    warningBg: 'rgba(217, 119, 6, 0.06)',
    warningBorder: 'rgba(217, 119, 6, 0.15)',

    accent: '#0ea5e9',
    accentBg: 'rgba(14, 165, 233, 0.08)',
    accentBorder: 'rgba(14, 165, 233, 0.2)',
  },

  // Typography
  fonts: {
    display: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },

  // Spacing
  space: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },

  // Border radius
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    full: '9999px',
  },

  // Transitions
  transitions: {
    fast: '0.15s ease',
    normal: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ============================================
// TOGGLE BUTTON - Floating Pill Design
// ============================================
export const toggleButtonStyles = css`
  position: fixed;
  bottom: ${theme.space.lg};
  right: ${theme.space.lg};
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${theme.colors.primary};
  color: #ffffff;
  border: none;
  border-radius: ${theme.radius.full};
  cursor: pointer;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.45),
      0 0 0 1px rgba(255, 255, 255, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      0 2px 10px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }
`;

// Subtle indicator dot for errors - soft red with blur
export const indicatorDotStyles = css`
  position: absolute;
  top: -1px;
  right: -1px;
  width: 8px;
  height: 8px;
  background: ${theme.colors.error};
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.radius.full};
  box-shadow: 0 1px 4px rgba(220, 38, 38, 0.4);
`;

export const badgeStyles = css`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${theme.radius.full};
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(4px);
`;

export const errorBadgeStyles = css`
  background: ${theme.colors.error};
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${theme.radius.full};
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
`;

// ============================================
// PANEL - Glassmorphism Container
// ============================================
export const panelStyles = css`
  position: fixed;
  bottom: 90px;
  right: ${theme.space.lg};
  z-index: 9999;
  width: 380px;
  max-height: 520px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background: ${theme.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.glassBorder};
  box-shadow: ${theme.glassShadow};
  font-family: ${theme.fonts.display};
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

// ============================================
// HEADER - Clean & Minimal
// ============================================
export const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.space.lg};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%);
  border-bottom: 1px solid ${theme.colors.border};
`;

export const headerTitleWrapperStyles = css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const headerTitleStyles = css`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.primary};
  letter-spacing: -0.01em;
`;

export const headerSubtitleStyles = css`
  margin: 0;
  font-size: 11px;
  color: ${theme.colors.muted};
  font-family: ${theme.fonts.mono};
  font-weight: 500;
`;

export const closeButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.muted};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${theme.colors.secondary};
  }
`;

// ============================================
// SESSION TOOLTIP - Compact info popup
// ============================================
export const sessionTooltipStyles = css`
  position: fixed;
  top: auto;
  left: auto;
  margin-top: ${theme.space.xs};
  min-width: 180px;
  max-width: 220px;
  padding: ${theme.space.sm} ${theme.space.md};
  background: ${theme.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${theme.glassBorder};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.glassShadow};
  z-index: 10000;
  font-size: 11px;
  line-height: 1.6;
  pointer-events: none;
`;

export const sessionTooltipRowStyles = css`
  display: flex;
  justify-content: space-between;
  gap: ${theme.space.md};
  padding: ${theme.space.xs} 0;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const sessionTooltipLabelStyles = css`
  color: ${theme.colors.muted};
  font-weight: 500;
`;

export const sessionTooltipValueStyles = css`
  color: ${theme.colors.primary};
  font-weight: 500;
  text-align: right;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// ============================================
// STATS - Elegant Metrics Display
// ============================================
export const statsGridStyles = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: ${theme.colors.border};
`;

export const statItemStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.space.lg};
  background: rgba(255, 255, 255, 0.6);
  gap: ${theme.space.xs};
`;

export const statValueStyles = css`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.primary};
  line-height: 1;
  letter-spacing: -0.03em;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`;

export const statLabelStyles = css`
  font-size: 10px;
  font-weight: 600;
  color: ${theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const errorValueStyles = css`
  color: ${theme.colors.error};
`;

export const networkErrorValueStyles = css`
  color: ${theme.colors.warning};
`;

// ============================================
// DETAILS & SESSION INFO
// ============================================
export const detailsStyles = css`
  padding: ${theme.space.md} ${theme.space.lg};
  background: rgba(255, 255, 255, 0.4);
  border-bottom: 1px solid ${theme.colors.border};
`;

export const summaryStyles = css`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: ${theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  list-style: none;
  padding: ${theme.space.sm} 0;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    color: ${theme.colors.primary};
  }
`;

export const sessionInfoStyles = css`
  margin-top: ${theme.space.md};
  padding: ${theme.space.md};
  background: rgba(255, 255, 255, 0.5);
  border-radius: ${theme.radius.md};
  font-size: 11px;
  color: ${theme.colors.secondary};
  line-height: 1.7;

  & > div {
    display: flex;
    gap: ${theme.space.sm};
    margin-bottom: ${theme.space.xs};
  }

  strong {
    color: ${theme.colors.primary};
    font-weight: 600;
    min-width: 70px;
  }
`;

// ============================================
// ACTIONS - Icon-Based Button Grid
// ============================================
export const actionsStyles = css`
  padding: ${theme.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.lg};
  background: rgba(255, 255, 255, 0.3);
`;

export const actionGroupStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const labelStyles = css`
  font-size: 10px;
  font-weight: 600;
  color: ${theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const buttonRowStyles = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.space.sm};
`;

export const buttonGrid3Styles = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.space.sm};
`;

// Base action button style
const baseButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.xs};
  padding: ${theme.space.sm} ${theme.space.md};
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  color: ${theme.colors.secondary};
  transition: all ${theme.transitions.fast};

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const downloadButtonStyles = css`
  ${baseButtonStyles}
`;

export const saveToDirectoryButtonStyles = css`
  ${baseButtonStyles}
  background: ${theme.colors.accentBg};
  border-color: ${theme.colors.accentBorder};
  color: ${theme.colors.accent};

  &:hover:not(:disabled) {
    background: ${theme.colors.accent};
    color: #ffffff;
    border-color: ${theme.colors.accent};
  }
`;

export const uploadButtonStyles = css`
  ${baseButtonStyles}
  background: ${theme.colors.successBg};
  border-color: ${theme.colors.successBorder};
  color: ${theme.colors.success};

  &:hover:not(:disabled) {
    background: ${theme.colors.success};
    color: #ffffff;
    border-color: ${theme.colors.success};
  }
`;

export const dangerButtonStyles = css`
  ${baseButtonStyles}
  background: ${theme.colors.errorBg};
  border-color: ${theme.colors.errorBorder};
  color: ${theme.colors.error};

  &:hover:not(:disabled) {
    background: ${theme.colors.error};
    color: #ffffff;
    border-color: ${theme.colors.error};
  }
`;

// ============================================
// ACTION BUTTONS (Copy, Download, Upload) - Column layout
// ============================================
export const actionButtonStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${theme.space.md} ${theme.space.sm};
  min-height: 52px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: ${theme.colors.secondary};
  line-height: 1.2;
  transition: all ${theme.transitions.fast};

  & svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const dangerActionButtonStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${theme.space.md} ${theme.space.sm};
  min-height: 52px;
  background: ${theme.colors.errorBg};
  border: 1px solid ${theme.colors.errorBorder};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  font-size: 10px;
  font-weight: 500;
  color: ${theme.colors.error};
  line-height: 1.2;
  transition: all ${theme.transitions.fast};

  & svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &:hover:not(:disabled) {
    background: ${theme.colors.error};
    color: #ffffff;
    border-color: ${theme.colors.error};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ============================================
// STATUS MESSAGES - Compact Toast Style
// ============================================
export const statusContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  padding: 0 ${theme.space.lg} ${theme.space.sm};
`;

export const successMessageStyles = css`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.sm} ${theme.space.md};
  background: ${theme.colors.successBg};
  border: 1px solid ${theme.colors.successBorder};
  border-radius: ${theme.radius.md};
  font-size: 11px;
  color: ${theme.colors.success};
  font-weight: 500;

  & svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

export const errorMessageStyles = css`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  padding: ${theme.space.sm} ${theme.space.md};
  background: ${theme.colors.errorBg};
  border: 1px solid ${theme.colors.errorBorder};
  border-radius: ${theme.radius.md};
  font-size: 11px;
  color: ${theme.colors.error};
  font-weight: 500;

  & svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

export const statusMessageContentStyles = css`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// ============================================
// FOOTER - Subtle Hint
// ============================================
export const footerStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.space.md};
  background: rgba(255, 255, 255, 0.5);
  border-top: 1px solid ${theme.colors.border};

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: ${theme.radius.sm};
    font-family: ${theme.fonts.mono};
    font-size: 10px;
    color: ${theme.colors.muted};
    border: 1px solid ${theme.colors.border};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }
`;

export const footerTipStyles = css`
  font-size: 11px;
  color: ${theme.colors.muted};
`;

// ============================================
// SETTINGS DROPDOWN
// ============================================
export const settingsDropdownStyles = css`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${theme.space.sm};
  min-width: 160px;
  background: ${theme.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${theme.glassBorder};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.glassShadow};
  z-index: 10000;
  overflow: hidden;
`;

export const settingsDropdownHeaderStyles = css`
  padding: ${theme.space.sm} ${theme.space.md};
  font-size: 10px;
  font-weight: 600;
  color: ${theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid ${theme.colors.border};
`;

export const settingsDropdownItemStyles = css`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  width: 100%;
  padding: ${theme.space.sm} ${theme.space.md};
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: ${theme.colors.secondary};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

export const settingsDropdownItemSelectedStyles = css`
  ${settingsDropdownItemStyles}
  background: rgba(0, 0, 0, 0.04);
  color: ${theme.colors.primary};
`;

// ============================================
// DARK MODE - Sophisticated Dark Theme
// ============================================
export const darkModeStyles = css`
  @media (prefers-color-scheme: dark) {
    :root {
      --glass-bg: rgba(30, 30, 46, 0.85);
      --glass-border: rgba(255, 255, 255, 0.08);
    }

    ${panelStyles} {
      background: rgba(30, 30, 46, 0.9);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    ${headerStyles} {
      background: linear-gradient(135deg, rgba(40, 40, 60, 0.8) 0%, rgba(30, 30, 46, 0.6) 100%);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${headerTitleStyles} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${headerSubtitleStyles} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${closeButtonStyles} {
      color: rgba(255, 255, 255, 0.4);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
      }
    }

    ${sessionTooltipStyles} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${sessionTooltipLabelStyles} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${sessionTooltipValueStyles} {
      color: rgba(255, 255, 255, 0.9);
    }

    ${statsGridStyles} {
      background: rgba(255, 255, 255, 0.06);
    }

    ${statItemStyles} {
      background: rgba(40, 40, 60, 0.5);
    }

    ${statValueStyles} {
      color: rgba(255, 255, 255, 0.95);
    }

    ${statLabelStyles} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${detailsStyles} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${summaryStyles} {
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    ${sessionInfoStyles} {
      background: rgba(40, 40, 60, 0.5);
      color: rgba(255, 255, 255, 0.6);

      strong {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    ${actionsStyles} {
      background: rgba(40, 40, 60, 0.3);
    }

    ${labelStyles} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${baseButtonStyles} {
      background: rgba(50, 50, 70, 0.8);
      border-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);

      &:hover:not(:disabled) {
        background: rgba(60, 60, 85, 0.9);
        border-color: rgba(255, 255, 255, 0.12);
      }
    }

    ${saveToDirectoryButtonStyles} {
      background: rgba(14, 165, 233, 0.15);
      border-color: rgba(14, 165, 233, 0.25);
      color: #38bdf8;

      &:hover:not(:disabled) {
        background: #0ea5e9;
        color: #ffffff;
        border-color: #0ea5e9;
      }
    }

    ${uploadButtonStyles} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;

      &:hover:not(:disabled) {
        background: #059669;
        color: #ffffff;
        border-color: #059669;
      }
    }

    ${dangerButtonStyles},
    ${dangerActionButtonStyles} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;

      &:hover:not(:disabled) {
        background: #dc2626;
        color: #ffffff;
        border-color: #dc2626;
      }
    }

    ${successMessageStyles} {
      background: rgba(5, 150, 105, 0.15);
      border-color: rgba(5, 150, 105, 0.25);
      color: #34d399;
    }

    ${errorMessageStyles} {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.25);
      color: #f87171;
    }

    ${footerStyles} {
      background: rgba(40, 40, 60, 0.4);
      border-color: rgba(255, 255, 255, 0.06);

      kbd {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.5);
      }
    }

    ${footerTipStyles} {
      color: rgba(255, 255, 255, 0.4);
    }

    ${toggleButtonStyles} {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
      box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.05);

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        box-shadow:
          0 6px 20px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 255, 255, 0.08);
      }
    }

    ${settingsDropdownStyles} {
      background: rgba(30, 30, 46, 0.95);
      border-color: rgba(255, 255, 255, 0.08);
    }

    ${settingsDropdownHeaderStyles} {
      background: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.06);
    }

    ${settingsDropdownItemStyles} {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    ${settingsDropdownItemSelectedStyles} {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.95);
    }
  }
`;
