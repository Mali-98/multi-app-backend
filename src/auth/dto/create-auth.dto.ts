import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    role: string; // e.g., 'admin', 'vendor', 'rider'
}
