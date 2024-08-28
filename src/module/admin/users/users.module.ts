import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { RolesModule } from './roles/roles.module';
import { Otp } from 'src/entities/Otp.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp]), UsersModule, RolesModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
