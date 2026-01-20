import { rateLimit } from "@/lib/rate-limit";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

const limiter = rateLimit({
  interval: 60 * 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    try {
      await limiter.check(10, user.id);
    } catch {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const { metadata, logs, fileName } = await request.json();
    const payloadSize = JSON.stringify({ metadata, logs }).length;

    if (payloadSize > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Payload too large (max 5MB)" },
        { status: 413 },
      );
    }

    const sanitizedFileName = fileName.replace(/[^a-z0-9_\-\.]/gi, "_");

    // Here you would choose one of the upload methods:
    // - File system (see nextjs-file-system example)
    // - S3 (see s3-upload example)
    // - Supabase (see supabase-storage example)
    // - PostgreSQL (see postgresql example)

    return NextResponse.json({
      success: true,
      fileName: sanitizedFileName,
      logCount: logs.length,
    });
  } catch (error) {
    console.error("Secure upload failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
