# Security Policy

## Supported Versions

Currently, only the latest version of `@zaob/glean-debug-logger` receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please do not open a public issue. Instead, send an email to **zaob.ogn@gmail.com** with the following details:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Any suggested fixes (if known)

I will acknowledge receipt of your report within 48 hours and provide regular updates on the progress of the fix.

## Security Best Practices

When using this library in production, consider the following security best practices:

1. **Disable in Production**: The debug panel should not be visible in production environments. Use `showInProduction={false}` on the `DebugPanel` component.

2. **Review Uploaded Logs**: Implement proper authentication and validation on your server endpoint that receives log uploads.

3. **Sanitize Sensitive Data**: Ensure the `sanitizeKeys` option includes all sensitive data patterns specific to your application.

4. **Rate Limiting**: Implement rate limiting on your log upload endpoint to prevent abuse.

5. **Access Control**: Restrict access to the debug panel and log download functionality to authorized users only.

## Security Audits

This library automatically redacts common sensitive data patterns including:
- Passwords
- API keys
- Authentication tokens
- Credit card numbers
- Social security numbers

However, you should review and customize the `sanitizeKeys` configuration for your specific use case.
