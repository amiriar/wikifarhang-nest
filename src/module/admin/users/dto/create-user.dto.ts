import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

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
