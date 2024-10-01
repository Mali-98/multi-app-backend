import {
  Controller,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Delete,
  Get,
} from '@nestjs/common';
import { CartProductService } from './cart-product.service'; // Import your CartProductService
import { CreateCartProductDto } from './dto/create-cart-product.dto'; // DTO for adding products to cart
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/decorator/roles.enum';
import { RolesGuard } from 'src/auth/decorator/roles.guard';

@Controller('carts/:cartId/products')
@Roles(Role.Consumer) // Only allow admins to access this route
@UseGuards(RolesGuard) // Apply the guard at the controller level
export class CartProductController {
  constructor(private readonly cartProductService: CartProductService) {}

  @Post()
  async addProductToCart(
    @Param('cartId') cartId: string,
    @Body() addProductToCartDto: CreateCartProductDto,
    @Request() req,
  ) {
    const userId = req.user.id; // Get the user's ID from the request object
    return this.cartProductService.addProductToCart(
      cartId,
      addProductToCartDto,
      userId,
    ); // Add product to the cart
  }

  @Get()
  async getProductsInCart(@Param('cartId') cartId: string, @Request() req) {
    console.log('Get products in cart');
    const userId = req.user.id; // Get the user ID from the request object (JWT)
    return this.cartProductService.getCartProducts(cartId, userId);
  }

  @Delete('/:productId')
  async removeProductFromCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Request() req,
  ) {
    const userId = req.user.id; // Get the user's ID from the request object
    return this.cartProductService.removeProductFromCart(
      cartId,
      productId,
      userId,
    );
  }
}
