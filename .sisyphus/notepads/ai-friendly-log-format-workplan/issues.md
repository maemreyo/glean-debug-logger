# Issues - ECS Transformation Implementation

## Date: 2026-01-21

## Issues Encountered

### TypeScript Error: Property 'body' not in Error Entry Types

**Problem:** FetchErrorEntry and XHRErrorEntry don't have `body` property in type definition, but success criteria requires extracting `body.frames` for stack traces.

**Solution:** Use type assertion to handle dynamic property:

```typescript
const logWithBody = log as LogEntry & { body?: unknown };
if (typeof logWithBody.body === 'object' && logWithBody.body !== null) {
  // Safe to access body.frames
}
```

**Reason:** Error entries may have additional properties at runtime not captured in strict types. Runtime check ensures safety.

### No Issues Found

- All ECS field mappings implemented correctly
- All success criteria met
- Lint passes (no new errors in ecsTransform.ts)
- Tests pass (170/170)
