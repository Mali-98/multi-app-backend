import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from 'src/auth/decorator/roles.enum';

export class CreateUserDto {
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
