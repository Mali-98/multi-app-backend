import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { RolesGuard } from 'src/auth/decorator/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { CartProductController } from './cart-product.controller';
import { CartProductService } from './cart-product.service';
import { Product } from 'src/product/entities/product.entity';
import { CartProduct } from './entities/cart-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Cart]), TypeOrmModule.forFeature([Product]), TypeOrmModule.forFeature([CartProduct])],
  controllers: [CartController, CartProductController],
  providers: [CartService, RolesGuard, JwtService, UserService, CartProductService],
})
export class CartModule { }
