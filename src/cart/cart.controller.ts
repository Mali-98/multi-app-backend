import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
  constructor(
    private readonly cartService: CartService,
    private userService: UserService,
  ) { }

  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    const consumer = await this.userService.findOneById(createCartDto.userId);
    if (!consumer) {
      throw new NotFoundException('Consumer not found');
    }
    return this.cartService.create(createCartDto);
  }

  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get()
  async findAllUnderConsumer(@Request() req) {
    const userId = req.user.id; // Get the user's ID from the request object
    return this.cartService.findAllByUserId(userId); // Fetch carts created by this user
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const user = req.user; // Assuming `req.user` contains the authenticated user
    const userId = user.id;

    // Fetch the cart by ID
    const cart = await this.cartService.findOne(id);

    // Check if the cart belongs to the authenticated user
    if (cart.userId.toString() !== userId.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to view this cart',
      );
    }

    return cart;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartService.update(+id, updateCartDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const user = req.user; // Assuming `req.user` contains the authenticated user
    const userId = user.id;

    // Fetch the cart by ID
    const cart = await this.cartService.findOne(id);

    // Check if the cart belongs to the authenticated user
    if (cart.userId.toString() !== userId.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to delete this cart',
      );
    }

    // Proceed to delete the cart if it belongs to the user
    return this.cartService.delete(id);
  }
}
