import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/admin/users/users.service';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/User.entity';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { request } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly entityManager: EntityManager, 
  ) {}

  async validateUser(
    username: string,
    password: string,
    lastDateIn: string,
  ): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      user.lastDateIn = lastDateIn;
      return this.userRepository.save(user);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async signToken(user: User) {
    const payload = {
      username: user.username,
      id: user.id,
      role: user.roles, // Use the role name
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async register(
    username: string,
    email: string,
    password: string,
    lastDateIn: string,
  ) {
    try {
      const user = this.userRepository.create({
        username,
        email,
        password,
        lastDateIn,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique violation error code
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }

  async changePassword(oldPassword: string, newPassword): Promise<User> {
    const user = request.user as User
    const userId = user.id
    if (!user) {
      throw new NotFoundException('کاربری با این مشخصات پیدا نشد.');
    }

    // Logic to change the password

    

    return user; // You might return some success message or the user info
  }
}
