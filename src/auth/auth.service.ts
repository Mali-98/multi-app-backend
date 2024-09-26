import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto'; // Ensure you have a DTO for registration
import { JwtService } from '@nestjs/jwt'; // Import JWT service for token generation

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService // Inject JWT service
  ) { }

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    const user = this.userRepository.create({
      ...createAuthDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id }; // Customize as needed
    return {
      access_token: this.jwtService.sign(payload), // Generate JWT token
    };
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }
}
