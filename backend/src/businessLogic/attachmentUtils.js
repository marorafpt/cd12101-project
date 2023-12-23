import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
// import * as AWSXRay from '@aws-xray-sdk'
import { createLogger } from '../utils/logger.js';

// Implement the fileStorage logic
const logger = createLogger('AttachmentUtils');
const s3Client = new S3Client()
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class AttachmentUtils {
  static bucketName = process.env.ATTACHMENT_S3_BUCKET

  constructor() {
  }

  async getUploadUrl(imageId) {
    logger.info(`Fetching upload URL for imageId: ${imageId}`)
    const command = new PutObjectCommand({
      Bucket: AttachmentUtils.bucketName,
      Key: imageId
    });
    const options = {
      expiresIn: urlExpiration
    }
    return getSignedUrl(s3Client, command, options)
  }

}