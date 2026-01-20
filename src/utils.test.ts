import { describe, it, expect } from "vitest";
import {
  sanitizeData,
  sanitizeFilename,
  generateSessionId,
  generateFilename,
} from "./utils";

describe("sanitizeData", () => {
  it("should redact sensitive keys", () => {
    const data = {
      username: "testuser",
      password: "secret123",
      token: "abc123xyz",
      apiKey: "key123",
      nested: {
        password: "nestedSecret",
        name: "John",
      },
    };

    const result = sanitizeData(data);

    expect(result.username).toBe("testuser");
    expect(result.password).toBe("***REDACTED***");
    expect(result.token).toBe("***REDACTED***");
    expect(result.apiKey).toBe("***REDACTED***");
    expect((result.nested as Record<string, unknown>).password).toBe(
      "***REDACTED***",
    );
    expect((result.nested as Record<string, unknown>).name).toBe("John");
  });

  it("should handle non-object data", () => {
    expect(sanitizeData("string")).toBe("string");
    expect(sanitizeData(123)).toBe(123);
    expect(sanitizeData(null)).toBe(null);
    expect(sanitizeData(undefined)).toBe(undefined);
  });

  it("should handle arrays", () => {
    const data = [{ password: "pass1" }, { token: "token2" }];

    const result = sanitizeData(data);

    expect((result[0] as Record<string, unknown>).password).toBe(
      "***REDACTED***",
    );
    expect((result[1] as Record<string, unknown>).token).toBe("***REDACTED***");
  });

  it("should handle case-insensitive keys", () => {
    const data = {
      PASSWORD: "secret",
      Password: "another",
      PasswordS: "partial",
    };

    const result = sanitizeData(data);

    expect((result as Record<string, unknown>).PASSWORD).toBe("***REDACTED***");
    expect((result as Record<string, unknown>).Password).toBe("***REDACTED***");
  });
});

describe("sanitizeFilename", () => {
  it("should preserve valid filename characters", () => {
    expect(sanitizeFilename("file-name")).toBe("file-name");
    expect(sanitizeFilename("file_name")).toBe("file_name");
    expect(sanitizeFilename("file123")).toBe("file123");
  });

  it("should replace invalid characters with underscores", () => {
    const result = sanitizeFilename("file:name");
    expect(result).toContain("file");
    expect(result).toContain("name");
  });

  it("should collapse multiple underscores", () => {
    expect(sanitizeFilename("file___name")).toBe("file_name");
  });
});

describe("generateSessionId", () => {
  it("should generate a session ID with correct format", () => {
    const id = generateSessionId();

    expect(id).toMatch(/^session_\d+_[a-z0-9]+$/);
  });

  it("should generate unique IDs", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateSessionId());
    }
    expect(ids.size).toBe(100);
  });
});

describe("generateFilename", () => {
  it("should generate filename with template", () => {
    const filename = generateFilename(
      "json",
      {},
      {
        fileNameTemplate: "{env}_{userId}_{timestamp}",
        environment: "production",
        userId: "user123",
        sessionId: "session456",
      },
    );

    // Check that it starts with production_user123_ and ends with .json
    expect(filename.startsWith("production_user123_")).toBe(true);
    expect(filename.endsWith(".json")).toBe(true);
  });

  it("should include all placeholders in output", () => {
    const filename = generateFilename(
      "json",
      {},
      {
        fileNameTemplate:
          "{env}_{date}_{time}_{userId}_{sessionId}_{browser}_{platform}",
        environment: "development",
        userId: "test",
        sessionId: "abc",
        browser: "chrome",
        platform: "MacIntel",
      },
    );

    expect(filename).toContain("development_");
    expect(filename).toContain("_test_");
    expect(filename).toContain("_abc_");
    expect(filename).toContain("_chrome_");
    expect(filename).toContain("MacIntel");
  });

  it("should handle custom format", () => {
    const filename = generateFilename(
      "txt",
      {},
      {
        fileNameTemplate: "debug_{timestamp}",
      },
    );

    // Check it starts with debug_ and ends with .txt
    expect(filename.startsWith("debug_")).toBe(true);
    expect(filename.endsWith(".txt")).toBe(true);
  });

  it("should sanitize special characters in values", () => {
    const filename = generateFilename(
      "json",
      {},
      {
        fileNameTemplate: "{userId}_{timestamp}",
        userId: "user@example.com",
      },
    );

    expect(filename).toContain("user_example_com_");
    expect(filename).not.toContain("@");
  });

  it("should default to anonymous user", () => {
    const filename = generateFilename(
      "json",
      {},
      {
        fileNameTemplate: "{userId}_{timestamp}",
      },
    );

    expect(filename).toContain("anonymous_");
  });

  it("should default to development environment", () => {
    const filename = generateFilename(
      "json",
      {},
      {
        fileNameTemplate: "{env}_{timestamp}",
      },
    );

    expect(filename).toContain("development_");
  });

  it("should append correct file extension", () => {
    const jsonFile = generateFilename("json", {}, {});
    const txtFile = generateFilename("txt", {}, {});

    expect(jsonFile.endsWith(".json")).toBe(true);
    expect(txtFile.endsWith(".txt")).toBe(true);
  });
});
