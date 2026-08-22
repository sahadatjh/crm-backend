import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'I have started working on this.', description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
