import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { RolesGuard } from 'src/auth/decorator/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [CartController],
  providers: [CartService, RolesGuard, JwtService, UserService],
})
export class CartModule { }
