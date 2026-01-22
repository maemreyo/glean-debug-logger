import type { LogEntry, LogMetadata, LogRecorderConfig, ExportFormat } from '../../types';
import { generateFilename } from '../../utils';
import { transformToECS, transformMetadataToECS } from '../../utils/ecsTransform';
import { stringifyJSONL } from '../../utils/jsonl';
import { FileService } from '../../services/FileService';

export interface ExportOptions {
  format?: ExportFormat;
  customFilename?: string | null;
  includeMetadata: boolean;
  fileNameTemplate: string;
  environment: string;
  userId: string | null;
  sessionId: string | null;
}

export function createExportHandler(
  logsRef: React.MutableRefObject<LogEntry[]>,
  metadataRef: React.MutableRefObject<LogMetadata>,
  safeStringify: (obj: unknown) => string,
  updateMetadata: () => void
): (format?: ExportFormat, customFilename?: string | null) => string | null {
  return (format?: ExportFormat, customFilename?: string | null): string | null => {
    if (typeof window === 'undefined') return null;

    updateMetadata();
    const config: Partial<LogRecorderConfig> = {
      fileNameTemplate: '{env}_{userId}_{sessionId}_{timestamp}',
      environment: metadataRef.current.environment || 'unknown',
      userId: metadataRef.current.userId,
      sessionId: null,
    };

    let filename =
      customFilename ||
      generateFilename(format as 'json' | 'txt' | undefined, {}, config as LogRecorderConfig);

    let content: string;
    let mimeType: string;

    if (format === 'json') {
      const output = metadataRef.current
        ? { metadata: metadataRef.current, logs: logsRef.current }
        : logsRef.current;
      content = safeStringify(output);
      mimeType = 'application/json';
    } else if (format === 'jsonl') {
      const ecsLogs = logsRef.current.map((log) => transformToECS(log, metadataRef.current));
      content = stringifyJSONL(ecsLogs);
      mimeType = 'application/x-ndjson';
      filename = customFilename || generateFilename('jsonl' as any, {}, config);
    } else if (format === 'ecs.json') {
      const output = {
        metadata: transformMetadataToECS(metadataRef.current),
        logs: logsRef.current.map((log) => transformToECS(log, metadataRef.current)),
      };
      content = JSON.stringify(output, null, 2);
      mimeType = 'application/json';
      filename = customFilename || generateFilename('ecs-json' as any, {}, config);
    } else if (format === 'ai.txt') {
      const meta = metadataRef.current;
      const metaSection = `# METADATA
service.name=${meta.environment || 'unknown'}
user.id=${meta.userId || 'anonymous'}
timestamp=${new Date().toISOString()}

# LOGS
`;

      const logLines = logsRef.current.map((log) => {
        const ecs = transformToECS(log, meta);
        const timestamp = ecs['@timestamp'];
        const level = ecs.log?.level || 'info';
        const category = ecs.event?.category?.[0] || 'unknown';

        let line = `[${timestamp}] ${level} ${category}`;

        if (ecs.message) {
          line += ` | message="${ecs.message}"`;
        }
        if (ecs.http?.request?.method) {
          line += ` | req.method=${ecs.http.request.method}`;
        }
        if (ecs.url?.full) {
          line += ` | url=${ecs.url.full}`;
        }
        if (ecs.http?.response?.status_code) {
          line += ` | res.status=${ecs.http.response.status_code}`;
        }
        if (ecs.error?.message) {
          line += ` | error="${ecs.error.message}"`;
        }

        return line;
      });

      content = metaSection + logLines.join('\n');
      mimeType = 'text/plain';
      filename = customFilename || generateFilename('ai-txt' as any, {}, config);
    } else {
      const metaHeader = metadataRef.current
        ? `${'='.repeat(80)}\nMETADATA\n${'='.repeat(80)}\n${safeStringify(
            metadataRef.current
          )}\n${'='.repeat(80)}\n\n`
        : '';
      content =
        metaHeader +
        logsRef.current
          .map((log) => `[${log.time}] ${log.type}\n${safeStringify(log)}\n${'='.repeat(80)}`)
          .join('\n');
      mimeType = 'text/plain';
    }

    FileService.downloadWithFallback(content, filename, mimeType);
    return filename;
  };
}
