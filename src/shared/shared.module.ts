import { Global, Module } from '@nestjs/common';
import { S3UploadService } from './services/s3-upload.service';
import { MailModule } from './mail/mail.module';

@Global()
@Module({
  imports: [MailModule],
  providers: [S3UploadService],
  exports: [S3UploadService, MailModule],
})
export class SharedModule {}
