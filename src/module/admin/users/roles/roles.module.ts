import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from 'src/entities/role.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { User } from 'src/entities/User.entity';
import { UsersService } from '../users.service';
import { Otp } from 'src/entities/Otp.entity';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User, Otp]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [RolesService, JwtService, UsersService],
  controllers: [RolesController],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
