import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from 'src/product/entities/product.entity';
import { RolesGuard } from 'src/auth/decorator/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { VendorService } from 'src/users/vendor.service';
import { UserModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), TypeOrmModule.forFeature([User]), UserModule], // Add Product entity here
  providers: [ProductService, RolesGuard, JwtService, VendorService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule { }
