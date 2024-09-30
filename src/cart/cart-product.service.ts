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
    ) { }

    async addProductToCart(cartId: string, addProductToCartDto: CreateCartProductDto, userId: string) {
        // Fetch the cart by ID
        const cart = await this.cartRepository.findOne({ where: { _id: new ObjectId(cartId) } });
        if (!cart) {
            throw new NotFoundException('Cart not found or does not belong to the user');
        }

        // Fetch the product by ID
        const product = await this.productRepository.findOne({ where: { _id: new ObjectId(addProductToCartDto.productId) } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Check if the product already exists in the cart
        let cartProduct = await this.cartProductRepository.findOne({ where: { cartId, productId: product.id } });

        // Calculate the total price based on the product's price and quantity
        const totalPriceToAdd = product.price * addProductToCartDto.quantity;

        if (cartProduct) {
            // If it exists, update the quantity and total price
            cartProduct.quantity += addProductToCartDto.quantity; // Increment quantity
            await this.cartProductRepository.save(cartProduct); // Save the updated CartProduct

            // Update the cart's total price
            cart.totalPrice += totalPriceToAdd; // Increment total price
        } else {
            // If it doesn't exist, create a new CartProduct
            cartProduct = this.cartProductRepository.create({
                cartId,
                productId: product.id,
                quantity: addProductToCartDto.quantity,
            });
            await this.cartProductRepository.save(cartProduct); // Save the new CartProduct

            // Update the cart's total price
            cart.totalPrice += totalPriceToAdd; // Increment total price
        }

        // Save the updated cart
        return this.cartRepository.save(cart);
    }

    async removeProductFromCart(cartId: string, productId: string, userId: string) {
        // Fetch the cart by ID
        const cart = await this.cartRepository.findOne({ where: { _id: new ObjectId(cartId) } });
        if (!cart) {
            throw new NotFoundException('Cart not found or does not belong to the user');
        }

        // Fetch the product from the cart
        const cartProduct = await this.cartProductRepository.findOne({ where: { cartId, productId } });
        if (!cartProduct) {
            throw new NotFoundException('Product not found in the cart');
        }

        // Fetch the product details to get the price
        const product = await this.productRepository.findOne({ where: { _id: new ObjectId(productId) } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Update the cart's total price by subtracting the product price times its quantity
        cart.totalPrice -= product.price * cartProduct.quantity;

        // Remove the product from the cart
        await this.cartProductRepository.delete(cartProduct.id); // Remove the CartProduct entry

        // Save the updated cart
        return this.cartRepository.save(cart);
    }


}
