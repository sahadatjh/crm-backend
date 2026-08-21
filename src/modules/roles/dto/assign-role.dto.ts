import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ description: 'The ID of the user to assign the role to' })
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'The ID of the role to assign' })
  @IsUUID('4')
  @IsNotEmpty()
  roleId: string;
}
