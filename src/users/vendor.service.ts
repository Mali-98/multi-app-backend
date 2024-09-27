import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { Role } from 'src/auth/decorator/roles.enum';

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>,
    ) { }

    async createVendor(createVendorDto: CreateVendorDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createVendorDto.password, 10);
        const user = this.userRepository.create({
            ...createVendorDto,
            password: hashedPassword,
            role: Role.Vendor
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
