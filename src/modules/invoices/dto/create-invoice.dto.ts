import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Currency } from '../../../shared/enums/invoice.enum';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';

export class CreateInvoiceDto {
  @ApiProperty({ example: 'uuid-of-client' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiPropertyOptional({ example: 'uuid-of-project' })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @ApiProperty({ example: '2026-08-31' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiPropertyOptional({ enum: Currency, default: Currency.BDT })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiPropertyOptional({ example: 0, description: 'Total tax amount applied to the invoice' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxAmount?: number;

  @ApiPropertyOptional({ example: 0, description: 'Total discount amount applied to the invoice' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @ApiPropertyOptional({ example: 'Thank you for your business!' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 'Payment is due within 30 days.' })
  @IsString()
  @IsOptional()
  termsAndConditions?: string;

  @ApiProperty({ type: [CreateInvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  @IsNotEmpty()
  items: CreateInvoiceItemDto[];
}
