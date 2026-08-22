import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { User } from '../users/entities/user.entity';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment, User])],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
  exports: [TypeOrmModule, AttachmentsService],
})
export class AttachmentsModule {}
