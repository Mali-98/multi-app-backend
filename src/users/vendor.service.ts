import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>,
    ) { }

    async createVendor(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.userRepository.save(user);
    }

    async findOneById(id: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { _id: new ObjectId(id), role: 'vendor' } });
    }

    async findAllVendors(): Promise<User[]> {
        return this.userRepository.find({ where: { role: 'vendor' } });
    }

    async deleteVendor(id: string): Promise<void> {
        const objectId = new ObjectId(id);
        await this.userRepository.delete({ id: objectId }); // Match the 'id' field
    }
}
