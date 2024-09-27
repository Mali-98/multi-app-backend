import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsString()
    @IsNotEmpty()
    vendorId: string; // Ensure the vendorId is passed as a string (MongoDB ObjectId)
}
