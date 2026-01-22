import { useEffect, useState } from 'react';

export type StatusType = 'success' | 'error';

export interface StatusMessage {
  type: StatusType;
  message: string;
}

export interface UseStatusMessagesReturn {
  uploadStatus: StatusMessage | null;
  setUploadStatus: (status: StatusMessage | null) => void;
  directoryStatus: StatusMessage | null;
  setDirectoryStatus: (status: StatusMessage | null) => void;
  copyStatus: StatusMessage | null;
  setCopyStatus: (status: StatusMessage | null) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

export function useStatusMessages(): UseStatusMessagesReturn {
  const [uploadStatus, setUploadStatus] = useState<StatusMessage | null>(null);
  const [directoryStatus, setDirectoryStatus] = useState<StatusMessage | null>(null);
  const [copyStatus, setCopyStatus] = useState<StatusMessage | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Auto-clear status messages after 3 seconds
  useEffect(() => {
    if (uploadStatus) {
      const timer = setTimeout(() => {
        setUploadStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [uploadStatus]);

  useEffect(() => {
    if (directoryStatus) {
      const timer = setTimeout(() => {
        setDirectoryStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [directoryStatus]);

  useEffect(() => {
    if (copyStatus) {
      const timer = setTimeout(() => {
        setCopyStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [copyStatus]);

  return {
    uploadStatus,
    setUploadStatus,
    directoryStatus,
    setDirectoryStatus,
    copyStatus,
    setCopyStatus,
    showSettings,
    setShowSettings,
  };
}
