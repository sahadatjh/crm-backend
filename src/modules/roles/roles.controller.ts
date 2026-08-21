import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('roles')
  @RequirePermissions('roles.read')
  @ApiOperation({ summary: 'List all roles with attached permissions' })
  @ApiResponse({ status: 200, description: 'Roles retrieved' })
  findAllRoles() {
    return this.rolesService.findAllRoles();
  }

  @Post('roles')
  @RequirePermissions('roles.create')
  @ApiOperation({ summary: 'Create a new dynamic role' })
  @ApiResponse({ status: 201, description: 'Role created' })
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Patch('roles/:id')
  @RequirePermissions('roles.update')
  @ApiOperation({ summary: 'Update role details or permission assignments' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.rolesService.updateRole(id, dto);
  }

  @Delete('roles/:id')
  @RequirePermissions('roles.delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete role (system roles cannot be deleted)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Role deleted' })
  deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.deleteRole(id);
  }

  @Get('permissions')
  @RequirePermissions('roles.read')
  @ApiOperation({ summary: 'List all available system permissions' })
  @ApiResponse({ status: 200, description: 'Permissions retrieved' })
  findAllPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Post('roles/assign-user')
  @RequirePermissions('roles.update')
  @ApiOperation({ summary: 'Assign or change role for a specific user' })
  @ApiResponse({ status: 201, description: 'Role assigned to user' })
  assignRole(@Body() dto: AssignRoleDto) {
    return this.rolesService.assignRoleToUser(dto);
  }
}
