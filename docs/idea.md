giải quyết 2 vấn đề:
Tên file "khoa học" với metadata đầy đủ
Path tải về (có giải pháp workaround vì browser restriction)

```
// hooks/useLogRecorder.js
import { useEffect, useRef, useCallback } from 'react';

// ============= CONFIG =============
const DEFAULT_CONFIG = {
  maxLogs: 1000,
  enablePersistence: true,
  persistenceKey: 'debug_logs',
  captureConsole: true,
  captureFetch: true,
  captureXHR: true,
  sanitizeKeys: ['password', 'token', 'apiKey', 'secret', 'authorization'],
  excludeUrls: [],
  
  // 🆕 File naming config
  fileNameTemplate: '{env}_{userId}_{sessionId}_{timestamp}',
  environment: process.env.NODE_ENV || 'development',
  userId: null,           // Set manually hoặc từ auth
  sessionId: null,        // Auto-generate nếu null
  includeMetadata: true,  // Thêm metadata vào file
  
  // 🆕 Upload config (optional)
  uploadEndpoint: null,   // URL để upload logs
  uploadOnError: false,   // Auto upload khi có error
};

export const useLogRecorder = (customConfig = {}) => {
  const config = { ...DEFAULT_CONFIG, ...customConfig };
  const logsRef = useRef([]);
  const isInitialized = useRef(false);
  const sessionIdRef = useRef(config.sessionId || generateSessionId());
  const metadataRef = useRef({});

  // ============= HELPER FUNCTIONS =============
  
  function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  function sanitizeFilename(name) {
    // Loại bỏ ký tự không hợp lệ cho filename
    return name.replace(/[^a-z0-9_\-]/gi, '_').replace(/_+/g, '_');
  }

  function generateFileName(format = 'json', customData = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '-');
    
    // Build filename từ template
    let filename = config.fileNameTemplate
      .replace('{env}', sanitizeFilename(config.environment))
      .replace('{userId}', sanitizeFilename(config.userId || 'anonymous'))
      .replace('{sessionId}', sanitizeFilename(sessionIdRef.current))
      .replace('{timestamp}', timestamp)
      .replace('{date}', date)
      .replace('{time}', time)
      .replace('{errorCount}', String(customData.errorCount || 0))
      .replace('{logCount}', String(logsRef.current.length))
      .replace('{browser}', sanitizeFilename(customData.browser || getBrowserInfo()))
      .replace('{platform}', sanitizeFilename(customData.platform || navigator.platform))
      .replace('{url}', sanitizeFilename(customData.currentUrl || window.location.pathname.replace(/\//g, '_')));

    return `${filename}.${format}`;
  }

  function getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'chrome';
    if (ua.includes('Firefox')) return 'firefox';
    if (ua.includes('Safari')) return 'safari';
    if (ua.includes('Edge')) return 'edge';
    return 'unknown';
  }

  function collectMetadata() {
    return {
      sessionId: sessionIdRef.current,
      environment: config.environment,
      userId: config.userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      browser: getBrowserInfo(),
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      url: window.location.href,
      referrer: document.referrer,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      logCount: logsRef.current.length,
      errorCount: logsRef.current.filter(l => l.type === 'CONSOLE' && l.level === 'ERROR').length,
      networkErrorCount: logsRef.current.filter(l => l.type === 'FETCH_ERR' || l.type === 'XHR_ERR').length,
    };
  }

  const safeStringify = (obj) => {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
      }
      return value;
    });
  };

  const sanitizeData = (data) => {
    if (!data || typeof data !== 'object') return data;
    
    const sanitized = Array.isArray(data) ? [...data] : { ...data };
    
    const sanitizeRecursive = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      
      for (const key in obj) {
        const lowerKey = key.toLowerCase();
        if (config.sanitizeKeys.some(k => lowerKey.includes(k.toLowerCase()))) {
          obj[key] = '***REDACTED***';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = sanitizeRecursive(obj[key]);
        }
      }
      return obj;
    };
    
    return sanitizeRecursive(sanitized);
  };

  const addLog = useCallback((logEntry) => {
    logsRef.current.push(logEntry);
    
    if (logsRef.current.length > config.maxLogs) {
      logsRef.current.shift();
    }
    
    if (config.enablePersistence) {
      try {
        localStorage.setItem(
          config.persistenceKey,
          safeStringify(logsRef.current)
        );
      } catch (e) {
        console.warn('Failed to persist logs:', e);
      }
    }
  }, [config.maxLogs, config.enablePersistence, config.persistenceKey]);

  // ============= LOAD PERSISTED LOGS =============
  useEffect(() => {
    if (config.enablePersistence && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(config.persistenceKey);
        if (stored) {
          logsRef.current = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to load persisted logs:', e);
      }
    }
  }, [config.enablePersistence, config.persistenceKey]);

  // ============= INTERCEPTORS =============
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return;
    isInitialized.current = true;

    const cleanupFns = [];

    // Console Interceptor
    if (config.captureConsole) {
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
        debug: console.debug,
      };

      const captureConsole = (level, args) => {
        try {
          const data = args.map(arg => {
            if (typeof arg === 'object') {
              try {
                return safeStringify(arg);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ');

          addLog({
            type: 'CONSOLE',
            level: level.toUpperCase(),
            time: new Date().toISOString(),
            data: data.substring(0, 5000),
          });
        } catch (e) {
          // Silent fail
        }
      };

      Object.keys(originalConsole).forEach(level => {
        console[level] = (...args) => {
          captureConsole(level, args);
          originalConsole[level].apply(console, args);
        };
      });

      cleanupFns.push(() => {
        Object.keys(originalConsole).forEach(level => {
          console[level] = originalConsole[level];
        });
      });
    }

    // Fetch Interceptor
    if (config.captureFetch) {
      const originalFetch = window.fetch;

      window.fetch = async (...args) => {
        const [resource, options] = args;
        const url = typeof resource === 'string' ? resource : resource.url;
        
        if (config.excludeUrls.some(excluded => url.includes(excluded))) {
          return originalFetch(...args);
        }

        const startTime = Date.now();
        const requestId = Math.random().toString(36).substring(7);

        try {
          let requestBody = null;
          if (options?.body) {
            try {
              requestBody = typeof options.body === 'string' 
                ? JSON.parse(options.body) 
                : options.body;
              requestBody = sanitizeData(requestBody);
            } catch {
              requestBody = String(options.body).substring(0, 1000);
            }
          }

          addLog({
            type: 'FETCH_REQ',
            id: requestId,
            url: url,
            method: options?.method || 'GET',
            headers: sanitizeData(options?.headers),
            body: requestBody,
            time: new Date().toISOString(),
          });

          const response = await originalFetch(...args);
          
          const clone = response.clone();
          let responseBody = null;
          
          try {
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
              responseBody = await clone.json();
              responseBody = sanitizeData(responseBody);
            } else {
              const text = await clone.text();
              responseBody = text.substring(0, 1000);
            }
          } catch {
            responseBody = '[Unable to parse response]';
          }

          addLog({
            type: 'FETCH_RES',
            id: requestId,
            url: url,
            status: response.status,
            statusText: response.statusText,
            duration: `${Date.now() - startTime}ms`,
            body: responseBody,
            time: new Date().toISOString(),
          });

          return response;
        } catch (error) {
          addLog({
            type: 'FETCH_ERR',
            id: requestId,
            url: url,
            error: error.toString(),
            duration: `${Date.now() - startTime}ms`,
            time: new Date().toISOString(),
          });
          throw error;
        }
      };

      cleanupFns.push(() => {
        window.fetch = originalFetch;
      });
    }

    // XHR Interceptor
    if (config.captureXHR) {
      const OriginalXHR = window.XMLHttpRequest;
      
      window.XMLHttpRequest = function() {
        const xhr = new OriginalXHR();
        const requestId = Math.random().toString(36).substring(7);
        let method, url, requestBody;
        const startTime = Date.now();

        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        const originalSetRequestHeader = xhr.setRequestHeader;
        
        const headers = {};

        xhr.setRequestHeader = function(header, value) {
          headers[header] = value;
          return originalSetRequestHeader.apply(xhr, arguments);
        };

        xhr.open = function(m, u) {
          method = m;
          url = u;
          
          if (config.excludeUrls.some(excluded => url.includes(excluded))) {
            return originalOpen.apply(xhr, arguments);
          }
          
          return originalOpen.apply(xhr, arguments);
        };

        xhr.send = function(body) {
          requestBody = body;

          if (!config.excludeUrls.some(excluded => url?.includes(excluded))) {
            let parsedBody = null;
            if (body) {
              try {
                parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
                parsedBody = sanitizeData(parsedBody);
              } catch {
                parsedBody = String(body).substring(0, 1000);
              }
            }

            addLog({
              type: 'XHR_REQ',
              id: requestId,
              url: url,
              method: method,
              headers: sanitizeData(headers),
              body: parsedBody,
              time: new Date().toISOString(),
            });

            xhr.addEventListener('load', function() {
              let responseBody = null;
              try {
                const contentType = xhr.getResponseHeader('content-type');
                if (contentType?.includes('application/json')) {
                  responseBody = JSON.parse(xhr.responseText);
                  responseBody = sanitizeData(responseBody);
                } else {
                  responseBody = xhr.responseText.substring(0, 1000);
                }
              } catch {
                responseBody = '[Unable to parse response]';
              }

              addLog({
                type: 'XHR_RES',
                id: requestId,
                url: url,
                status: xhr.status,
                statusText: xhr.statusText,
                duration: `${Date.now() - startTime}ms`,
                body: responseBody,
                time: new Date().toISOString(),
              });
            });

            xhr.addEventListener('error', function() {
              addLog({
                type: 'XHR_ERR',
                id: requestId,
                url: url,
                error: 'Network request failed',
                duration: `${Date.now() - startTime}ms`,
                time: new Date().toISOString(),
              });
            });
          }

          return originalSend.apply(xhr, arguments);
        };

        return xhr;
      };

      cleanupFns.push(() => {
        window.XMLHttpRequest = OriginalXHR;
      });
    }

    return () => {
      cleanupFns.forEach(fn => fn());
      isInitialized.current = false;
    };
  }, [config, addLog]);

  // ============= PUBLIC API =============
  
  const downloadLogs = useCallback((format = 'json', customFilename = null) => {
    try {
      const metadata = collectMetadata();
      const filename = customFilename || generateFileName(format, metadata);
      
      let content, mimeType;

      if (format === 'json') {
        const output = config.includeMetadata 
          ? { metadata, logs: logsRef.current }
          : logsRef.current;
        
        content = safeStringify(output, null, 2);
        mimeType = 'application/json';
      } else {
        const metaHeader = config.includeMetadata 
          ? `${'='.repeat(80)}\nMETADATA\n${'='.repeat(80)}\n${safeStringify(metadata, null, 2)}\n${'='.repeat(80)}\n\n`
          : '';
        
        content = metaHeader + logsRef.current.map(log => 
          `[${log.time}] ${log.type} ${log.level || ''}\n${safeStringify(log, null, 2)}\n${'='.repeat(80)}`
        ).join('\n');
        mimeType = 'text/plain';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return filename; // Return filename cho reference
    } catch (error) {
      console.error('Failed to download logs:', error);
      return null;
    }
  }, [config.fileNameTemplate, config.includeMetadata]);

  const uploadLogs = useCallback(async (customEndpoint = null) => {
    const endpoint = customEndpoint || config.uploadEndpoint;
    
    if (!endpoint) {
      console.error('No upload endpoint configured');
      return { success: false, error: 'No endpoint' };
    }

    try {
      const metadata = collectMetadata();
      const payload = {
        metadata,
        logs: logsRef.current,
        fileName: generateFileName('json', metadata),
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
      console.error('Failed to upload logs:', error);
      return { success: false, error: error.message };
    }
  }, [config.uploadEndpoint]);

  const clearLogs = useCallback(() => {
    logsRef.current = [];
    if (config.enablePersistence) {
      try {
        localStorage.removeItem(config.persistenceKey);
      } catch (e) {
        console.warn('Failed to clear persisted logs:', e);
      }
    }
  }, [config.enablePersistence, config.persistenceKey]);

  const getLogs = useCallback(() => {
    return [...logsRef.current];
  }, []);

  const getLogCount = useCallback(() => {
    return logsRef.current.length;
  }, []);

  const getMetadata = useCallback(() => {
    return collectMetadata();
  }, []);

  return {
    downloadLogs,
    uploadLogs,
    clearLogs,
    getLogs,
    getLogCount,
    getMetadata,
    sessionId: sessionIdRef.current,
  };
};
```

