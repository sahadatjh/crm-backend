import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { User } from '../users/entities/user.entity';
import { UserProfile } from '../users/entities/user-profile.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, UserProfile, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}), // Secrets configured per-call in service for dual-token support
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule { }
