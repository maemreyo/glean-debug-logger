import { stringifyJSONL, stringifyJSONLItem, parseJSONL, parseJSONLStream } from '../jsonl';

describe('JSONL Utility', () => {
  describe('stringifyJSONL', () => {
    it('converts array of objects to JSONL format', () => {
      const input = [{ a: 1 }, { b: 2 }];
      const result = stringifyJSONL(input);
      expect(result).toBe('{"a":1}\n{"b":2}\n');
    });

    it('handles empty array', () => {
      expect(stringifyJSONL([])).toBe('');
    });

    it('handles objects with special characters', () => {
      const input = [{ message: 'Hello 世界 🌍' }];
      const result = stringifyJSONL(input);
      expect(result).toContain('Hello 世界 🌍');
    });

    it('handles nested objects', () => {
      const input = [{ nested: { deep: { value: 42 } } }];
      const result = stringifyJSONL(input);
      expect(result).toContain('{"nested":{"deep":{"value":42}}}');
    });

    it('handles arrays in objects', () => {
      const input = [{ tags: ['a', 'b', 'c'] }];
      const result = stringifyJSONL(input);
      expect(result).toContain('"tags":["a","b","c"]');
    });
  });

  describe('stringifyJSONLItem', () => {
    it('adds newline to single object', () => {
      const result = stringifyJSONLItem({ x: 1 });
      expect(result).toBe('{"x":1}\n');
    });
  });

  describe('parseJSONL', () => {
    it('parses JSONL string to array', () => {
      const input = '{"a":1}\n{"b":2}\n';
      const result = parseJSONL(input);
      expect(result).toEqual([{ a: 1 }, { b: 2 }]);
    });

    it('handles empty string', () => {
      expect(parseJSONL('')).toEqual([]);
    });

    it('handles single line without trailing newline', () => {
      const result = parseJSONL('{"x":1}');
      expect(result).toEqual([{ x: 1 }]);
    });

    it('handles special characters', () => {
      const input = '{"message":"Hello 世界 🌍"}\n';
      const result = parseJSONL(input);
      expect(result[0].message).toBe('Hello 世界 🌍');
    });
  });

  describe('parseJSONLStream', () => {
    it('calls callback for each item', () => {
      const input = '{"a":1}\n{"b":2}\n';
      const results: object[] = [];
      parseJSONLStream(input, (item) => results.push(item));
      expect(results).toEqual([{ a: 1 }, { b: 2 }]);
    });

    it('handles empty input', () => {
      const results: object[] = [];
      parseJSONLStream('', (item) => results.push(item));
      expect(results).toEqual([]);
    });
  });
});