Filenaming:
```
# 📁 File Naming & Upload Configuration Guide

## 🎯 Vấn đề về Download Path

**⚠️ Quan trọng:** Browser KHÔNG cho phép JavaScript set custom download path (vì lý do security). 

File sẽ luôn tải về thư mục **Downloads** mặc định của user, NHƯNG bạn có thể:
1. ✅ **Đặt tên file "khoa học"** với metadata đầy đủ
2. ✅ **Upload lên server** và lưu vào path tùy ý
3. ✅ **Suggest user config browser** để auto-save vào folder cụ thể

---

## 📝 File Naming Template

### Template Syntax

Sử dụng placeholders trong `fileNameTemplate`:

```javascript
const config = {
  fileNameTemplate: '{env}_{userId}_{sessionId}_{timestamp}',
  // Kết quả: production_user123_session_abc_2024-01-20T10-30-45.json
};
```

### Available Placeholders

| Placeholder | Mô tả | Ví dụ |
|------------|-------|-------|
| `{env}` | Environment | `production`, `staging`, `development` |
| `{userId}` | User ID | `user123`, `anonymous` |
| `{sessionId}` | Session ID (auto-generated) | `session_1705742345_xyz` |
| `{timestamp}` | ISO timestamp | `2024-01-20T10-30-45` |
| `{date}` | Date only | `2024-01-20` |
| `{time}` | Time only | `10-30-45` |
| `{errorCount}` | Số lượng errors | `5` |
| `{logCount}` | Số lượng logs | `1234` |
| `{browser}` | Browser name | `chrome`, `firefox`, `safari` |
| `{platform}` | OS platform | `MacIntel`, `Win32`, `Linux` |
| `{url}` | Current URL path | `_dashboard_users` |

---

## 🎨 File Naming Examples

### Example 1: Production Debug (Recommended)
```javascript
{
  fileNameTemplate: '{env}_{date}_{time}_{userId}_{errorCount}errors',
  environment: 'production',
  userId: user?.id || 'guest',
  includeMetadata: true,
}

// Output: production_2024-01-20_14-35-22_user789_3errors.json
```

### Example 2: Customer Support
```javascript
{
  fileNameTemplate: 'support_{userId}_{sessionId}_{browser}',
  userId: user?.email?.replace('@', '_at_'),
  includeMetadata: true,
}

// Output: support_john_at_example.com_session_abc123_chrome.json
```

### Example 3: Error Report
```javascript
{
  fileNameTemplate: 'error_report_{date}_{url}_{errorCount}err_{logCount}logs',
  includeMetadata: true,
}

// Output: error_report_2024-01-20__checkout_payment_5err_234logs.json
```

### Example 4: Session Recording
```javascript
{
  fileNameTemplate: 'session_{userId}_{sessionId}_{timestamp}',
  userId: getUserId(), // Từ auth state
  sessionId: 'custom_session_id', // Hoặc để null để auto-generate
  includeMetadata: true,
}

// Output: session_user456_custom_session_id_2024-01-20T14-35-22.json
```

### Example 5: A/B Testing Debug
```javascript
{
  fileNameTemplate: '{env}_{userId}_variant{variantId}_{timestamp}',
  environment: process.env.NEXT_PUBLIC_ENV,
  userId: user?.id,
  // Thêm custom data
}

// Trong component:
const filename = generateCustomFilename({
  variantId: experimentVariant,
});

