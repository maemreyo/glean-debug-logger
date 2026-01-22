import { useState, useEffect } from 'react';

export type CopyFormat = 'json' | 'ecs.json' | 'ai.txt';

const COPY_FORMAT_STORAGE_KEY = 'debug-panel-copy-format';
const VALID_FORMATS: CopyFormat[] = ['json', 'ecs.json', 'ai.txt'];

export interface UseCopyFormatReturn {
  copyFormat: CopyFormat;
  setCopyFormat: (format: CopyFormat) => void;
}

export function useCopyFormat(): UseCopyFormatReturn {
  const [copyFormat, setCopyFormat] = useState<CopyFormat>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COPY_FORMAT_STORAGE_KEY);
      if (saved && VALID_FORMATS.includes(saved as CopyFormat)) {
        return saved as CopyFormat;
      }
    }
    return 'ecs.json'; // Default to ECS JSON (AI-friendly)
  });

  // Save copy format to localStorage
  useEffect(() => {
    localStorage.setItem(COPY_FORMAT_STORAGE_KEY, copyFormat);
  }, [copyFormat]);

  return { copyFormat, setCopyFormat };
}
