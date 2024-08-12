import { IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  verified?: string;

  @IsOptional()
  roles?: string;

  @IsOptional()
  articles?: string[];
}
