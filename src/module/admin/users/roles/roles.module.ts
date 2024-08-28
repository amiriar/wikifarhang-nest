import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from 'src/entities/role.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { User } from 'src/entities/User.entity';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [RolesService, JwtService],
  controllers: [RolesController],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
