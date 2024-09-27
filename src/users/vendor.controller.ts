import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { VendorService } from 'src/users/vendor.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/decorator/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/decorator/roles.enum';

@Controller('vendor')
@Roles(Role.Vendor) // Only allow admins to access this route
@UseGuards(RolesGuard) // Apply the guard at the controller level
export class VendorController {
    constructor(private readonly vendorService: VendorService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.vendorService.createVendor(createUserDto);
    }

    @Get('/:userId')
    async findOneById(@Param('userId') userId: string) {
        return this.vendorService.findOneById(userId);
    }

    @Get()
    async findAll() {
        return this.vendorService.findAllVendors();
    }

    @Delete('/:userId')
    async remove(@Param('userId') userId: string) {
        return this.vendorService.deleteVendor(userId);
    }
}
