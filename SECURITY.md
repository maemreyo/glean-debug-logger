# Security & Data Privacy

The `@zaob/glean-debug-logger` is designed with a "Security-First" approach to ensure that debugging information doesn't compromise user privacy or system security.

## 1. Automatic Data Redaction (Sanitization)

The library includes a robust sanitization engine that automatically identifies and masks sensitive information before it is ever stored or exported.

### How it Works
The `sanitizeData` utility recursively traverses all captured objects (console arguments, network headers, and request/response bodies). If a key matches any of the "forbidden keys," its value is replaced with `***REDACTED***`.

### Default Protected Keys
By default, the following keys (case-insensitive) are automatically redacted:
- `password`, `pass`, `pwd`
- `token`, `access_token`, `refresh_token`
- `apiKey`, `api_key`
- `secret`, `client_secret`
- `authorization` (Headers)
- `creditCard`, `cardNumber`, `cvv`
- `ssn`, `social_security`

### Customizing Sanitization
You can provide additional keys specific to your application:

```tsx
useLogRecorder({
  sanitizeKeys: ['session_id', 'internal_uuid'],
});
```

## 2. Secure Log Exports

- **No Path Traversal**: Filenames generated from templates are sanitized to remove special characters (like `..`, `/`, `\`) to prevent path traversal issues during saving.
- **Controlled Visibility**: The `DebugPanel` component has a `showInProduction` prop (default: `false`). This prevents the debug UI from being exposed to end-users in production environments.

## 3. Server Upload Security

When using the `uploadLogs` functionality, we recommend following these backend security patterns:

- **Authentication**: Always verify the user's session before accepting a log upload.
- **Payload Limits**: Implement a maximum payload size (e.g., 5MB) on your server to prevent Denial of Service (DoS) attacks.
- **Rate Limiting**: Limit the number of uploads a single user or IP can perform in a given timeframe.
- **Storage Isolation**: Store logs in a non-public bucket or directory.

Example of a secure upload handler (pseudo-code):
```typescript
async function handleLogUpload(req) {
  const user = await authenticate(req);
  if (!user.isAdmin) throw Error("Unauthorized");
  
  await checkRateLimit(user.id, "10/hour");
  
  const payload = await req.json();
  if (JSON.stringify(payload).length > 5 * 1024 * 1024) {
    throw Error("Payload too large");
  }
  
  await saveToS3(payload);
}
```

## 4. LocalStorage Considerations

Logs are stored in `localStorage` if `enablePersistence` is true. 
- **Clear on Logout**: We recommend calling `recorder.clearLogs()` when a user logs out of your application to ensure no sensitive session info remains in the browser.
- **Sensitive Contexts**: If your application handles extremely sensitive data (e.g., medical or financial records), you may want to disable persistence entirely.

## 5. Reporting Vulnerabilities

If you discover a security vulnerability, please do not open a public issue. Instead, send an email to **zaob.ogn@gmail.com**. We will acknowledge receipt within 48 hours and work on a fix immediately.
