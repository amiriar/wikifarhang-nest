import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities/User.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('admin/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // Get all users
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Get a user by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Get(':id')
  async findOneByPhone(@Body('phone') phone: string): Promise<User> {
    const user = await this.userService.findOneByPhone(phone);
    if (!user) {
      throw new NotFoundException(`User with phone ${phone} not found`);
    }
    return user;
  }

  // Create a new user
  // @Post()
  // async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.userService.createUser(
  //     createUserDto.phoneNumber,
  //   );
  // }

  // Update a user
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    return this.userService.saveUser(user);
  }

  // Delete a user
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userService.deleteUser(id);
    return true
  }
}
