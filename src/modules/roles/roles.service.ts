import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

// All system permissions — add new ones here as modules grow
const SYSTEM_PERMISSIONS: { slug: string; module: string; description: string }[] = [
  // Clients
  { slug: 'clients.read', module: 'clients', description: 'View clients' },
  { slug: 'clients.create', module: 'clients', description: 'Create clients' },
  { slug: 'clients.update', module: 'clients', description: 'Update clients' },
  { slug: 'clients.delete', module: 'clients', description: 'Delete clients' },
  // Projects
  { slug: 'projects.read', module: 'projects', description: 'View projects' },
  { slug: 'projects.create', module: 'projects', description: 'Create projects' },
  { slug: 'projects.update', module: 'projects', description: 'Update projects' },
  { slug: 'projects.delete', module: 'projects', description: 'Delete projects' },
  // Tasks
  { slug: 'tasks.read', module: 'tasks', description: 'View tasks' },
  { slug: 'tasks.create', module: 'tasks', description: 'Create tasks' },
  { slug: 'tasks.update', module: 'tasks', description: 'Update tasks' },
  { slug: 'tasks.delete', module: 'tasks', description: 'Delete tasks' },
  // Invoices
  { slug: 'invoices.read', module: 'invoices', description: 'View invoices' },
  { slug: 'invoices.create', module: 'invoices', description: 'Create invoices' },
  { slug: 'invoices.update', module: 'invoices', description: 'Update invoices' },
  { slug: 'invoices.delete', module: 'invoices', description: 'Delete invoices' },
  // Team
  { slug: 'team.read', module: 'team', description: 'View team members' },
  { slug: 'team.create', module: 'team', description: 'Add team members' },
  // Reports
  { slug: 'reports.read', module: 'reports', description: 'View reports' },
  { slug: 'reports.export', module: 'reports', description: 'Export reports' },
  // Dashboard
  { slug: 'dashboard.read', module: 'dashboard', description: 'View dashboard' },
  // Roles
  { slug: 'roles.read', module: 'roles', description: 'View roles' },
  { slug: 'roles.create', module: 'roles', description: 'Create roles' },
  { slug: 'roles.update', module: 'roles', description: 'Update roles' },
  { slug: 'roles.delete', module: 'roles', description: 'Delete roles' },
];

@Injectable()
export class RolesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // Runs automatically on app startup — seeds permissions, roles, and default super admin
  async onApplicationBootstrap() {
    await this.seedPermissions();
    await this.seedDefaultRoles();
    await this.seedSuperAdmin();
  }

  private async seedPermissions() {
    for (const perm of SYSTEM_PERMISSIONS) {
      const exists = await this.permissionRepository.findOne({
        where: { slug: perm.slug },
      });
      if (!exists) {
        await this.permissionRepository.save(
          this.permissionRepository.create(perm),
        );
      }
    }
  }

  private async seedDefaultRoles() {
    const allPermissions = await this.permissionRepository.find();

    const defaults = [
      {
        name: 'Super Admin',
        description: 'Full system access',
        isSystem: true,
        permissions: allPermissions,
      },
      {
        name: 'Admin',
        description: 'Can manage projects, clients, tasks and team',
        isSystem: true,
        permissions: allPermissions.filter((p) =>
          ['clients', 'projects', 'tasks', 'invoices', 'team', 'dashboard', 'reports'].includes(p.module),
        ),
      },
      {
        name: 'Manager',
        description: 'Can manage projects and teams',
        isSystem: true,
        permissions: allPermissions.filter((p) =>
          ['projects', 'tasks', 'team', 'dashboard'].includes(p.module),
        ),
      },
      {
        name: 'Staff',
        description: 'Can view and edit assigned tasks',
        isSystem: true,
        permissions: allPermissions.filter((p) =>
          ['tasks', 'dashboard'].includes(p.module),
        ),
      },
    ];

    for (const def of defaults) {
      const exists = await this.roleRepository.findOne({
        where: { name: def.name },
      });
      if (!exists) {
        await this.roleRepository.save(this.roleRepository.create(def));
      }
    }
  }

  private async seedSuperAdmin() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) return; // Skip if not configured

    const exists = await this.userRepository.findOne({ where: { email } });
    if (exists) return; // Already seeded — skip

    const superAdminRole = await this.roleRepository.findOne({
      where: { name: 'Super Admin' },
    });
    if (!superAdminRole) return;

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = this.userRepository.create({
      firstName: process.env.SUPER_ADMIN_FIRST_NAME ?? 'Super',
      lastName: process.env.SUPER_ADMIN_LAST_NAME ?? 'Admin',
      email,
      password: hashedPassword,
      isActive: true,
      role: superAdminRole,
    });

    await this.userRepository.save(admin);
    console.log(`Super Admin seeded: ${email}`);
  }

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
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User with ID "${dto.userId}" not found.`);

    const role = await this.roleRepository.findOne({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException(`Role with ID "${dto.roleId}" not found.`);

    user.role = role;
    await this.userRepository.save(user);

    return { message: `Role "${role.name}" has been assigned to user.` };
  }
}
