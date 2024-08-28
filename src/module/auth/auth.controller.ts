// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment-jalaali';
import { AuthService } from './auth.service';
import { UsersService } from 'src/module/admin/users/users.service';
import { AuthGuard } from 'src/common/guard/AuthGuard.guard';
import { User } from 'src/entities/User.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

moment.loadPersian();

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('send-otp')
  @HttpCode(201)
  @ApiTags('Authentication')
  @ApiOperation({ summary: "Send OTP to user's phone" })
  @ApiBody({ schema: { properties: { phone: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'OTP sent successfully.' })
  @ApiResponse({ status: 400, description: 'Phone number is required.' })
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

  @Post('login')
  @HttpCode(200)
  @ApiTags('Authentication')
  @ApiOperation({ summary: 'User login with phone and OTP' })
  @ApiBody({
    schema: {
      properties: { phone: { type: 'string' }, code: { type: 'string' } },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid OTP or phone number.' })
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
  @UseGuards(AuthGuard)
  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Logout the user' })
  @ApiResponse({ status: 200, description: 'Logout successful.' })
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.send({ message: 'logout successful' });
  }

  @Post('change-pass')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiTags('Authentication')
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({
    schema: {
      properties: {
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async changePassword(
    @Body() oldPassword: string,
    @Body() newPassword: string,
  ) {
    return this.authService.changePassword(oldPassword, newPassword);
  }
}
