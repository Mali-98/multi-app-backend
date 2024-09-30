import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/decorator/roles.enum';
import { RolesGuard } from 'src/auth/decorator/roles.guard';
import { UserService } from 'src/users/users.service';

@Controller('carts')
@Roles(Role.Consumer) // Only allow admins to access this route
@UseGuards(RolesGuard) // Apply the guard at the controller level
export class CartController {
  constructor(private readonly cartService: CartService,
    private userService: UserService,
  ) { }

  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    const consumer = await this.userService.findOneById(createCartDto.userId);
    if (!consumer) {
      throw new Error('Consumer not found'); // Handle the error as per your requirements
    }
    return this.cartService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartService.update(+id, updateCartDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.delete(id);
  }
}
