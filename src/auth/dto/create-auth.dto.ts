import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '../decorator/roles.enum';

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    @IsNotEmpty()
    role: Role; // e.g., 'admin', 'vendor', 'rider'
}
