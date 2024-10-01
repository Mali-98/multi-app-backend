import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ObjectId } from 'mongodb';
import { CartProduct } from './entities/cart-product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: MongoRepository<Cart>,
    @InjectRepository(CartProduct)
    private cartProductRepository: MongoRepository<CartProduct>,
  ) {}

  // Create a new cart
  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const { userId } = createCartDto;

    const cart = this.cartRepository.create({
      ...CreateCartDto,
      userId: userId,
      totalPrice: 0, // Initial value, products management will update this
    });

    return this.cartRepository.save(cart);
  }

  // Find all carts
  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find();
  }

  async findAllByUserId(userId: string): Promise<Cart[]> {
    console.log(userId);
    return this.cartRepository.find({
      where: { userId: userId },
    }); // Fetch all carts for the user
  }

  // Find a specific cart by ID
  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  // Update a cart (you could update userId or totalPrice)
  // async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
  //   const cart = await this.findOne(id);

  //   if (updateCartDto.totalPrice !== undefined) {
  //     cart.totalPrice = updateCartDto.totalPrice;
  //   }

  //   if (updateCartDto.userId) {
  //     cart.userId = new ObjectId(updateCartDto.userId);
  //   }

  //   return this.cartRepository.save(cart);
  // }

  async delete(id: string): Promise<void> {
    const objectId = new ObjectId(id);
    // Remove all related CartProduct records
    await this.cartProductRepository.delete({ cartId: id });
    await this.cartRepository.delete({ id: objectId }); // Match the 'id' field
  }
}
