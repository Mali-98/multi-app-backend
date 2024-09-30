import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ObjectId } from 'mongodb';

@Entity('cart')
export class Cart {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    userId: string; // Foreign key for the User

    @Column({ type: 'decimal', default: 0 })
    totalPrice: number; // Total price of products in the cart
}
