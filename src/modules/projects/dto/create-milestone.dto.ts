import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { MilestoneStatus } from '../../../shared/enums/project.enum';

export class CreateMilestoneDto {
  @ApiProperty({ example: 'Design Prototype Approved' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: '2026-10-15' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ enum: MilestoneStatus, default: MilestoneStatus.PENDING })
  @IsEnum(MilestoneStatus)
  @IsOptional()
  status?: MilestoneStatus;
}
