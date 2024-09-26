import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs'; // Correctly import bcrypt

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
