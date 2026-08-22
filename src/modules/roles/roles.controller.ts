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
import { Permission } from '../../shared/enums/permissions.enum';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('roles')
  @RequirePermissions(Permission.ROLES_READ)
  @ApiOperation({ summary: 'List all roles with attached permissions' })
  @ApiResponse({ status: 200, description: 'Roles retrieved' })
  findAllRoles() {
    return this.rolesService.findAllRoles();
  }

  @Post('roles')
  @RequirePermissions(Permission.ROLES_CREATE)
  @ApiOperation({ summary: 'Create a new dynamic role' })
  @ApiResponse({ status: 201, description: 'Role created' })
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Patch('roles/:id')
  @RequirePermissions(Permission.ROLES_UPDATE)
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
  @RequirePermissions(Permission.ROLES_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete role (system roles cannot be deleted)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Role deleted' })
  deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.deleteRole(id);
  }

  @Get('permissions')
  @RequirePermissions(Permission.ROLES_READ)
  @ApiOperation({ summary: 'List all available system permissions' })
  @ApiResponse({ status: 200, description: 'Permissions retrieved' })
  findAllPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Post('roles/assign-user')
  @RequirePermissions(Permission.ROLES_UPDATE)
  @ApiOperation({ summary: 'Assign or change role for a specific user' })
  @ApiResponse({ status: 201, description: 'Role assigned to user' })
  assignRole(@Body() dto: AssignRoleDto) {
    return this.rolesService.assignRoleToUser(dto);
  }
}
