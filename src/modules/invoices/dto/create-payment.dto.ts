import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentMethod } from '../../../shared/enums/invoice.enum';

export class CreatePaymentDto {
  @ApiProperty({ example: 1000.50 })
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: '2026-08-15' })
  @IsDateString()
  @IsNotEmpty()
  paymentDate: string;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.BANK_TRANSFER })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'TXN-987654321', description: 'Reference ID from the payment gateway/bank' })
  @IsString()
  @IsOptional()
  transactionId?: string;
}
