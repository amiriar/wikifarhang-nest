import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from 'src/entities/Otp.entity';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
  findOneByPhone(phone: string): Promise<User> {
    return this.userRepository.findOne({ where: { phoneNumber: phone } });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(phone: string, madeIn: string): Promise<User> {
    const user = this.userRepository.create({ phoneNumber: phone, madeIn });
    return this.userRepository.save(user);
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  // OTP

  generateOtp(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  async saveOtp(userId: string, otp: string): Promise<Otp> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('کاربری با این مشخصات پیدا نشد.');
    }

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 1); // Set OTP expiration to 2 minutes

    const newOtp = this.otpRepository.create({
      otp,
      user,
      expiresAt: expirationTime,
    });

    user.otp = otp;
    user.otpExpiresAt = expirationTime;
  
    await this.userRepository.save(user);

    return await this.otpRepository.save(newOtp);
  }

  async sendOtpToPhone(phone: string, otp: string): Promise<void> {
    // Send OTP to the phone number using an SMS service
  }

  // OTP
}
