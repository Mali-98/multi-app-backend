import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get('/:userId')
  async findOneById(@Param('userId') userId: string) {
    return this.userService.findOneById(userId);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Delete('/:userId')
  async remove(@Param('userId') userId: string) {
    return this.userService.delete(userId);
  }
}
