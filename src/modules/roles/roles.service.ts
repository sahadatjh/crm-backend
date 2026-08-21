import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find({ relations: { permissions: true } });
  }

  async findAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find({ order: { module: 'ASC', slug: 'ASC' } });
  }

  async createRole(dto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new BadRequestException(`Role "${dto.name}" already exists.`);
    }

    let permissions: Permission[] = [];
    if (dto.permissionIds?.length) {
      permissions = await this.permissionRepository.findBy({
        id: In(dto.permissionIds),
      });
    }

    const role = this.roleRepository.create({
      name: dto.name,
      description: dto.description,
      permissions,
    });
    return this.roleRepository.save(role);
  }

  async updateRole(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: { permissions: true },
    });
    if (!role) throw new NotFoundException(`Role with ID "${id}" not found.`);
    if (role.isSystem && dto.name && dto.name !== role.name) {
      throw new BadRequestException('Cannot rename a system role.');
    }

    if (dto.name) role.name = dto.name;
    if (dto.description !== undefined) role.description = dto.description;

    if (dto.permissionIds !== undefined) {
      role.permissions = dto.permissionIds.length
        ? await this.permissionRepository.findBy({ id: In(dto.permissionIds) })
        : [];
    }

    return this.roleRepository.save(role);
  }

  async deleteRole(id: string): Promise<{ message: string }> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID "${id}" not found.`);
    if (role.isSystem) {
      throw new BadRequestException('System roles cannot be deleted.');
    }
    await this.roleRepository.softRemove(role);
    return { message: `Role "${role.name}" has been deleted.` };
  }

  async assignRoleToUser(dto: AssignRoleDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
      relations: { roles: true },
    });
    if (!user) throw new NotFoundException(`User with ID "${dto.userId}" not found.`);

    const role = await this.roleRepository.findOne({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException(`Role with ID "${dto.roleId}" not found.`);

    // Check if user already has this role
    if (user.roles.some((r) => r.id === role.id)) {
      return { message: `User already has role "${role.name}".` };
    }

    user.roles.push(role);
    await this.userRepository.save(user);

    return { message: `Role "${role.name}" has been assigned to user.` };
  }
}
