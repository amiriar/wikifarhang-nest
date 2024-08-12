import { Controller, Get, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from 'src/entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(id);
  }
}
