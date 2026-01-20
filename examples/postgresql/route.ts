import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { metadata, logs, fileName } = await request.json();

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
        ${metadata.userId || "anonymous"},
        ${metadata.sessionId},
        ${metadata.environment || "unknown"},
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
      },
    });
  } catch (error) {
    console.error("Database upload failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
