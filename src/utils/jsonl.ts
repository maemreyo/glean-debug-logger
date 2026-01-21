/**
 * JSONL (JSON Lines) utility functions for line-delimited JSON formatting.
 *
 * JSONL is a text format where each line is a valid JSON object.
 * This makes it efficient for streaming and processing large datasets.
 *
 * @module utils/jsonl
 */

/**
 * Convert an array of objects to JSONL format (one JSON object per line).
 *
 * @param items - Array of objects to stringify
 * @returns JSONL string with each object on its own line, or empty string for empty array
 *
 * @example
 * ```ts
 * stringifyJSONL([{a:1}, {b:2}])
 * // Returns: '{"a":1}\n{"b":2}\n'
 * ```
 */
export function stringifyJSONL(items: object[]): string {
  if (!items || items.length === 0) {
    return '';
  }

  return items.map((item) => stringifyJSONLItem(item)).join('');
}

/**
 * Convert a single object to JSONL line (adds newline).
 *
 * @param item - Object to stringify
 * @returns JSONL line ending with newline
 *
 * @example
 * ```ts
 * stringifyJSONLItem({a: 1})
 * // Returns: '{"a":1}\n'
 * ```
 */
export function stringifyJSONLItem(item: object): string {
  return JSON.stringify(item) + '\n';
}

/**
 * Parse JSONL string to array of objects.
 *
 * Splits input by newlines and parses each line as JSON.
 * Invalid lines are skipped (logged as errors in development).
 *
 * @param input - JSONL string to parse
 * @returns Array of parsed objects
 *
 * @example
 * ```ts
 * parseJSONL('{"a":1}\n{"b":2}\n')
 * // Returns: [{a:1}, {b:2}]
 * ```
 */
export function parseJSONL(input: string): object[] {
  if (!input || input.trim() === '') {
    return [];
  }

  const lines = input.split('\n').filter((line) => line.trim() !== '');
  const result: object[] = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      result.push(parsed);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[jsonl] Failed to parse line: ${line}`, error);
      }
    }
  }

  return result;
}

/**
 * Parse JSONL with streaming callback (memory efficient for large files).
 *
 * Processes each line with a callback without allocating the entire result array.
 * This is more memory-efficient for processing large JSONL files.
 *
 * @param input - JSONL string to parse
 * @param callback - Function called for each parsed object with the object and its index
 *
 * @example
 * ```ts
 * parseJSONLStream('{"a":1}\n{"b":2}\n', (item, index) => {
 *   console.log(`Item ${index}:`, item);
 * });
 * ```
 */
export function parseJSONLStream(
  input: string,
  callback: (item: object, index: number) => void
): void {
  if (!input || input.trim() === '') {
    return;
  }

  const lines = input.split('\n').filter((line) => line.trim() !== '');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line) continue;

    try {
      const parsed = JSON.parse(line);
      callback(parsed, i);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[jsonl] Failed to parse line ${i}: ${line}`, error);
      }
    }
  }
}
