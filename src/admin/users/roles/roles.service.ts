import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    return await this.roleRepository.findOneBy({ id });
  }

  async changeRole(userId: string, role: string) {
    // @ts-ignore
    const newRoleId = role.roleId
    
    const user = await this.userRepository.findOneBy({ id: userId });
    const newRole = await this.roleRepository.findOneBy({ id: newRoleId });
    user.roles = newRole.name;
    
    return await this.userRepository.save(user);
  }

  // Additional methods as needed
}