// Output: staging_user123_variantB_2024-01-20T14-35-22.json
```

---

## 🚀 Upload lên Server (Alternative to Download)

Thay vì download file, upload lên server để lưu vào path tùy ý.

### Backend Example (Next.js API Route)

```javascript
// app/api/logs/upload/route.js
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const { metadata, logs, fileName } = await request.json();
    
    // Tạo folder structure theo ý bạn
    const basePath = path.join(process.cwd(), 'logs');
    const datePath = new Date().toISOString().split('T')[0]; // 2024-01-20
    const userPath = metadata.userId || 'anonymous';
    
    // Path: logs/2024-01-20/user123/production_user123_session_abc.json
    const fullPath = path.join(basePath, datePath, userPath);
    
    await mkdir(fullPath, { recursive: true });
    
    const filePath = path.join(fullPath, fileName);
    await writeFile(filePath, JSON.stringify({ metadata, logs }, null, 2));
    
    return Response.json({ 
      success: true, 
      path: filePath,
      url: `/logs/${datePath}/${userPath}/${fileName}` 
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

### Frontend Usage

```javascript
const { uploadLogs } = useLogRecorder({
  uploadEndpoint: '/api/logs/upload',
  fileNameTemplate: '{env}_{userId}_{timestamp}',
  environment: 'production',
  userId: user?.id,
});

// Upload thay vì download
const result = await uploadLogs();
if (result.success) {
  alert(`Logs đã upload: ${result.data.url}`);
}
```

### Upload với Custom Endpoint

```javascript
// Upload to external service (e.g., S3, CloudFlare R2)
const result = await uploadLogs('https://your-api.com/logs/upload');
```

---

## 🗂️ Server-side Path Organization Examples

### Example 1: By Date & User
```
logs/
├── 2024-01-20/
│   ├── user123/
│   │   ├── production_user123_session_abc_10-30-45.json
│   │   └── production_user123_session_xyz_14-20-10.json
│   └── user456/
│       └── staging_user456_session_def_09-15-30.json
└── 2024-01-21/
    └── guest/
        └── development_anonymous_session_ghi_11-00-00.json
```

### Example 2: By Environment & Error Type
```
logs/
├── production/
│   ├── errors/
│   │   └── error_report_2024-01-20_5err.json
│   └── sessions/
│       └── session_user123_2024-01-20.json
├── staging/
└── development/
```

### Example 3: By Project & Feature
```
logs/
├── project-ecommerce/
│   ├── checkout/
│   │   └── production_checkout_2024-01-20_user123.json
│   └── cart/
│       └── staging_cart_2024-01-20_user456.json
└── project-dashboard/
    └── analytics/
        └── development_analytics_2024-01-20.json
```

---

## 🎛️ Complete Config Examples

### Scenario 1: Production với Auto-Upload
```javascript
const { uploadLogs, downloadLogs } = useLogRecorder({
  // File naming
  fileNameTemplate: '{env}_{date}_{userId}_{errorCount}errors',
  environment: 'production',
  userId: user?.id || 'guest',
  includeMetadata: true,
  
  // Upload config
  uploadEndpoint: '/api/logs/upload',
  uploadOnError: true, // Auto upload khi có error
  
  // Other settings
  maxLogs: 2000,
  sanitizeKeys: ['password', 'token', 'creditCard'],
});

// Trong error boundary
componentDidCatch(error) {
  uploadLogs(); // Auto upload
}
```

### Scenario 2: Customer Support với Metadata đầy đủ
```javascript
const { downloadLogs, getMetadata } = useLogRecorder({
  fileNameTemplate: 'support_{userId}_{timestamp}_ticket{ticketId}',
  userId: user?.email,
  includeMetadata: true,
  
  // Metadata sẽ bao gồm:
  // - sessionId, environment, userId
  // - browser, platform, screenResolution
  // - url, referrer, timezone
  // - logCount, errorCount, networkErrorCount
});

// User báo bug → Download với ticket ID
function handleBugReport(ticketId) {
  const filename = downloadLogs('json', 
    `support_${user.email}_${Date.now()}_ticket${ticketId}.json`
  );
  console.log('Downloaded:', filename);
}
```

### Scenario 3: Dev Debug với Custom Naming
```javascript
const { downloadLogs } = useLogRecorder({
  fileNameTemplate: 'dev_{url}_{timestamp}',
  includeMetadata: false, // Không cần metadata cho dev
  maxLogs: 500,
});

// Download với tên custom
downloadLogs('json', `debug_${featureName}_${Date.now()}.json`);
```

---

## 💡 Pro Tips

### 1. Browser Auto-Save Configuration
Suggest user config browser để auto-save vào folder:

**Chrome:**
```
Settings → Downloads → 
☑️ Ask where to save each file before downloading
```

Hoặc set default folder là project folder.

### 2. Sanitize Filename
Code đã tự động sanitize filename (loại bỏ `:`, `/`, `\`, v.v.)

```javascript
// Email: john@example.com
// → Filename: john_example_com

// URL: /checkout/payment
// → Filename: _checkout_payment
```

### 3. Include Metadata
Set `includeMetadata: true` để file JSON có structure:

```json
{
  "metadata": {
    "sessionId": "session_abc123",
    "userId": "user789",
    "browser": "chrome",
    "errorCount": 3,
    "...": "..."
  },
  "logs": [
    { "type": "CONSOLE", "..." },
    { "type": "FETCH_REQ", "..." }
  ]
}
```

### 4. Generate Filename Programmatically
```javascript
const { downloadLogs, getMetadata } = useLogRecorder({
  fileNameTemplate: '{env}_{userId}_{timestamp}',
});

// Get metadata trước
const meta = getMetadata();

// Custom filename
const customName = `bug_report_${meta.browser}_${meta.errorCount}errors_${Date.now()}.json`;
downloadLogs('json', customName);
```

---

## 🔐 Security Notes

1. **Sanitize user input** trong filename (đã có trong code)
2. **Validate upload endpoint** (check CORS, auth)
3. **Rate limit uploads** để tránh spam
4. **Encrypt sensitive logs** trước khi upload (optional)

---

## ✅ Checklist

- [ ] Set `fileNameTemplate` phù hợp với use case
- [ ] Config `environment`, `userId` từ auth state
- [ ] Set `uploadEndpoint` nếu cần upload lên server
- [ ] Test filename output trước khi deploy
- [ ] Review `includeMetadata` có cần không
- [ ] Config `sanitizeKeys` cho sensitive fields
- [ ] Document naming convention cho team

**Done! 🎉 Giờ files của bạn sẽ có tên "khoa học" và dễ quản lý!**
```

Backend upload:
```
// ==========================================
// OPTION 1: Next.js API Route (File System)
// ==========================================

// app/api/logs/upload/route.js
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { metadata, logs, fileName } = await request.json();
    
    // Validate
    if (!metadata || !logs || !fileName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Tạo folder structure: logs/YYYY-MM-DD/userId/
    const basePath = path.join(process.cwd(), 'logs');
    const date = new Date().toISOString().split('T')[0];
    const userId = metadata.userId || 'anonymous';
    const environment = metadata.environment || 'unknown';
    
    // Path: logs/production/2024-01-20/user123/
    const fullPath = path.join(basePath, environment, date, userId);
    
    // Tạo folders nếu chưa có
    await mkdir(fullPath, { recursive: true });
    
    // Lưu file
    const filePath = path.join(fullPath, fileName);
    const content = JSON.stringify({ metadata, logs }, null, 2);
    await writeFile(filePath, content, 'utf-8');
    
    // Return URL để access file (nếu cần)
    const publicUrl = `/logs/${environment}/${date}/${userId}/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      path: filePath,
      url: publicUrl,
      metadata: {
        size: Buffer.byteLength(content, 'utf-8'),
        logCount: logs.length,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


// ==========================================
// OPTION 2: Upload to S3 (AWS)
// ==========================================

// app/api/logs/upload-s3/route.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    const { metadata, logs, fileName } = await request.json();
    
    // S3 key structure: environment/YYYY-MM-DD/userId/filename
    const date = new Date().toISOString().split('T')[0];
    const userId = metadata.userId || 'anonymous';
    const environment = metadata.environment || 'unknown';
    
    const s3Key = `${environment}/${date}/${userId}/${fileName}`;
    
    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: JSON.stringify({ metadata, logs }, null, 2),
      ContentType: 'application/json',
      Metadata: {
        userId: userId,
        environment: environment,
        logCount: String(logs.length),
        errorCount: String(metadata.errorCount || 0),
      },
    });

    await s3Client.send(command);
    
    // Generate presigned URL (optional - cho download)
    const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    
    return NextResponse.json({
      success: true,
      url: s3Url,
      key: s3Key,
      metadata: {
        logCount: logs.length,
        size: JSON.stringify({ metadata, logs }).length,
      }
    });
  } catch (error) {
    console.error('S3 upload failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


// ==========================================
// OPTION 3: Upload to Supabase Storage
// ==========================================

// app/api/logs/upload-supabase/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { metadata, logs, fileName } = await request.json();
    
    // Path structure: environment/userId/YYYY-MM-DD/filename
    const date = new Date().toISOString().split('T')[0];
    const userId = metadata.userId || 'anonymous';
    const environment = metadata.environment || 'unknown';
    
    const storagePath = `${environment}/${userId}/${date}/${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('debug-logs')
      .upload(storagePath, JSON.stringify({ metadata, logs }, null, 2), {
        contentType: 'application/json',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('debug-logs')
      .getPublicUrl(storagePath);

    // Optional: Save metadata to database
    await supabase.from('log_metadata').insert({
      user_id: userId,
      environment: environment,
      file_path: storagePath,
      file_name: fileName,
      log_count: logs.length,
      error_count: metadata.errorCount || 0,
      session_id: metadata.sessionId,
      uploaded_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: storagePath,
    });
  } catch (error) {
    console.error('Supabase upload failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


// ==========================================
// OPTION 4: Upload to Database (PostgreSQL)
// ==========================================

// app/api/logs/upload-db/route.js
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { metadata, logs, fileName } = await request.json();
    
    // Insert vào database
    const result = await sql`
      INSERT INTO debug_logs (
        user_id,
        session_id,
        environment,
        file_name,
        metadata,
        logs,
        log_count,
        error_count,
        created_at
      ) VALUES (
        ${metadata.userId || 'anonymous'},
        ${metadata.sessionId},
        ${metadata.environment || 'unknown'},
        ${fileName},
        ${JSON.stringify(metadata)},
        ${JSON.stringify(logs)},
        ${logs.length},
        ${metadata.errorCount || 0},
        NOW()
      )
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
      metadata: {
        logCount: logs.length,
        errorCount: metadata.errorCount || 0,
      }
    });
  } catch (error) {
    console.error('Database upload failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Database Schema (PostgreSQL):
/*
CREATE TABLE debug_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  environment VARCHAR(50),
  file_name VARCHAR(500),
  metadata JSONB,
  logs JSONB,
  log_count INTEGER,
  error_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_environment (environment),
  INDEX idx_created_at (created_at)
);
*/


// ==========================================
// OPTION 5: Advanced - với Rate Limiting & Auth
// ==========================================

// app/api/logs/upload-secure/route.js
import { rateLimit } from '@/lib/rate-limit';
import { verifyAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Rate limiter: max 10 uploads per hour per user
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

export async function POST(request) {
  try {
    // 1. Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Rate limiting
    try {
      await limiter.check(10, user.id); // 10 requests per hour
    } catch {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // 3. Validate payload size (max 5MB)
    const { metadata, logs, fileName } = await request.json();
    const payloadSize = JSON.stringify({ metadata, logs }).length;
    
    if (payloadSize > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Payload too large (max 5MB)' },
        { status: 413 }
      );
    }

    // 4. Validate filename
    const sanitizedFileName = fileName.replace(/[^a-z0-9_\-\.]/gi, '_');
    
    // 5. Upload logic (choose one from above)
    // ... S3, Supabase, or File System ...

    return NextResponse.json({
      success: true,
      // ... response data
    });
  } catch (error) {
    console.error('Secure upload failed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


// ==========================================
// Helper: Rate Limiter Implementation
// ==========================================

// lib/rate-limit.js
import LRU from 'lru-cache';

export function rateLimit(options) {
  const tokenCache = new LRU({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (limit, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || 0;
        
        if (tokenCount >= limit) {
          reject(new Error('Rate limit exceeded'));
        } else {
          tokenCache.set(token, tokenCount + 1);
          resolve();
        }
      }),
  };
}


// ==========================================
// Frontend Usage Examples
// ==========================================

// Example 1: Upload to File System
const { uploadLogs } = useLogRecorder({
  uploadEndpoint: '/api/logs/upload',
});

await uploadLogs();


// Example 2: Upload to S3
const { uploadLogs } = useLogRecorder({
  uploadEndpoint: '/api/logs/upload-s3',
  fileNameTemplate: '{env}_{userId}_{timestamp}',
  environment: 'production',
  userId: user?.id,
});

const result = await uploadLogs();
if (result.success) {
  console.log('Uploaded to S3:', result.url);
}


// Example 3: Upload với custom endpoint & error handling
async function handleErrorReport() {
  try {
    const result = await uploadLogs('/api/logs/upload-supabase');
    
    if (result.success) {
      alert('Log uploaded successfully!');
      // Optionally send URL to support team
      await fetch('/api/support/notify', {
        method: 'POST',
        body: JSON.stringify({ logUrl: result.url }),
      });
    } else {
      console.error('Upload failed:', result.error);
      // Fallback: download locally
      downloadLogs('json');
    }
  } catch (error) {
    console.error('Error uploading logs:', error);
    // Fallback
    downloadLogs('json');
  }
}


// Example 4: Auto-upload on error
useEffect(() => {
  const errorHandler = async (event) => {
    console.error('Global error:', event.error);
    
    // Auto upload logs
    const result = await uploadLogs();
    
    if (result.success) {
      // Notify user
      toast.error('Error logged. Our team has been notified.');
    }
  };

  window.addEventListener('error', errorHandler);
  return () => window.removeEventListener('error', errorHandler);
}, [uploadLogs]);
```

debug panel:
```
// components/DebugPanel.jsx
"use client";

import { useState, useEffect } from 'react';
import { useLogRecorder } from '../hooks/useLogRecorder';

export default function DebugPanel({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  // Advanced config
  const { 
    downloadLogs, 
    uploadLogs, 
    clearLogs, 
    getLogCount, 
    getMetadata,
    sessionId 
  } = useLogRecorder({
    // File naming
    fileNameTemplate: '{env}_{date}_{time}_{userId}_{errorCount}errors',
    environment: process.env.NODE_ENV,
    userId: user?.id || user?.email || 'guest',
    includeMetadata: true,
    
    // Upload config
    uploadEndpoint: '/api/logs/upload',
    
    // Capture settings
    maxLogs: 2000,
    captureConsole: true,
    captureFetch: true,
    captureXHR: true,
    
    // Security
    sanitizeKeys: ['password', 'token', 'apiKey', 'secret', 'authorization', 'creditCard'],
    
    // Exclude analytics
    excludeUrls: [
      '/api/analytics',
      'google-analytics.com',
      'facebook.com',
      'vercel.com',
    ],
  });

  const logCount = getLogCount();
  const metadata = getMetadata();

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Auto-upload on critical errors (optional)
  useEffect(() => {
    const errorHandler = async (event) => {
      if (metadata.errorCount >= 5) {
        // Auto upload when có nhiều errors
        try {
          await uploadLogs();
          console.log('Logs auto-uploaded due to high error count');
        } catch (err) {
          console.error('Failed to auto-upload logs:', err);
        }
      }
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, [metadata.errorCount, uploadLogs]);

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadStatus(null);
    
    try {
      const result = await uploadLogs();
      
      if (result.success) {
        setUploadStatus({ 
          type: 'success', 
          message: `Uploaded successfully! ${result.data?.url || ''}` 
        });
        
        // Optional: Copy URL to clipboard
        if (result.data?.url) {
          await navigator.clipboard.writeText(result.data.url);
        }
      } else {
        setUploadStatus({ 
          type: 'error', 
          message: `Upload failed: ${result.error}` 
        });
      }
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: `Error: ${error.message}` 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (format) => {
    const filename = downloadLogs(format);
    if (filename) {
      setUploadStatus({ 
        type: 'success', 
        message: `Downloaded: ${filename}` 
      });
    }
  };

  // Chỉ hiện trong dev hoặc khi user là admin
  const shouldShow = process.env.NODE_ENV === 'development' || user?.role === 'admin';
  
  if (!shouldShow) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-[9998] px-5 py-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all font-semibold text-sm"
        title="Press Ctrl+Shift+D to toggle"
      >
        🐛 Debug ({logCount})
        {metadata.errorCount > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-red-500 rounded text-xs">
            {metadata.errorCount} errors
          </span>
        )}
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-[9999] bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[600px] overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Debug Logger</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300 text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-300">
              Session: {sessionId.substring(0, 20)}...
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 border-b">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{logCount}</div>
              <div className="text-xs text-gray-600">Total Logs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metadata.errorCount}</div>
              <div className="text-xs text-gray-600">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metadata.networkErrorCount}</div>
              <div className="text-xs text-gray-600">Network Errors</div>
            </div>
          </div>

          {/* Metadata Preview */}
          <div className="p-4 border-b bg-gray-50">
            <details className="text-sm">
              <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                📊 Session Info
              </summary>
              <div className="mt-2 space-y-1 text-xs text-gray-600">
                <div><strong>User:</strong> {metadata.userId || 'Anonymous'}</div>
                <div><strong>Browser:</strong> {metadata.browser} ({metadata.platform})</div>
                <div><strong>Resolution:</strong> {metadata.screenResolution}</div>
                <div><strong>URL:</strong> {metadata.url}</div>
                <div><strong>Timezone:</strong> {metadata.timezone}</div>
              </div>
            </details>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-2">
            {/* Download Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Download Logs</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload('json')}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                >
                  📥 JSON
                </button>
                <button
                  onClick={() => handleDownload('txt')}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                >
                  📄 TXT
                </button>
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Upload to Server</label>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition text-sm font-medium"
              >
                {isUploading ? '⏳ Uploading...' : '☁️ Upload Logs'}
              </button>
            </div>

            {/* Upload Status */}
            {uploadStatus && (
              <div className={`p-3 rounded text-sm ${
                uploadStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {uploadStatus.message}
              </div>
            )}

            {/* Clear Logs */}
            <button
              onClick={() => {
                if (confirm('Clear all logs? This cannot be undone.')) {
                  clearLogs();
                  setUploadStatus(null);
                }
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium"
            >
              🗑️ Clear All Logs
            </button>
          </div>

          {/* Tips */}
          <div className="p-4 bg-gray-50 border-t rounded-b-lg">
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>💡 Tip:</strong> Press <kbd className="px-1 py-0.5 bg-gray-200 rounded">Ctrl+Shift+D</kbd> to toggle</div>
              <div><strong>💾 Auto-save:</strong> Logs persist across page refreshes</div>
              <div><strong>🔒 Security:</strong> Sensitive data is auto-redacted</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


// ==========================================
// Alternative: Minimal Version (No Upload)
// ==========================================

export function DebugPanelMinimal() {
  const [isOpen, setIsOpen] = useState(false);
  const { downloadLogs, clearLogs, getLogCount } = useLogRecorder({
    fileNameTemplate: 'debug_{timestamp}',
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '12px 20px',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        🐛 ({getLogCount()})
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '70px',
          right: '20px',
          zIndex: 9999,
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          width: '300px',
        }}>
          <button onClick={() => downloadLogs('json')} style={{ width: '100%', marginBottom: '8px' }}>
            Download JSON
          </button>
          <button onClick={() => clearLogs()} style={{ width: '100%' }}>
            Clear Logs
          </button>
        </div>
      )}
    </>
  );
}


// ==========================================
// Enterprise: với Analytics Integration
// ==========================================

export function DebugPanelEnterprise({ user, analytics }) {
  const { downloadLogs, uploadLogs, getMetadata } = useLogRecorder({
    fileNameTemplate: '{env}_{userId}_ticket{ticketId}_{timestamp}',
    environment: process.env.NEXT_PUBLIC_ENV,
    userId: user?.id,
  });

  const handleBugReport = async () => {
    // 1. Create support ticket
    const ticket = await analytics.createTicket({
      userId: user.id,
      type: 'bug_report',
      metadata: getMetadata(),
    });

    // 2. Upload logs với ticket ID
    const result = await uploadLogs();

    // 3. Send notification to support team
    if (result.success) {
      await analytics.notifySupport({
        ticketId: ticket.id,
        logUrl: result.data.url,
      });

      alert(`Bug report submitted! Ticket #${ticket.id}`);
    }
  };

  return (
    <button onClick={handleBugReport}>
      🐛 Report Bug
    </button>
  );
}
```

## 📦 Summary - Bạn đã có gì:

### 1️⃣ **Smart File Naming System**
```javascript
// Template với placeholders
fileNameTemplate: '{env}_{date}_{userId}_{errorCount}errors'

// Output: production_2024-01-20_user123_5errors.json
```

**Available placeholders:**
- `{env}`, `{userId}`, `{sessionId}`, `{timestamp}`
- `{date}`, `{time}`, `{errorCount}`, `{logCount}`
- `{browser}`, `{platform}`, `{url}`

### 2️⃣ **Upload to Server** (thay vì download)
Vì browser **KHÔNG CHO** set custom download path, bạn có **5 options**:

| Option | Use Case | Difficulty |
|--------|----------|-----------|
| File System | Simple dev/testing | ⭐ Easy |
| S3/R2 | Production scalable | ⭐⭐ Medium |
| Supabase | Full-stack with DB | ⭐⭐ Medium |
| Database | Query logs later | ⭐⭐ Medium |
| Secure API | Enterprise with auth | ⭐⭐⭐ Advanced |

### 3️⃣ **Metadata-Rich Output**
File JSON bao gồm:
```json
{
  "metadata": {
    "sessionId": "session_abc123",
    "userId": "user789",
    "browser": "chrome",
    "errorCount": 3,
    "networkErrorCount": 1,
    "url": "https://app.com/checkout",
    "...": "..."
  },
  "logs": [...]
}
```

---

## 🚀 Quick Start

### Bước 1: Setup Hook
```javascript
const { downloadLogs, uploadLogs } = useLogRecorder({
  fileNameTemplate: '{env}_{userId}_{timestamp}',
  environment: 'production',
  userId: user?.id,
  uploadEndpoint: '/api/logs/upload', // Optional
});
```

### Bước 2: Add to Layout
```jsx
// app/layout.tsx
<DebugPanel user={user} />
```

### Bước 3: Setup Backend (nếu cần upload)
```javascript
// app/api/logs/upload/route.js
// Copy từ artifact "backend-upload-examples"
```

---

## 💡 Về vấn đề "Path tải về":

**❌ KHÔNG THỂ:** Set custom download folder từ JavaScript (browser security)

**✅ CÓ THỂ:**
1. **Tên file "khoa học"** → ✅ Done (với template system)
2. **Upload lên server** → Lưu vào path tùy ý → ✅ Done (5 options)
3. **Suggest user config browser** → Set default Downloads folder
4. **Enterprise solution** → Build internal dashboard để manage logs

**Recommended approach:**
- **Dev/staging:** Download file với smart naming
- **Production:** Upload lên S3/Supabase với folder structure

---

## 🎯 Các Use Cases đã cover:

✅ Dev debug (download JSON)  
✅ Customer support (upload + ticket ID)  
✅ Production error tracking (auto-upload)  
✅ A/B testing debug (variant ID in filename)  
✅ Enterprise audit logs (database storage)  

====================================================================================================================================================================================================

# 📦 NPM Package Structure - glean-debug-logger

## Folder Structure

```
glean-debug-logger/
├── src/
│   ├── hooks/
│   │   └── useLogRecorder.js          # Main hook
│   ├── components/
│   │   ├── DebugPanel.jsx             # UI component
│   │   └── DebugPanelMinimal.jsx      # Lightweight version
│   ├── utils/
│   │   ├── sanitize.js                # Data sanitization
│   │   ├── naming.js                  # Filename generation
│   │   └── metadata.js                # Metadata collection
│   ├── types/
│   │   └── index.d.ts                 # TypeScript definitions
│   └── index.js                       # Main entry point
├── dist/                               # Build output (gitignored)
├── examples/
│   ├── next-app/                      # Next.js example
│   ├── react-app/                     # React example
│   └── README.md
├── tests/
│   ├── useLogRecorder.test.js
│   └── utils.test.js
├── .github/
│   └── workflows/
│       ├── publish.yml                # Auto publish on tag
│       └── test.yml                   # Run tests on PR
├── .gitignore
├── .npmignore
├── package.json
├── tsup.config.js                     # Build config
├── README.md
├── LICENSE
└── CHANGELOG.md
```

---

## Key Files Setup

### 1. package.json (Complete)

```json
{
  "name": "glean-debug-logger",
  "version": "1.0.0",
  "description": "Production-ready debug logger for React/Next.js with network capture, console logs, and smart file export",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./DebugPanel": {
      "import": "./dist/components/DebugPanel.mjs",
      "require": "./dist/components/DebugPanel.js"
    }
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx}\"",
    "prepublishOnly": "npm run build && npm test",
    "release": "npm run build && npm publish"
  },
  "keywords": [
    "react",
    "nextjs",
    "debug",
    "logger",
    "network",
    "console",
    "monitoring",
    "error-tracking",
    "developer-tools"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/glean-debug-logger.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/glean-debug-logger/issues"
  },
  "homepage": "https://github.com/yourusername/glean-debug-logger#readme",
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  },
  "dependencies": {},
  "engines": {
    "node": ">=14.0.0"
  }
}
```

---

### 2. tsup.config.js (Build Configuration)

```javascript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.js',
    'components/DebugPanel': 'src/components/DebugPanel.jsx',
    'components/DebugPanelMinimal': 'src/components/DebugPanelMinimal.jsx',
  },
  format: ['cjs', 'esm'], // CommonJS + ESM
  dts: true,              // Generate .d.ts files
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  minify: true,
});
```

---

### 3. src/index.js (Main Entry)

```javascript
// Export hook
export { useLogRecorder } from './hooks/useLogRecorder';

// Export components
export { default as DebugPanel } from './components/DebugPanel';
export { default as DebugPanelMinimal } from './components/DebugPanelMinimal';

// Export utilities (optional - for advanced users)
export { sanitizeData } from './utils/sanitize';
export { generateFileName } from './utils/naming';
export { collectMetadata } from './utils/metadata';

// Re-export types
export * from './types';
```

---

### 4. src/types/index.d.ts (TypeScript Definitions)

```typescript
declare module 'glean-debug-logger' {
  import { ReactNode } from 'react';

  export interface LogEntry {
    type: 'CONSOLE' | 'FETCH_REQ' | 'FETCH_RES' | 'FETCH_ERR' | 'XHR_REQ' | 'XHR_RES' | 'XHR_ERR';
    time: string;
    level?: 'LOG' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
    data?: any;
    id?: string;
    url?: string;
    method?: string;
    status?: number;
    duration?: string;
    body?: any;
    headers?: Record<string, string>;
    error?: string;
  }

  export interface Metadata {
    sessionId: string;
    environment: string;
    userId?: string;
    timestamp: string;
    userAgent: string;
    browser: string;
    platform: string;
    language: string;
    screenResolution: string;
    viewport: string;
    url: string;
    referrer: string;
    timezone: string;
    logCount: number;
    errorCount: number;
    networkErrorCount: number;
  }

  export interface LogRecorderConfig {
    maxLogs?: number;
    enablePersistence?: boolean;
    persistenceKey?: string;
    captureConsole?: boolean;
    captureFetch?: boolean;
    captureXHR?: boolean;
    sanitizeKeys?: string[];
    excludeUrls?: string[];
    fileNameTemplate?: string;
    environment?: string;
    userId?: string | null;
    sessionId?: string | null;
    includeMetadata?: boolean;
    uploadEndpoint?: string | null;
    uploadOnError?: boolean;
  }

  export interface UploadResult {
    success: boolean;
    data?: any;
    error?: string;
  }

  export interface UseLogRecorderReturn {
    downloadLogs: (format?: 'json' | 'txt', customFilename?: string | null) => string | null;
    uploadLogs: (customEndpoint?: string | null) => Promise<UploadResult>;
    clearLogs: () => void;
    getLogs: () => LogEntry[];
    getLogCount: () => number;
    getMetadata: () => Metadata;
    sessionId: string;
  }

  export function useLogRecorder(config?: LogRecorderConfig): UseLogRecorderReturn;

  export interface DebugPanelProps {
    user?: {
      id?: string;
      email?: string;
      role?: string;
    };
  }

  export function DebugPanel(props: DebugPanelProps): JSX.Element;
  export function DebugPanelMinimal(): JSX.Element;

  // Utility functions
  export function sanitizeData(data: any, sanitizeKeys?: string[]): any;
  export function generateFileName(format: 'json' | 'txt', customData?: Record<string, any>): string;
  export function collectMetadata(): Metadata;
}
```

---

### 5. .npmignore

```
# Source files
src/

# Tests
tests/
*.test.js
*.spec.js

# Examples
examples/

# Config files
tsup.config.js
vitest.config.js
.eslintrc.js
.prettierrc

# Git files
.git
.gitignore
.github/

# Node
node_modules/

# Build artifacts
*.log
coverage/
.DS_Store
```

---

### 6. README.md (Package Documentation)

```markdown
# glean-debug-logger

🐛 Production-ready debug logger for React/Next.js with network capture, console logs, and smart file export.

## Features

✅ Capture console logs (log, error, warn, info, debug)
✅ Capture network requests (Fetch & XMLHttpRequest)
✅ Auto-sanitize sensitive data
✅ Smart filename generation with templates
✅ Export to JSON/TXT
✅ Upload to server
✅ Persist across page refreshes
✅ TypeScript support
✅ Zero dependencies (peer deps: React only)

## Installation

```bash
npm install glean-debug-logger
# or
yarn add glean-debug-logger
# or
pnpm add glean-debug-logger
```

## Quick Start

### Basic Usage

```jsx
import { useLogRecorder, DebugPanel } from 'glean-debug-logger';

function App() {
  return (
    <>
      <YourApp />
      <DebugPanel />
    </>
  );
}
```

### Advanced Usage

```jsx
import { useLogRecorder } from 'glean-debug-logger';

function MyComponent() {
  const { downloadLogs, uploadLogs } = useLogRecorder({
    fileNameTemplate: '{env}_{userId}_{timestamp}',
    environment: 'production',
    userId: user?.id,
    uploadEndpoint: '/api/logs/upload',
  });

  return (
    <button onClick={() => downloadLogs('json')}>
      Download Debug Logs
    </button>
  );
}
```

## API Reference

### `useLogRecorder(config?)`

[Full API docs here...]

## Examples

See [examples/](./examples) folder for complete examples:
- Next.js App Router
- Next.js Pages Router
- Create React App

## License

MIT © [Your Name]
```

---

### 7. CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-01-20

### Added
- Initial release
- `useLogRecorder` hook
- `DebugPanel` component
- Console log capture
- Network request capture (Fetch + XHR)
- Smart filename generation
- Upload to server support
- TypeScript definitions

## [0.1.0] - 2024-01-15

### Added
- Beta release for testing
```

---

## Publishing Checklist

### Before First Publish

1. **Create npm account**
   ```bash
   npm login
   ```

2. **Check package name availability**
   ```bash
   npm search glean-debug-logger
   ```

3. **Test locally**
   ```bash
   npm link
   # In another project
   npm link glean-debug-logger
   ```

4. **Build package**
   ```bash
   npm run build
   ```

5. **Test build output**
   ```bash
   ls dist/
   # Should see: index.js, index.mjs, index.d.ts, components/...
   ```

6. **Dry run publish**
   ```bash
   npm publish --dry-run
   ```

7. **Publish!**
   ```bash
   npm publish
   ```

---

## Version Management

### Semantic Versioning

- `1.0.0` - Major (breaking changes)
- `1.1.0` - Minor (new features, backwards compatible)
- `1.1.1` - Patch (bug fixes)

### Publishing New Version

```bash
# Patch (1.0.0 → 1.0.1)
npm version patch
git push && git push --tags
npm publish

# Minor (1.0.0 → 1.1.0)
npm version minor
git push && git push --tags
npm publish

# Major (1.0.0 → 2.0.0)
npm version major
git push && git push --tags
npm publish
```

---

## GitHub Actions (Auto Publish)

`.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Testing Before Publish

### Local Testing

```bash
# In your package folder
npm pack

# This creates: glean-debug-logger-1.0.0.tgz

# In test project
npm install /path/to/glean-debug-logger-1.0.0.tgz
```

### Verdaccio (Local npm registry)

```bash
npm install -g verdaccio
verdaccio

# In another terminal
npm adduser --registry http://localhost:4873
npm publish --registry http://localhost:4873

# Test install
npm install glean-debug-logger --registry http://localhost:4873
```

---

## Best Practices

1. ✅ Always use semantic versioning
2. ✅ Update CHANGELOG.md for each release
3. ✅ Add tests before publishing
4. ✅ Keep dependencies minimal
5. ✅ Provide TypeScript definitions
6. ✅ Write comprehensive README
7. ✅ Add examples folder
8. ✅ Use `.npmignore` to keep package size small
9. ✅ Test in real projects before publish
10. ✅ Monitor bundle size (use bundlephobia.com)

==============================================================================

// ==========================================
// 1. tsup.config.js - Build Configuration
// ==========================================

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    // Main entry
    index: 'src/index.js',
    
    // Components (optional exports)
    'components/DebugPanel': 'src/components/DebugPanel.jsx',
    'components/DebugPanelMinimal': 'src/components/DebugPanelMinimal.jsx',
    
    // Utils (for advanced users)
    'utils/sanitize': 'src/utils/sanitize.js',
    'utils/naming': 'src/utils/naming.js',
  },
  
  // Output formats
  format: ['cjs', 'esm'],
  
  // Generate TypeScript definitions
  dts: true,
  
  // Build options
  splitting: false,
  sourcemap: true,
  clean: true,
  
  // External dependencies (don't bundle)
  external: ['react', 'react-dom'],
  
  // Optimization
  treeshake: true,
  minify: true,
  
  // For React JSX
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});


// ==========================================
// 2. vitest.config.js - Test Configuration
// ==========================================

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '*.config.js',
      ],
    },
  },
});


// ==========================================
// 3. .eslintrc.js - Linting
// ==========================================

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};


// ==========================================
// 4. .prettierrc - Code Formatting
// ==========================================

{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "avoid"
}


// ==========================================
// 5. .gitignore
// ==========================================

/*
# Dependencies
node_modules/

# Build output
dist/
*.tgz

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Misc
*.tsbuildinfo
*/


// ==========================================
// 6. .npmignore
// ==========================================

/*
# Source files (don't publish to npm)
src/

# Tests
tests/
*.test.js
*.spec.js
coverage/

# Examples
examples/

# Config files
tsup.config.js
vitest.config.js
.eslintrc.js
.prettierrc

# Git files
.git
.gitignore
.github/

# Node
node_modules/

# Build artifacts
*.log
.DS_Store

# Development files
.vscode/
.idea/
*/


// ==========================================
// 7. src/index.js - Main Entry Point
// ==========================================

// Main hook
export { useLogRecorder } from './hooks/useLogRecorder';

// Components
export { default as DebugPanel } from './components/DebugPanel';
export { default as DebugPanelMinimal } from './components/DebugPanelMinimal';

// Utils (for advanced usage)
export { sanitizeData } from './utils/sanitize';
export { generateFileName } from './utils/naming';
export { collectMetadata } from './utils/metadata';

// Default export for convenience
import { useLogRecorder } from './hooks/useLogRecorder';
export default useLogRecorder;


// ==========================================
// 8. tests/setup.js - Test Setup
// ==========================================

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock browser APIs
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

global.URL.createObjectURL = () => 'blob:mock-url';
global.URL.revokeObjectURL = () => {};


// ==========================================
// 9. tests/useLogRecorder.test.js - Example Test
// ==========================================

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLogRecorder } from '../src/hooks/useLogRecorder';

describe('useLogRecorder', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default config', () => {
    const { result } = renderHook(() => useLogRecorder());
    
    expect(result.current.getLogCount()).toBe(0);
    expect(result.current.sessionId).toBeTruthy();
  });

  it('should capture console logs', () => {
    const { result } = renderHook(() => useLogRecorder());
    
    act(() => {
      console.log('Test log');
    });
    
    const logs = result.current.getLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[logs.length - 1].type).toBe('CONSOLE');
  });

  it('should download logs', () => {
    const { result } = renderHook(() => useLogRecorder());
    
    const createElementSpy = vi.spyOn(document, 'createElement');
    
    act(() => {
      result.current.downloadLogs('json');
    });
    
    expect(createElementSpy).toHaveBeenCalledWith('a');
  });

  it('should clear logs', () => {
    const { result } = renderHook(() => useLogRecorder());
    
    act(() => {
      console.log('Test');
      result.current.clearLogs();
    });
    
    expect(result.current.getLogCount()).toBe(0);
  });
});


// ==========================================
// 10. examples/next-app/package.json
// ==========================================

{
  "name": "example-next-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "glean-debug-logger": "^1.0.0"
  }
}


// ==========================================
// 11. examples/next-app/app/layout.jsx
// ==========================================

import { DebugPanel } from 'glean-debug-logger';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Debug panel - only in development */}
        {process.env.NODE_ENV === 'development' && <DebugPanel />}
      </body>
    </html>
  );
}


// ==========================================
// 12. examples/next-app/app/page.jsx
// ==========================================

'use client';

import { useLogRecorder } from 'glean-debug-logger';

export default function Home() {
  const { downloadLogs, getLogCount } = useLogRecorder({
    fileNameTemplate: '{env}_{timestamp}',
    environment: 'development',
  });

  const handleTest = async () => {
    console.log('Testing debug logger');
    
    // Test API call
    await fetch('https://jsonplaceholder.typicode.com/posts/1');
    
    console.log(`Captured ${getLogCount()} logs`);
  };

  return (
    <main>
      <h1>Debug Logger Example</h1>
      <button onClick={handleTest}>Test Logger</button>
      <button onClick={() => downloadLogs('json')}>Download Logs</button>
    </main>
  );
}


// ==========================================
// 13. .github/workflows/publish.yml
// ==========================================

/*
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      id-token: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build package
        run: npm run build
      
      - name: Publish to NPM
        run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
*/


// ==========================================
// 14. .github/workflows/test.yml
// ==========================================

/*
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
*/


===============


# 🚀 Step-by-Step Publishing Guide

## Prerequisites

### 1. Create npm Account
```bash
# Go to https://www.npmjs.com/signup
# Or via CLI:
npm adduser
```

### 2. Enable 2FA (Highly Recommended)
```bash
# Login to npmjs.com → Account Settings → Two-Factor Authentication
# Choose "Authorization and Publishing" for maximum security
```

### 3. Generate Access Token (for CI/CD)
```bash
# npmjs.com → Account → Access Tokens → Generate New Token
# Type: Automation (for GitHub Actions)
# Save token securely - you'll need it for GitHub Secrets
```

---

## Initial Setup

### Step 1: Create Project Structure
```bash
mkdir glean-debug-logger
cd glean-debug-logger

# Initialize
npm init -y

# Install dev dependencies
npm install -D tsup vitest @testing-library/react @testing-library/react-hooks eslint prettier

# Install peer dependencies (for development)
npm install react react-dom
```

### Step 2: Copy Your Code
```bash
# Create folders
mkdir -p src/hooks src/components src/utils src/types

# Move files (from artifacts)
# - src/hooks/useLogRecorder.js
# - src/components/DebugPanel.jsx
# - src/components/DebugPanelMinimal.jsx
# - src/index.js
# - src/types/index.d.ts
```

### Step 3: Setup Config Files
Copy from the "package-config-files" artifact:
- `tsup.config.js`
- `package.json`
- `.gitignore`
- `.npmignore`
- `.eslintrc.js`
- `.prettierrc`

### Step 4: Update package.json
```json
{
  "name": "glean-debug-logger", // Or your preferred name
  "version": "0.1.0",            // Start with beta
  "description": "Your description here",
  "author": "Your Name <email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/glean-debug-logger.git"
  }
}
```

---

## Testing Locally

### Method 1: npm link
```bash
# In your package directory
npm link

