import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const exists = await this.departmentRepository.findOneBy({ name: dto.name });
    if (exists) {
      throw new ConflictException(`Department "${dto.name}" already exists.`);
    }

    const dept = this.departmentRepository.create(dto);
    return this.departmentRepository.save(dept);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Department> {
    const dept = await this.departmentRepository.findOneBy({ id });
    if (!dept) {
      throw new NotFoundException(`Department with ID "${id}" not found.`);
    }
    return dept;
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const dept = await this.findOne(id);
    
    if (dto.name && dto.name !== dept.name) {
      const exists = await this.departmentRepository.findOneBy({ name: dto.name });
      if (exists) {
        throw new ConflictException(`Department "${dto.name}" already exists.`);
      }
    }

    Object.assign(dept, dto);
    return this.departmentRepository.save(dept);
  }

  async remove(id: string): Promise<{ message: string }> {
    const dept = await this.findOne(id);
    await this.departmentRepository.remove(dept);
    return { message: 'Department deleted successfully.' };
  }
}
