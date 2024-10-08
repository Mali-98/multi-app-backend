import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtPayload, RolesGuard } from 'src/auth/decorator/roles.guard'; // Interface for your JWT payload
import { ObjectId } from 'mongodb';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/decorator/roles.enum';
import { VendorService } from 'src/users/vendor.service';

@Controller('products')
@Roles(Role.Vendor) // Only allow admins to access this route
@UseGuards(RolesGuard) // Apply the guard at the controller level
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private vendorService: VendorService,
  ) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    const vendor_id = req.user.id;
    const vendorId = new ObjectId(vendor_id); // Convert vendorId
    return this.productService.createProduct(createProductDto, vendorId);
  }

  @Roles(Role.Vendor, Role.Consumer, Role.Admin)
  @Get()
  findAll() {
    return this.productService.findAllProducts();
  }

  @Roles(Role.Vendor, Role.Consumer, Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findProductById(id);
  }

  @Get('vendor/:vendorId') // New endpoint to get products by vendor ID
  async findProductsByVendorId(@Param('vendorId') vendorId: string) {
    const id = new ObjectId(vendorId); // Convert vendorId to ObjectId
    return this.productService.findProductsByVendorId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
