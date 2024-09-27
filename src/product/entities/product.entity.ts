import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity({ name: 'product' })
export class Product {
    @ObjectIdColumn() // Use ObjectIdColumn for MongoDB
    id: ObjectId; // MongoDB ObjectId for the product

    @Column({ unique: true })
    name: string; // Unique name of the product

    @Column()
    description: string; // Brief description of the product

    @Column()
    price: number; // Price of the product

    @Column()
    stock: number; // Quantity of product in stock

    @Column()
    vendorId: ObjectId; // Reference to the Vendor who sells this product
}
