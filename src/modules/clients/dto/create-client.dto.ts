import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  MaxLength,
} from 'class-validator';
import { ClientStatus } from '../entities/client.entity';

export class CreateClientDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  companyName: string;

  @ApiPropertyOptional({ example: 'Jane Smith' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  contactPerson: string;

  @ApiProperty({ example: 'jane@acme.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+1 555 123 4567' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone: string;

  @ApiPropertyOptional({ example: 'https://acme.com' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  website: string;

  @ApiPropertyOptional({ example: 'Software & Technology' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry: string;

  @ApiPropertyOptional({ example: '123 Business Ave, NY' })
  @IsOptional()
  @IsString()
  address: string;

  @ApiPropertyOptional({ example: ['VIP', 'Enterprise'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiPropertyOptional({ enum: ClientStatus, default: ClientStatus.LEAD })
  @IsOptional()
  @IsEnum(ClientStatus)
  status: ClientStatus;

  @ApiPropertyOptional({ example: 'Key enterprise client since 2024.' })
  @IsOptional()
  @IsString()
  notes: string;
}
