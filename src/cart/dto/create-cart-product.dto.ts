import { IsNotEmpty, IsMongoId, IsInt, Min } from 'class-validator';

export class CreateCartProductDto {

    @IsNotEmpty()
    @IsMongoId()
    productId: string; // Product being added to the cart

    @IsInt()
    @Min(1)
    quantity: number; // Quantity of the product being added
}
