import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export async function POST(request: Request) {
  try {
    const { metadata, logs, fileName } = await request.json();

    const date = new Date().toISOString().split("T")[0];
    const userId = metadata.userId || "anonymous";
    const environment = metadata.environment || "unknown";

    const storagePath = `${environment}/${userId}/${date}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("debug-logs")
      .upload(storagePath, JSON.stringify({ metadata, logs }, null, 2), {
        contentType: "application/json",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("debug-logs")
      .getPublicUrl(storagePath);

    await supabase.from("log_metadata").insert({
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
    console.error("Supabase upload failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
