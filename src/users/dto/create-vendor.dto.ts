import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from 'src/auth/decorator/roles.enum';

export class CreateVendorDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
