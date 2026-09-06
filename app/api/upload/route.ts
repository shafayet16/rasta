import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure S3 client for Cloudflare R2
const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename & create unique key
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `products/${Date.now()}-${sanitizedFileName}`;

    const bucketName = process.env.R2_BUCKET_NAME;
    const publicDomain = process.env.R2_PUBLIC_DOMAIN; // e.g. https://pub-xxxxxx.r2.dev or custom domain

    if (!bucketName || !publicDomain) {
      return NextResponse.json(
        { error: "R2 bucket or public domain configuration missing in .env" },
        { status: 500 }
      );
    }

    // Upload file to Cloudflare R2
    await R2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type || "image/jpeg",
      })
    );

    // Construct final public image URL
    const cleanPublicDomain = publicDomain.replace(/\/$/, "");
    const fileUrl = `${cleanPublicDomain}/${fileKey}`;

    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error: any) {
    console.error("R2 Upload Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file to R2" },
      { status: 500 }
    );
  }
}