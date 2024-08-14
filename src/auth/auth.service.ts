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
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly entityManager: EntityManager, 
  ) {}

  async validateUser(
    phone: string,
    code: string,
    lastDateIn: string,
  ): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: { phoneNumber: phone },
    });
  
    if (!user) {
      throw new UnauthorizedException('کاربری با این شماره تلفن یافت نشد.');
    }
    // Check if the OTP matches and is not expired
    if(new Date() > user.otpExpiresAt){
      throw new UnauthorizedException('کد وارد شده منقضی شده است.');
    }
  
    if (user.otp === code) {
      user.lastDateIn = lastDateIn;
      user.otp = null; // Clear the OTP after successful validation
      user.otpExpiresAt = null; // Clear the expiration time after successful validation
      return this.userRepository.save(user);
    } else {
      throw new UnauthorizedException('اطلاعات وارد شده صحیح نمی‌باشد.');
    }
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

   async changePassword(oldPassword: string, newPassword: string): Promise<User> {
    const user = request.user as User
    const userId = user.id
    if (!user) {
      throw new NotFoundException('کاربری با این مشخصات پیدا نشد.');
    }

    // Logic to change the passsword
    const compare = bcrypt.compareSync(newPassword, oldPassword)
    if(compare){
      let salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(newPassword, salt)
      user.password = hash
      await this.userRepository.save(user)
    }
    
    return user; // You might return some success message or the user info
  }
}
