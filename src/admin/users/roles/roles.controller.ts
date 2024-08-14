import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from 'src/entities/role.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/AuthGuard.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('roles')
@ApiTags('(Admin Panel) Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved roles', type: Role, isArray: true })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved role', type: Role })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Post(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({ summary: 'Change a user\'s role' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({ schema: { type: 'string', description: 'New Role ID' } })
  @ApiResponse({ status: 200, description: 'Role changed successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden. Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'User or Role not found' })
  async changeRole(@Param('id') userId: string, @Body() newRoleId: string) {   
    return await this.rolesService.changeRole(userId, newRoleId);
  }
}
