import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateCartDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: string; // Id of the user creating the cart
}
