import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Cart } from './cart.entity';
import { ObjectId } from 'mongodb';

@Entity('cart_product')
export class CartProduct {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    cartId: ObjectId; // Foreign key for the Cart

    @Column()
    productId: ObjectId; // Foreign key for the Product

    @Column({ type: 'int', default: 1 })
    quantity: number; // Quantity of this product in the cart
}
