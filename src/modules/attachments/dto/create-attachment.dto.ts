import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ResourceType } from '../entities/attachment.entity';

export class CreateAttachmentDto {
  @ApiProperty({ enum: ResourceType })
  @IsEnum(ResourceType)
  @IsNotEmpty()
  resourceType: ResourceType;

  @ApiProperty({ example: 'uuid-of-task-or-project' })
  @IsUUID()
  @IsNotEmpty()
  resourceId: string;
}
