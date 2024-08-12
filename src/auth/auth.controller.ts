import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UsersService } from 'src/admin/users/users.service';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment-jalaali';
import { AuthGuard } from 'src/guard/AuthGuard.guard';
moment.loadPersian();



@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const lastDateIn = moment().format('jYYYY/jMM/jDD HH:mm');
    const user = await this.authService.validateUser(username, password, lastDateIn);
    const { accessToken } = await this.authService.signToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 86400000,
    });
    res.send({ message: 'Login successful' });
  }

  @Post('register')
  @HttpCode(201)
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const existingUserByUsername =
      await this.userService.findOneByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    const existingUserByEmail = await this.userService.findOneByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const lastDateIn = moment().format('jYYYY/jMM/jDD HH:mm');

    const newUser = await this.authService.register(
      username,
      email,
      hashedPassword,
      lastDateIn
    );
    const { accessToken } = await this.authService.signToken(newUser);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 86400000,
    });
    res.status(200).send({ message: 'Registration successful', user: newUser });
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
