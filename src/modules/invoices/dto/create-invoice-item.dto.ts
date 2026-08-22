import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateInvoiceItemDto {
  @ApiProperty({ example: 'Web Development Services' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ example: 500.0 })
  @IsNumber()
  @Min(0)
  unitPrice: number;
}
