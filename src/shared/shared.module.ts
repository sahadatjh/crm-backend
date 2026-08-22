import { Global, Module } from '@nestjs/common';
import { S3UploadService } from './services/s3-upload.service';

@Global()
@Module({
  imports: [],
  providers: [S3UploadService],
  exports: [S3UploadService],
})
export class SharedModule {}
