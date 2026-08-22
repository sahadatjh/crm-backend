import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  region: process.env.AWS_S3_REGION || 'ap-southeast-1',
  bucket: process.env.AWS_S3_BUCKET || 'fbintbd-crm-uploads',
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
}));
