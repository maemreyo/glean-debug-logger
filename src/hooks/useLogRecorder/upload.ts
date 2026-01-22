import type { LogEntry, LogMetadata, LogRecorderConfig } from '../../types';
import { generateFilename } from '../../utils';

export interface UploadOptions {
  uploadEndpoint: string | null;
  fileNameTemplate: string;
  environment: string;
  userId: string | null;
  sessionId: string | null;
}

export function createUploadHandler(
  logsRef: React.MutableRefObject<LogEntry[]>,
  metadataRef: React.MutableRefObject<LogMetadata>,
  safeStringify: (obj: unknown) => string,
  updateMetadata: () => void
): (
  customEndpoint?: string | null
) => Promise<{ success: boolean; data?: unknown; error?: string }> {
  return async (
    customEndpoint?: string | null
  ): Promise<{ success: boolean; data?: unknown; error?: string }> => {
    const endpoint = customEndpoint;

    if (!endpoint) {
      return { success: false, error: 'No endpoint configured' };
    }

    try {
      updateMetadata();
      const config: Partial<LogRecorderConfig> = {
        fileNameTemplate: '{env}_{userId}_{sessionId}_{timestamp}',
        environment: metadataRef.current.environment || 'unknown',
        userId: metadataRef.current.userId,
        sessionId: null,
      };
      const payload = {
        metadata: metadataRef.current,
        logs: logsRef.current,
        fileName: generateFilename('json', {}, config as LogRecorderConfig),
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: safeStringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[useLogRecorder] Failed to upload logs:', error);
      return { success: false, error: errorMessage };
    }
  };
}
