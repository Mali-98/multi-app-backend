import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { RolesGuard } from 'src/auth/decorator/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CartController],
  providers: [CartService, RolesGuard, JwtService,],
})
export class CartModule { }
