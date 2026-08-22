import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ProjectPriority, ProjectStatus } from '../../../shared/enums/project.enum';

export class CreateProjectDto {
  @ApiProperty({ example: 'fbintbd-crm.com Revamp', description: 'Project title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Full redesign of the website' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'a1b2c3d4-...', description: 'UUID of the client this project belongs to' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiPropertyOptional({ example: 50000, description: 'Project budget in base currency' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional({ enum: ProjectPriority, default: ProjectPriority.MEDIUM })
  @IsEnum(ProjectPriority)
  @IsOptional()
  priority?: ProjectPriority;

  @ApiPropertyOptional({ enum: ProjectStatus, default: ProjectStatus.ACTIVE })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({ example: '2026-09-01' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ example: ['uuid-1', 'uuid-2'], description: 'UUIDs of team members to assign' })
  @IsUUID('all', { each: true })
  @IsOptional()
  memberIds?: string[];
}
