import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ username });
  }

  async findOneById(id: string): Promise<User | undefined> {
    let _result = await this.userRepository.findOne({ where: { _id: new ObjectId(id) } });
    return _result;
  }

  async findAll() {
    return this.userRepository.find();
  }

  async delete(id: string): Promise<void> {
    const objectId = new ObjectId(id);
    await this.userRepository.delete({ id: objectId }); // Match the 'id' field
  }
}
