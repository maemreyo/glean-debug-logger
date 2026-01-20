import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { metadata, logs, fileName } = await request.json();

    if (!metadata || !logs || !fileName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const basePath = path.join(process.cwd(), "logs");
    const date = new Date().toISOString().split("T")[0];
    const userId = metadata.userId || "anonymous";
    const environment = metadata.environment || "unknown";

    const fullPath = path.join(basePath, environment, date, userId);
    await mkdir(fullPath, { recursive: true });

    const filePath = path.join(fullPath, fileName);
    const content = JSON.stringify({ metadata, logs }, null, 2);
    await writeFile(filePath, content, "utf-8");

    const publicUrl = `/logs/${environment}/${date}/${userId}/${fileName}`;

    return NextResponse.json({
      success: true,
      path: filePath,
      url: publicUrl,
      metadata: {
        size: Buffer.byteLength(content, "utf-8"),
        logCount: logs.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
