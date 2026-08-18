import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'The JWT Refresh Token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