# In your test project
npm link glean-debug-logger

# Test it
import { useLogRecorder } from 'glean-debug-logger';
```

### Method 2: npm pack
```bash
# In your package directory
npm pack

# This creates: glean-debug-logger-0.1.0.tgz

# In your test project
npm install /absolute/path/to/glean-debug-logger-0.1.0.tgz

# Or
npm install ../glean-debug-logger/glean-debug-logger-0.1.0.tgz
```

### Method 3: Verdaccio (Local Registry)
```bash
# Install verdaccio globally
npm install -g verdaccio

# Start local registry
verdaccio
# Server running at http://localhost:4873

# In new terminal, add user
npm adduser --registry http://localhost:4873
# Username: test
# Password: test
# Email: test@test.com

# Publish to local registry
npm publish --registry http://localhost:4873

# In test project, install from local registry
npm install glean-debug-logger --registry http://localhost:4873
```

---

## Publishing to NPM

### Beta Release (First Time)

#### Step 1: Prepare
```bash
# Make sure everything is committed
git status

# Run tests
npm test

# Build
npm run build

# Check dist/ folder
ls -la dist/
```

#### Step 2: Check Package Contents
```bash
# Dry run to see what will be published
npm publish --dry-run

# Should show:
# - dist/
# - package.json
# - README.md
# - LICENSE

