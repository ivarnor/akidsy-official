import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '';
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';

export const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'akidsy-media';
export const r2PublicBaseUrl = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-6ad3b83efdde42349387698c6194502b.r2.dev'
).replace(/\/$/, '');

/**
 * S3 Client configured for Cloudflare R2 S3-compatible API
 */
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * Sanitizes and generates a unique R2 object key
 */
export function generateR2Key(folder: string, originalFilename: string): string {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
  const ext = originalFilename.split('.').pop() || '';
  const baseName = originalFilename
    .substring(0, originalFilename.lastIndexOf('.') || originalFilename.length)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const finalFilename = ext ? `${baseName}-${uniqueId}.${ext}` : `${baseName}-${uniqueId}`;

  return cleanFolder ? `${cleanFolder}/${finalFilename}` : finalFilename;
}

/**
 * Generates a presigned PUT URL for direct browser-to-R2 upload
 */
export async function getPresignedPutUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 900
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const command = new PutObjectCommand({
    Bucket: r2BucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, {
    expiresIn: expiresInSeconds,
  });

  const publicUrl = `${r2PublicBaseUrl}/${key}`;

  return { uploadUrl, publicUrl, key };
}

/**
 * Deletes an object from Cloudflare R2 given its key
 */
export async function deleteR2Object(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: r2BucketName,
    Key: key,
  });

  await r2Client.send(command);
}
