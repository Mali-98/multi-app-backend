import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/decorator/roles.enum';
import { RolesGuard } from 'src/auth/decorator/roles.guard';

@Controller('users')
@Roles(Role.Admin) // Only allow admins to access this route
@UseGuards(RolesGuard) // Apply the guard at the controller level
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