# Should NOT show:
# - src/
# - tests/
# - examples/
# - node_modules/
```

#### Step 3: Publish Beta
```bash
# Login to npm (if not already)
npm login

# Publish as beta
npm publish --tag beta

# Success! Package is now live at:
# https://www.npmjs.com/package/glean-debug-logger
```

#### Step 4: Test Beta Installation
```bash
# In another project
npm install glean-debug-logger@beta

# Test it works
```

### Promote to Stable

```bash
# When ready, update version
npm version 1.0.0

# Publish as latest (default tag)
npm publish

# Or explicitly
npm publish --tag latest
```

---

## Version Management

### Semantic Versioning

**Format:** `MAJOR.MINOR.PATCH`

- `MAJOR`: Breaking changes (1.0.0 → 2.0.0)
- `MINOR`: New features, backward compatible (1.0.0 → 1.1.0)
- `PATCH`: Bug fixes (1.0.0 → 1.0.1)

### Using npm version

```bash
# Patch: 1.0.0 → 1.0.1
npm version patch
# Creates git tag v1.0.1

# Minor: 1.0.0 → 1.1.0
npm version minor
# Creates git tag v1.1.0

# Major: 1.0.0 → 2.0.0
npm version major
# Creates git tag v2.0.0

# Push tags
git push && git push --tags

