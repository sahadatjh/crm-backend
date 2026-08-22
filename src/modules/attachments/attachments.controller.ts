import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { ResourceType } from './entities/attachment.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

// 5MB max size
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload an attachment to a Task or Project via AWS S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        resourceType: { type: 'string', enum: Object.values(ResourceType) },
        resourceId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAttachmentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }
    
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(`File is too large. Maximum size allowed is 5MB.`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, WEBP, and PDF are allowed.');
    }

    return this.attachmentsService.uploadFile(userId, file, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attachments for a specific resource (Task/Project)' })
  @ApiResponse({ status: 200, description: 'Attachments retrieved successfully.' })
  getAttachments(
    @Query('resourceType') resourceType: ResourceType,
    @Query('resourceId', ParseUUIDPipe) resourceId: string,
  ) {
    return this.attachmentsService.getAttachments(resourceType, resourceId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attachment from S3 and database' })
  @ApiResponse({ status: 200, description: 'Attachment deleted successfully.' })
  deleteFile(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.attachmentsService.deleteFile(id, userId);
  }
}
