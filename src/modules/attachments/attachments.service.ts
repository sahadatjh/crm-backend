import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment, ResourceType } from './entities/attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { S3UploadService } from '../../shared/services/s3-upload.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly s3UploadService: S3UploadService,
  ) {}

  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    dto: CreateAttachmentDto,
  ): Promise<Attachment> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found.');

    // Upload to S3
    const folder = dto.resourceType.toLowerCase(); // 'task' or 'project'
    const { url, key } = await this.s3UploadService.uploadFile(file, folder);

    // Save metadata
    const attachment = this.attachmentRepository.create({
      resourceType: dto.resourceType,
      resourceId: dto.resourceId,
      uploadedBy: user,
      fileUrl: url,
      s3Key: key,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    return this.attachmentRepository.save(attachment);
  }

  async getAttachments(resourceType: ResourceType, resourceId: string): Promise<Attachment[]> {
    return this.attachmentRepository.find({
      where: { resourceType, resourceId },
      relations: { uploadedBy: { profile: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteFile(id: string, userId: string): Promise<{ message: string }> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: { uploadedBy: true },
    });

    if (!attachment) throw new NotFoundException('Attachment not found.');

    // Only uploader can delete (for now)
    if (attachment.uploadedBy.id !== userId) {
      throw new NotFoundException('You can only delete your own attachments.');
    }

    // Delete from S3
    await this.s3UploadService.deleteFile(attachment.s3Key);

    // Delete metadata
    await this.attachmentRepository.remove(attachment);

    return { message: 'Attachment deleted successfully.' };
  }
}
