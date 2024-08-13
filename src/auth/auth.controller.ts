import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UsersService } from 'src/admin/users/users.service';
import * as moment from 'moment-jalaali';
import { AuthGuard } from 'src/guard/AuthGuard.guard';
import { User } from 'src/entities/User.entity';
moment.loadPersian();

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('send-otp')
  @HttpCode(201)
  async sendOTP(@Body('phone') phone: string) {
    if (!phone) {
      throw new BadRequestException('شماره تلفن مورد نیاز است.');
    }

    const madeIn = moment().format('jYYYY/jMM/jDD HH:mm');

    let user: User = await this.userService.findOneByPhone(phone);

    if (!user) {
      user = await this.userService.createUser(phone, madeIn);
    }

    const otp = this.userService.generateOtp();
    await this.userService.saveOtp(user.id, otp);

    await this.userService.sendOtpToPhone(phone, otp); 

    return {
      message: 'OTP با موفقیت ارسال شد.',
      otp,
    };
  }

  @Post()
  @HttpCode(200)
  async login(
    @Body('phone') phone: string,
    @Body('code') code: string,
    @Res() res: Response,
  ) {
    const lastDateIn = moment().format('jYYYY/jMM/jDD HH:mm');
    const user = await this.authService.validateUser(phone, code, lastDateIn);
    const { accessToken } = await this.authService.signToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 86400000,
    });
    res.status(200).send({ message: 'با موفقیت وارد شدید.' });
  }


  @Post('logout')
  @HttpCode(200)
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.send({ message: 'logout successful' });
  }

  @Post('change-pass')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async changePassword(@Body() oldPassword: string, newPassword: string) {
    return this.authService.changePassword(oldPassword, newPassword);
  }

}
