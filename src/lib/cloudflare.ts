import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.CLOUDFLARE_BUCKET_NAME!;
const PUBLIC_URL = process.env.CLOUDFLARE_PUBLIC_URL!;

export async function uploadImageToR2(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `products/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  return `${PUBLIC_URL}/${key}`;
}

export function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}
