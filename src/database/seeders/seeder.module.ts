import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../modules/roles/entities/role.entity';
import { Permission } from '../../modules/roles/entities/permission.entity';
import { User } from '../../modules/users/entities/user.entity';
import { DatabaseSeederService } from './database.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  providers: [DatabaseSeederService],
  exports: [DatabaseSeederService],
})
export class SeederModule {}
