import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommunicationType } from '../entities/client-communication.entity';

export class CreateCommunicationDto {
  @ApiProperty({ enum: CommunicationType, example: CommunicationType.CALL })
  @IsEnum(CommunicationType)
  @IsNotEmpty()
  type: CommunicationType;

  @ApiProperty({ example: 'Discovery call with Jane Smith' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2026-08-21T10:00:00Z' })
  @Type(() => Date)
  @IsDate()
  communicationDate: Date;

  @ApiPropertyOptional({ example: 'Discussed pricing and project scope.' })
  @IsOptional()
  @IsString()
  summary: string;
}
