import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule], 
})
export class UsersModule {}