# Publish
npm publish
```

### Pre-release Versions

```bash
# Beta
npm version 1.1.0-beta.0
npm publish --tag beta

# Alpha
npm version 1.1.0-alpha.0
npm publish --tag alpha

# RC (Release Candidate)
npm version 1.1.0-rc.0
npm publish --tag rc
```

---

## GitHub Setup

### Step 1: Create Repository
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/glean-debug-logger.git
git branch -M main
git push -u origin main
```

### Step 2: Add NPM Token to GitHub Secrets
1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Your npm automation token (from npmjs.com)
5. Click "Add secret"

### Step 3: Setup GitHub Actions
Create `.github/workflows/publish.yml` (from artifact)

### Step 4: Publish via GitHub
```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions will automatically:
# 1. Run tests
# 2. Build package
# 3. Publish to npm
```

---

## Post-Publishing

### Step 1: Update README.md on npm
The README.md from your repo will appear on npmjs.com automatically.

### Step 2: Add Badges
```markdown
# In README.md

[![npm version](https://badge.fury.io/js/glean-debug-logger.svg)](https://www.npmjs.com/package/glean-debug-logger)
[![Downloads](https://img.shields.io/npm/dm/glean-debug-logger.svg)](https://www.npmjs.com/package/glean-debug-logger)
[![License](https://img.shields.io/npm/l/glean-debug-logger.svg)](https://github.com/YOUR_USERNAME/glean-debug-logger/blob/main/LICENSE)
```

