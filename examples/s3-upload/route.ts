import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: Request) {
  try {
    const { metadata, logs, fileName } = await request.json();

    const date = new Date().toISOString().split("T")[0];
    const userId = metadata.userId || "anonymous";
    const environment = metadata.environment || "unknown";

    const s3Key = `${environment}/${date}/${userId}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || "debug-logs",
      Key: s3Key,
      Body: JSON.stringify({ metadata, logs }, null, 2),
      ContentType: "application/json",
      Metadata: {
        userId: userId,
        environment: environment,
        logCount: String(logs.length),
        errorCount: String(metadata.errorCount || 0),
      },
    });

    await s3Client.send(command);

    const s3Url = `https://${process.env.S3_BUCKET_NAME || "debug-logs"}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${s3Key}`;

    return NextResponse.json({
      success: true,
      url: s3Url,
      key: s3Key,
      metadata: {
        logCount: logs.length,
        size: JSON.stringify({ metadata, logs }).length,
      },
    });
  } catch (error) {
    console.error("S3 upload failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
