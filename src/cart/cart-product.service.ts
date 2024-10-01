import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity'; // Import your Cart entity
import { Product } from 'src/product/entities/product.entity'; // Import your Product entity
import { CartProduct } from './entities/cart-product.entity'; // Import your CartProduct entity
import { MongoRepository, Repository } from 'typeorm';
import { CreateCartProductDto } from './dto/create-cart-product.dto'; // DTO for adding products to cart
import { ObjectId } from 'mongodb';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: MongoRepository<Cart>,
    @InjectRepository(Product)
    private productRepository: MongoRepository<Product>,
    @InjectRepository(CartProduct)
    private cartProductRepository: MongoRepository<CartProduct>,
  ) {}

  async addProductToCart(
    cartId: string,
    addProductToCartDto: CreateCartProductDto,
    userId: string,
  ) {
    // Fetch the cart by ID and ensure it belongs to the user
    const cart = await this.cartRepository.findOne({
      where: { _id: new ObjectId(cartId), userId },
    });
    if (!cart) {
      throw new NotFoundException(
        'Cart not found or does not belong to the user',
      );
    }

    // Fetch the product by ID
    const product = await this.productRepository.findOne({
      where: { _id: new ObjectId(addProductToCartDto.productId) },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Ensure the product has enough stock
    if (product.stock < addProductToCartDto.quantity) {
      throw new Error('Insufficient stock for the product');
    }

    // Check if the product already exists in the cart
    let cartProduct = await this.cartProductRepository.findOne({
      where: { cartId: cart.id.toString(), productId: product.id.toString() },
    });

    // Calculate the total price to add based on the product's price and quantity
    const totalPriceToAdd = product.price * addProductToCartDto.quantity;

    // Reduce the product's stock
    product.stock -= addProductToCartDto.quantity;

    if (cartProduct) {
      // If the product already exists in the cart, update the quantity and total price
      cartProduct.quantity += addProductToCartDto.quantity;
      await this.cartProductRepository.save(cartProduct); // Save the updated cart product

      // Update the cart's total price
      cart.totalPrice += totalPriceToAdd;
    } else {
      // If the product does not exist in the cart, create a new cart product entry
      cartProduct = this.cartProductRepository.create({
        cartId: cart.id.toString(),
        productId: product.id.toString(),
        quantity: addProductToCartDto.quantity,
      });
      await this.cartProductRepository.save(cartProduct); // Save the new cart product

      // Update the cart's total price
      cart.totalPrice += totalPriceToAdd;
    }

    // Save the updated product with reduced stock
    await this.productRepository.save(product);

    // Save and return the updated cart
    return this.cartRepository.save(cart);
  }

  async getCartProducts(cartId: string, userId: string) {
    // Fetch the cart by ID and ensure it belongs to the user
    const cart = await this.cartRepository.findOne({
      where: { _id: new ObjectId(cartId), userId },
    });
    if (!cart) {
      throw new NotFoundException(
        'Cart not found or does not belong to the user',
      );
    }

    // Fetch all products in the cart along with their quantities
    const cartProducts = await this.cartProductRepository.find({
      where: { cartId: cart.id.toString() },
      relations: ['product'],
    });

    // If no products are found, return an empty array
    if (!cartProducts.length) {
      return [];
    }

    // Map over the cart products to return product details along with quantities
    const productsWithQuantities = cartProducts.map((cartProduct) => ({
      productId: cartProduct.productId,
      quantity: cartProduct.quantity,
    }));

    return productsWithQuantities;
  }

  async removeProductFromCart(
    cartId: string,
    productId: string,
    userId: string,
  ) {
    // Fetch the cart by ID and ensure it belongs to the user
    const cart = await this.cartRepository.findOne({
      where: { _id: new ObjectId(cartId), userId },
    });
    if (!cart) {
      throw new NotFoundException(
        'Cart not found or does not belong to the user',
      );
    }

    // Fetch the product from the cart
    const cartProduct = await this.cartProductRepository.findOne({
      where: { cartId: cart.id.toString(), productId: productId.toString() },
    });
    if (!cartProduct) {
      throw new NotFoundException('Product not found in the cart');
    }

    // Fetch the product details to get the price and update stock
    const product = await this.productRepository.findOne({
      where: { _id: new ObjectId(productId) },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Calculate the total price to subtract based on the product's price and quantity
    const totalPriceToSubtract = product.price * cartProduct.quantity;

    // Return the stock to the product by adding back the removed quantity
    product.stock += cartProduct.quantity;

    // Update the cart's total price by subtracting the product price times its quantity
    cart.totalPrice -= totalPriceToSubtract;

    // Remove the product from the cart
    await this.cartProductRepository.delete(cartProduct.id); // Remove the CartProduct entry

    // Save the updated product stock
    await this.productRepository.save(product);

    // Save and return the updated cart
    return this.cartRepository.save(cart);
  }
}
