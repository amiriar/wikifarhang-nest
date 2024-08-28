import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/module/admin/users/users.service';
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const cookies = cookie.parse(request.headers.cookie || '');
      const token = cookies['accessToken'];

      if (!token) {
        throw new UnauthorizedException(
          'دسترسی بدون ورود به حساب کاربری مجاز نیست.',
        );
      }

      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this.usersService.findOne(decodedToken.id)
      request.user = user;

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'زمان نشست شما به پایان رسیده است. لطفاً مجدداً وارد شوید.',
        );
      } else if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('توکن معتبر نیست.');
      } else {
        throw new UnauthorizedException(
          'لطفاً برای دسترسی وارد حساب کاربری خود شوید.',
        );
      }
    }
  }
}
