# Integration Guide

This guide provides examples of how to integrate `@zaob/glean-debug-logger` with various backend systems and storage providers.

## 1. Next.js (Local Filesystem)

This example shows how to create a Next.js API route that saves logs to the server's local filesystem. Useful for internal development tools.

```typescript
// app/api/logs/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { metadata, logs, fileName } = payload;
    
    // Create directory structure: logs/environment/date/userId/
    const date = new Date().toISOString().split('T')[0];
    const basePath = path.join(process.cwd(), 'logs');
    const fullPath = path.join(basePath, metadata.environment, date, metadata.userId || 'anonymous');
    
    await mkdir(fullPath, { recursive: true });
    
    const filePath = path.join(fullPath, fileName);
    await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, path: filePath });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
```

## 2. AWS S3 (Cloud Storage)

Upload logs directly to an S3 bucket. Best for production environments.

```typescript
// app/api/logs/upload/route.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function POST(request: Request) {
  const payload = await request.json();
  const { metadata, fileName } = payload;
  
  const key = `debug-logs/${metadata.environment}/${metadata.userId}/${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(payload),
    ContentType: "application/json",
  });

  await s3Client.send(command);
  return Response.json({ success: true });
}
```

## 3. Supabase Storage

A simple way to store logs if you are already using Supabase.

```typescript
// app/api/logs/upload/route.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: Request) {
  const payload = await request.json();
  const { metadata, fileName } = payload;
  
  const path = `${metadata.environment}/${metadata.userId}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('debug-logs')
    .upload(path, JSON.stringify(payload));

  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ success: true });
}
```

## 4. PostgreSQL (Relational Database)

Save logs to a database for easier querying and analysis.

```typescript
// app/api/logs/upload/route.ts
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  const { metadata, logs, fileName } = await request.json();
  
  await sql`
    INSERT INTO debug_logs (
      user_id, 
      session_id, 
      environment, 
      file_name, 
      metadata, 
      logs, 
      created_at
    ) VALUES (
      ${metadata.userId}, 
      ${metadata.sessionId}, 
      ${metadata.environment}, 
      ${fileName}, 
      ${JSON.stringify(metadata)}, 
      ${JSON.stringify(logs)}, 
      NOW()
    )
  `;
  
  return Response.json({ success: true });
}
```

## 5. Implementation in Frontend

Once your backend is ready, configure the `useLogRecorder` hook:

```tsx
const recorder = useLogRecorder({
  uploadEndpoint: "/api/logs/upload",
  uploadOnError: true,
  environment: process.env.NODE_ENV,
  userId: currentUser?.id,
});

// Manual upload
const handleSupportRequest = async () => {
  const result = await recorder.uploadLogs();
  if (result.success) {
    alert("Logs uploaded! Support ID: " + recorder.sessionId);
  }
};
```
