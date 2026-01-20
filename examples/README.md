# Backend Upload Examples

This folder contains reference implementations for uploading debug logs to various backends.

## Setup

Each example requires specific dependencies. Install them based on which backend you use:

```bash
# Next.js File System
npm install

# AWS S3
npm install @aws-sdk/client-s3

# Supabase
npm install @supabase/supabase-js

# PostgreSQL (Vercel)
npm install @vercel/postgres
```

## Examples

| Example              | Use Case             | Difficulty      |
| -------------------- | -------------------- | --------------- |
| `nextjs-file-system` | Simple dev/testing   | ⭐ Easy         |
| `s3-upload`          | Production scalable  | ⭐⭐ Medium     |
| `supabase-storage`   | Full-stack with DB   | ⭐⭐ Medium     |
| `postgresql`         | Query logs later     | ⭐⭐ Medium     |
| `secure-api`         | Enterprise with auth | ⭐⭐⭐ Advanced |

## Usage

Copy the route file to your Next.js project:

```bash
cp examples/nextjs-file-system/route.ts app/api/logs/upload/route.ts
```

Then configure the hook:

```typescript
const { uploadLogs } = useLogRecorder({
  uploadEndpoint: "/api/logs/upload",
});
```

## Security Notes

1. Validate file names (sanitize user input)
2. Implement rate limiting (see `secure-api` example)
3. Authenticate requests before processing
4. Limit payload size (max 5MB recommended)
5. Encrypt sensitive logs before storage (optional)
