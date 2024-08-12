import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } }); 
  }
  findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } }); 
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } }); 
  }

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = this.userRepository.create({ username, email, password });
    return this.userRepository.save(user);
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