### Step 3: Monitor Analytics
- npmjs.com → Your package → Stats
- Check download counts, dependents

### Step 4: Respond to Issues
- Enable GitHub Issues
- Monitor for bug reports
- Respond to questions

---

## Common Issues & Solutions

### Issue 1: "Package name already exists"
```bash
# Solution: Choose a different name
# Check availability first:
npm search your-package-name
```

### Issue 2: "You do not have permission to publish"
```bash
# Solution 1: Use scoped package
{
  "name": "@yourusername/glean-debug-logger"
}

# Solution 2: Login again
npm logout
npm login
```

### Issue 3: "Package size too large"
```bash
# Check size
npm pack --dry-run

# Solution: Improve .npmignore
# Make sure src/, tests/, examples/ are excluded
```

### Issue 4: "Module not found" after installation
```bash
# Check exports in package.json
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts"
}

# Make sure dist/ folder is NOT in .npmignore
```

### Issue 5: TypeScript errors in consuming project
```bash
# Make sure you have types:
{
  "types": "./dist/index.d.ts"
}

# And tsup generates .d.ts files:
# tsup.config.js
export default defineConfig({
  dts: true,
});
```

---

## Maintenance Workflow

### Regular Updates

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# ...

# 3. Update version
npm version minor # or patch

# 4. Update CHANGELOG.md
# Document changes

# 5. Commit
git add .
git commit -m "feat: add new feature"

# 6. Push
git push origin feature/new-feature

# 7. Create PR, merge to main

# 8. Tag and publish
git tag v1.1.0
git push origin v1.1.0
# GitHub Actions will auto-publish
```

### Deprecating Versions

```bash
# Deprecate a specific version
npm deprecate glean-debug-logger@1.0.0 "This version has critical bugs. Please upgrade to 1.0.1+"

# Deprecate entire package
npm deprecate glean-debug-logger "Package is no longer maintained. Use alternative-package instead."
```

### Unpublishing (Last Resort)

```bash
# Can only unpublish within 72 hours
npm unpublish glean-debug-logger@1.0.0

# Unpublish entire package (dangerous!)
npm unpublish glean-debug-logger --force
```

---

## Checklist Before Publishing

### Pre-publish Checklist

- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] README.md is complete and accurate
- [ ] LICENSE file exists
- [ ] CHANGELOG.md updated
- [ ] package.json metadata is correct (author, repo, keywords)
- [ ] .npmignore excludes src/, tests/, examples/
- [ ] Version number is correct
- [ ] No sensitive data in code
- [ ] Tested locally (npm link or npm pack)
- [ ] Git repo is clean (no uncommitted changes)
- [ ] TypeScript definitions generated

### Post-publish Checklist

- [ ] Package appears on npmjs.com
- [ ] Installation works (`npm install glean-debug-logger`)
- [ ] Import works in test project
- [ ] TypeScript autocomplete works
- [ ] Documentation is accurate
- [ ] Created GitHub release with release notes
- [ ] Announced on social media (optional)

---

## Quick Commands Reference

```bash
# Development
npm run dev          # Watch mode
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code

# Publishing
npm run build        # Build package
npm publish --dry-run    # Preview publish
npm publish          # Publish to npm
npm version patch    # Bump version

# Testing
npm link             # Link locally
npm pack             # Create tarball

# Maintenance
npm deprecate <pkg>@<version> "message"
npm unpublish <pkg>@<version>
npm owner add <user> <pkg>
```

---

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [tsup Documentation](https://tsup.egoist.dev/)
- [Creating a package.json](https://docs.npmjs.com/creating-a-package-json-file)
- [Publishing scoped packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)

**Good luck with your package! 🚀**


=========
{
  "name": "glean-debug-logger",
  "version": "1.0.0",
  "description": "Production-ready debug logger for React/Next.js apps. Capture console logs, network requests (Fetch + XHR), with smart file export and server upload support. Zero dependencies.",
  
  "keywords": [
    "react",
    "nextjs",
    "debug",
    "logger",
    "debugging",
    "network",
    "console",
    "monitoring",
    "error-tracking",
    "developer-tools",
    "devtools",
    "fetch",
    "xhr",
    "debugging-tool",
    "react-hooks",
    "typescript"
  ],
  
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "url": "https://yourwebsite.com"
  },
  
  "license": "MIT",
  
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourusername/glean-debug-logger.git"
  },
  
  "bugs": {
    "url": "https://github.com/yourusername/glean-debug-logger/issues",
    "email": "bugs@example.com"
  },
  
  "homepage": "https://github.com/yourusername/glean-debug-logger#readme",
  
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./DebugPanel": {
      "types": "./dist/components/DebugPanel.d.ts",
      "import": "./dist/components/DebugPanel.mjs",
      "require": "./dist/components/DebugPanel.js"
    },
    "./DebugPanelMinimal": {
      "types": "./dist/components/DebugPanelMinimal.d.ts",
      "import": "./dist/components/DebugPanelMinimal.mjs",
      "require": "./dist/components/DebugPanelMinimal.js"
    },
    "./utils": {
      "types": "./dist/utils/index.d.ts",
      "import": "./dist/utils/index.mjs",
      "require": "./dist/utils/index.js"
    },
    "./package.json": "./package.json"
  },
  
  "files": [
    "dist",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,md}\"",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run lint && npm run test && npm run build",
    "release": "npm run build && npm publish",
    "release:beta": "npm run build && npm publish --tag beta",
    "size": "size-limit",
    "analyze": "size-limit --why"
  },
  
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
    "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
  },
  
  "peerDependenciesMeta": {
    "react": {
      "optional": false
    },
    "react-dom": {
      "optional": false
    }
  },
  
  "devDependencies": {
    "@size-limit/preset-small-lib": "^11.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/react-hooks": "^8.0.1",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "@vitest/coverage-v8": "^1.0.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "jsdom": "^23.0.0",
    "prettier": "^3.1.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "size-limit": "^11.0.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3",
    "vitest": "^1.0.4"
  },
  
  "dependencies": {},
  
  "size-limit": [
    {
      "path": "dist/index.js",
      "limit": "15 KB"
    },
    {
      "path": "dist/index.mjs",
      "limit": "15 KB"
    }
  ],
  
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  
  "browserslist": [
    "> 0.5%",
    "last 2 versions",
    "not dead",
    "not IE 11"
  ],
  
  "sideEffects": false,
  
  "funding": {
    "type": "github",
    "url": "https://github.com/sponsors/yourusername"
  }
}

==============
# 📦 Package Optimization Guide

## Bundle Size Optimization

### Why Bundle Size Matters

- ⚡ Faster installation times
- 🚀 Better user experience
- 💰 Lower bandwidth costs
- 📊 Higher adoption rate

**Target:** Keep total size under 20 KB (minified + gzipped)

---

## 1. Check Current Size

### Using size-limit

```bash
# Install
npm install -D @size-limit/preset-small-lib size-limit

# Add to package.json
{
  "size-limit": [
    {
      "path": "dist/index.js",
      "limit": "15 KB"
    }
  ]
}

# Run
npm run size

# Output:
# Package size: 12.5 KB
# Size limit:   15 KB
# ✓ Within limit
```

### Using bundlephobia

Visit: https://bundlephobia.com/package/glean-debug-logger

Shows:
- Bundle size (minified)
- Gzip size
- Download time on different connections
- Dependencies tree

### Manual Check

```bash
# Create tarball
npm pack

# Check size
ls -lh glean-debug-logger-1.0.0.tgz

