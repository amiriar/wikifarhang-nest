import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from 'src/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
