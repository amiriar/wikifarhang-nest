import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/module/admin/users/users.service';
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
    if (new Date() > user.otpExpiresAt) {
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
      role: user.roles,
    };
  
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '30m', // 30 minutes
    });
  
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      expiresIn: '7d', // 7 days
    });
  
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  
    return { accessToken, refreshToken };
  }
  

  async generateAccessToken(user: User) {
    const payload = {
      username: user.username,
      id: user.id,
      role: user.roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '30m', // 30 minutes
    });

    return { accessToken };
  }

  async validateRefreshToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.id, refreshToken: token },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      if (new Date() > user.refreshTokenExpiresAt) {
        throw new UnauthorizedException('Refresh token expired.');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = request.user as User;
    const userId = user.id;
    if (!user) {
      throw new NotFoundException('کاربری با این مشخصات پیدا نشد.');
    }

    // Logic to change the passsword
    const compare = bcrypt.compareSync(newPassword, oldPassword);
    if (compare) {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(newPassword, salt);
      user.password = hash;
      await this.userRepository.save(user);
    }

    return user; // You might return some success message or the user info
  }
}
