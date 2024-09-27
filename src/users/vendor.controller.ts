import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { VendorService } from 'src/users/vendor.service';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/decorator/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/decorator/roles.enum';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Controller('vendors')
@Roles(Role.Vendor) // Only allow admins to access this route
@UseGuards(RolesGuard) // Apply the guard at the controller level
export class VendorController {
    constructor(private readonly vendorService: VendorService) { }

    @Post()
    async create(@Body() createVendorDto: CreateVendorDto): Promise<User> {
        console.log(createVendorDto);
        return this.vendorService.createVendor(createVendorDto);
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