# Extract and check contents
tar -xzf glean-debug-logger-1.0.0.tgz
du -sh package/*
```

---

## 2. Reduce Bundle Size

### Strategy 1: Minimize Dependencies

**❌ Bad: External dependencies**
```json
{
  "dependencies": {
    "lodash": "^4.17.21",
    "moment": "^2.29.4",
    "axios": "^1.6.0"
  }
}
```

**✅ Good: Zero dependencies**
```json
{
  "dependencies": {}
}
```

**Tip:** Use native JavaScript instead of libraries
```javascript
// ❌ Don't use lodash
import _ from 'lodash';
const unique = _.uniq(array);

// ✅ Use native
const unique = [...new Set(array)];
```

### Strategy 2: Tree-shakeable Exports

```javascript
// ✅ Named exports (tree-shakeable)
export { useLogRecorder } from './hooks/useLogRecorder';
export { DebugPanel } from './components/DebugPanel';

// ❌ Default export of object (not tree-shakeable)
export default {
  useLogRecorder,
  DebugPanel,
};
```

### Strategy 3: Code Splitting

```javascript
// tsup.config.js
export default defineConfig({
  entry: {
    index: 'src/index.js',
    'components/DebugPanel': 'src/components/DebugPanel.jsx',
    'utils/index': 'src/utils/index.js',
  },
  splitting: false, // No splitting for small packages
});
```

Users can import only what they need:
```javascript
// Import only hook (lighter)
import { useLogRecorder } from 'glean-debug-logger';

// Import full UI component (heavier)
import { DebugPanel } from 'glean-debug-logger/DebugPanel';
```

### Strategy 4: Minification

```javascript
// tsup.config.js
export default defineConfig({
  minify: true,  // Minify output
  terserOptions: {
    compress: {
      drop_console: true,  // Remove console.logs from package code
      drop_debugger: true,
    },
  },
});
```

### Strategy 5: External Dependencies

```javascript
// tsup.config.js
export default defineConfig({
  external: [
    'react',
    'react-dom',
    // Add any other peer dependencies
  ],
});
```

**Important:** Don't bundle React/React-DOM!

---

## 3. Optimize File Inclusion

### .npmignore Strategy

```
# ✅ Exclude from npm package
src/              # Source files
tests/            # Tests
examples/         # Examples
coverage/         # Test coverage
*.test.js         # Test files
*.spec.js
.github/          # GitHub files
.vscode/          # IDE config
tsconfig.json     # TS config
tsup.config.js    # Build config
vitest.config.js
.eslintrc.js
.prettierrc

# ✅ Include in npm package
dist/             # Built files
README.md
LICENSE
CHANGELOG.md
package.json
```

### Check What Will Be Published

```bash
npm pack --dry-run

# Output shows exactly what files will be included
```

---

## 4. TypeScript Definitions

### Efficient Type Generation

```javascript
// tsup.config.js
export default defineConfig({
  dts: true,        // Generate .d.ts
  dtsOnly: false,   // Generate both .js and .d.ts
});
```

**Tip:** Don't include full type definitions from dependencies
```typescript
// ❌ Bad
import { ComponentProps } from 'react';
export interface MyProps extends ComponentProps<'div'> { ... }

// ✅ Good
export interface MyProps {
  className?: string;
  onClick?: () => void;
  // Explicit props only
}
```

---

## 5. Performance Optimizations

### Lazy Loading Components

```javascript
// For optional heavy components
const DebugPanel = lazy(() => import('./components/DebugPanel'));

// Usage
{showDebug && (
  <Suspense fallback={null}>
    <DebugPanel />
  </Suspense>
)}
```

### Conditional Imports

```javascript
// Only load in development
if (process.env.NODE_ENV === 'development') {
  const { DebugPanel } = await import('glean-debug-logger');
}
```

---

## 6. Build Analysis

### Analyze Bundle Composition

```bash
# Install
npm install -D rollup-plugin-visualizer

# Add to tsup config
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [visualizer()],
});

# Build and view
npm run build
open stats.html
```

### webpack-bundle-analyzer (if using webpack)

```bash
npm install -D webpack-bundle-analyzer

# View analysis
npx webpack-bundle-analyzer dist/stats.json
```

---

## 7. Compression

### Brotli Compression

Modern CDNs serve Brotli-compressed files:

```bash
# Check gzip size
gzip -c dist/index.js | wc -c

# Check brotli size (better compression)
brotli -c dist/index.js | wc -c
```

**Typical sizes:**
- Raw: 50 KB
- Minified: 30 KB
- Gzipped: 10 KB
- Brotli: 8 KB

---

## 8. Best Practices Checklist

### Code Quality
- [ ] No unused imports
- [ ] No console.logs in production code
- [ ] No commented-out code
- [ ] No TODO comments in release

### Dependencies
- [ ] Zero runtime dependencies (if possible)
- [ ] All dependencies in `devDependencies`
- [ ] React/React-DOM in `peerDependencies` only

### Files
- [ ] Only `dist/` folder published
- [ ] Source maps included (for debugging)
- [ ] TypeScript definitions included
- [ ] README.md, LICENSE, CHANGELOG.md included

### Performance
- [ ] Tree-shakeable exports
- [ ] Code minified
- [ ] Total size < 20 KB gzipped
- [ ] No circular dependencies

### Build
- [ ] Build output is clean (no warnings)
- [ ] Both CJS and ESM formats generated
- [ ] TypeScript types generated correctly

---

## 9. Size Comparison

### Before Optimization
```
glean-debug-logger-1.0.0.tgz
├── dist/
│   ├── index.js          (120 KB)
│   ├── index.mjs         (115 KB)
│   └── index.d.ts        (5 KB)
├── src/ (shouldn't be here!)
├── tests/ (shouldn't be here!)
└── node_modules/ (BIG PROBLEM!)

Total: 500 KB
```

### After Optimization
```
glean-debug-logger-1.0.0.tgz
├── dist/
│   ├── index.js          (25 KB)
│   ├── index.mjs         (23 KB)
│   ├── index.d.ts        (3 KB)
│   └── components/
│       ├── DebugPanel.js (15 KB)
│       └── DebugPanel.mjs (14 KB)
├── README.md
├── LICENSE
└── CHANGELOG.md

Total: 80 KB (gzipped: ~18 KB)
```

---

## 10. Monitoring

### Setup GitHub Actions for Size Monitoring

```yaml
# .github/workflows/size-check.yml
name: Size Check

on: [pull_request]

jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

This will comment on PRs with bundle size changes!

### Package Phobia Badge

Add to README.md:
```markdown
![npm bundle size](https://img.shields.io/bundlephobia/min/glean-debug-logger)
![npm bundle size (gzip)](https://img.shields.io/bundlephobia/minzip/glean-debug-logger)
```

---

## Common Pitfalls

### ❌ Pitfall 1: Including node_modules

**Problem:** `.npmignore` doesn't exclude `node_modules/`

**Solution:** 
```
# .npmignore
node_modules/
```

Or use `files` field in package.json (whitelist approach):
```json
{
  "files": ["dist"]
}
```

### ❌ Pitfall 2: Publishing Source Maps to npm

**Problem:** Source maps are huge

**Solution:**
```javascript
// tsup.config.js
export default defineConfig({
  sourcemap: false, // Don't publish source maps
  // Or
  sourcemap: 'inline', // Inline for smaller total size
});
```

### ❌ Pitfall 3: Bundling React

**Problem:** React bundled = 40 KB extra

**Solution:**
```javascript
// tsup.config.js
export default defineConfig({
  external: ['react', 'react-dom'],
});
```

### ❌ Pitfall 4: Multiple Formats

**Problem:** Generating too many formats

**Solution:** Only generate what's needed
```javascript
export default defineConfig({
  format: ['cjs', 'esm'], // Skip UMD if not needed
});
```

---

## Target Sizes by Package Type

| Package Type | Target Size (gzipped) |
|-------------|----------------------|
| Hook only | < 5 KB |
| Hook + Utils | < 10 KB |
| Hook + UI Component | < 20 KB |
| Full library | < 30 KB |

**glean-debug-logger goal:** ~15 KB gzipped

---

## Resources

- [Size Limit](https://github.com/ai/size-limit)
- [Bundlephobia](https://bundlephobia.com)
- [Package Size Analyzer](https://pkg-size.dev/)
- [Bundle Buddy](https://bundle-buddy.com/)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

**Remember:** Every KB counts! Users will thank you for keeping it light. 🚀

=============

Giờ mình nên tạo thêm một file về optimization tips để package nhẹ nhất có thể.
Package Optimization Guide
Document 

Perfect! Giờ mình có đầy đủ tất cả artifacts cần thiết để user có thể đóng gói và publish package. Để tóm tắt lại cho user một cách ngắn gọn và dễ hiểu.
🎉 Perfect! Bạn đã có COMPLETE NPM PACKAGE SETUP rồi đó!

Mình đã tạo cho bạn 7 artifacts chi tiết:
📦 Core Setup

    NPM Package Structure - Folder structure chuẩn
    Package Configuration Files - Tất cả config files (tsup, vitest, eslint, v.v.)
    Complete package.json - Template đầy đủ với metadata
    Publishing Guide - Step-by-step từ A→Z

🚀 Advanced

    Optimization Guide - Làm sao để package nhẹ < 20KB
    Backend Upload Examples - 5 options upload logs lên server
    Debug Panel Example - UI component với đầy đủ features

⚡ Quick Start (TL;DR)
1. Project Structure
bash

glean-debug-logger/
├── src/
│   ├── hooks/useLogRecorder.js
│   ├── components/DebugPanel.jsx
│   ├── utils/
│   └── index.js
├── dist/ (auto-generated)
├── tests/
├── package.json
├── tsup.config.js
└── README.md

2. Install Dependencies
bash

npm install -D tsup vitest @testing-library/react eslint prettier
npm install react react-dom  # peer deps for dev

3. Build & Test
bash

npm run build   # Creates dist/ folder
npm test        # Run tests
npm pack        # Test locally

4. Publish
bash

npm login
npm publish --tag beta        # First publish as beta
npm publish                   # Stable release

🎯 Key Decisions
1. Package Name

    Simple: glean-debug-logger (nếu available)
    Scoped: @yourname/glean-debug-logger (always available)

2. Build Tool

    Recommended: tsup (đơn giản, nhanh, zero-config)
    Alternative: rollup, webpack, esbuild

3. TypeScript?

    Not required - Bạn có thể viết JavaScript thuần + .d.ts manual
    Recommended - Nếu muốn type safety + auto-generated types

4. Testing

    Recommended: vitest (tương thích với React, nhanh)
    Alternative: jest, @testing-library/react

📊 Checklist Before Publishing

✅ Code Quality

    Zero runtime dependencies
    React in peerDependencies only
    All code works in test project (npm link)

✅ Build

    dist/ folder generated correctly
    Both CJS (.js) and ESM (.mjs) formats
    TypeScript definitions (.d.ts) included

✅ Documentation

    README.md complete with examples
    LICENSE file (MIT recommended)
    CHANGELOG.md

✅ Optimization

    Package size < 20 KB gzipped
    Only dist/ published (check .npmignore)
    No node_modules/ in package

✅ Testing

    All tests pass
    Works in Next.js
    Works in Create React App

💡 Pro Tips
1. Start with Scoped Package
json

{
  "name": "@yourname/glean-debug-logger"
}

    Không lo trùng tên
    Tạo personal brand
    Free publish (scoped packages are free)

2. Version Strategy
bash

0.1.0 → Beta (testing)
0.9.0 → RC (release candidate)
1.0.0 → Stable

3. Use GitHub Actions

    Auto-publish khi push tag
    Auto-test trên PR
    Tiết kiệm thời gian

4. Monitor Bundle Size
bash

npm install -D @size-limit/preset-small-lib

    CI sẽ fail nếu package quá lớn
    Tránh bloat

🔥 Next Steps

    Setup project - Copy structure từ artifacts
    Move your code - từ current project vào src/
    Config build - Copy tsup.config.js
    Test locally - npm link hoặc npm pack
    Publish beta - npm publish --tag beta
    Test in real project - npm install your-package@beta
    Publish stable - npm publish
    Celebrate! 🎉

Bạn muốn mình giải thích thêm phần nào không? Hoặc cần help setup cụ thể bước nào không? 😄

Một số câu hỏi thường gặp:

    "Có cần TypeScript không?" → Không bắt buộc, nhưng recommended
    "Scoped hay non-scoped package?" → Scoped (@yourname/pkg) an toàn hơn
    "Build tool nào?" → tsup đơn giản nhất
    "Test ở đâu trước khi publish?" → npm link hoặc verdaccio
