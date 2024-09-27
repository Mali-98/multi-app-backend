import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { UserController } from 'src/users/users.controller';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { RolesGuard } from 'src/auth/decorator/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, VendorService, RolesGuard, JwtService],
  controllers: [UserController, VendorController],
  exports: [UserService], // Add this line to export UserService
})
export class UserModule { }
