import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty({
    example: {
      COMPANY_NAME: 'CRM Pro',
      DEFAULT_CURRENCY: 'USD',
      TAX_RATE: 15,
    },
    description: 'Key-value pairs of settings to update',
  })
  @IsObject()
  @IsNotEmpty()
  settings: Record<string, any>;
}
