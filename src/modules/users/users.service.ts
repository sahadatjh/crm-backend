import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Department } from '../departments/entities/department.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOneBy({ email: dto.email });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let department: Department | null = null;
      if (dto.departmentId) {
        department = await this.departmentRepository.findOneBy({ id: dto.departmentId });
        if (!department) throw new NotFoundException('Department not found');
      }

      let roles: Role[] = [];
      if (dto.roleIds && dto.roleIds.length > 0) {
        roles = await this.roleRepository.findBy({ id: In(dto.roleIds) });
      }

      const user = this.userRepository.create({
        email: dto.email,
        password: hashedPassword,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
        roles,
        profile: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          jobTitle: dto.jobTitle,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          ...(department && { department }),
        },
      });

      const savedUser = await queryRunner.manager.save(User, user) as User;
      await queryRunner.commitTransaction();

      return this.findOne(savedUser.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: { profile: { department: true }, roles: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { profile: { department: true }, roles: true },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOneBy({ email: dto.email });
      if (existing) throw new ConflictException('Email already in use');
      user.email = dto.email;
    }

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 12);
    }

    if (dto.isActive !== undefined) {
      user.isActive = dto.isActive;
    }

    if (dto.roleIds) {
      user.roles = await this.roleRepository.findBy({ id: In(dto.roleIds) });
    }

    // Update Profile
    if (dto.firstName) user.profile.firstName = dto.firstName;
    if (dto.lastName) user.profile.lastName = dto.lastName;
    if (dto.phone) user.profile.phone = dto.phone;
    if (dto.jobTitle) user.profile.jobTitle = dto.jobTitle;
    if (dto.startDate) user.profile.startDate = new Date(dto.startDate);

    if (dto.departmentId) {
      const department = await this.departmentRepository.findOneBy({ id: dto.departmentId });
      if (!department) throw new NotFoundException('Department not found');
      user.profile.department = department;
    } else if (dto.departmentId === null) {
      // Allow unsetting department
      user.profile.department = null as unknown as Department;
    }

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
