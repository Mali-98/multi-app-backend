import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: MongoRepository<Product>,
  ) { }

  async createProduct(createProductDto: CreateProductDto, vendorId: ObjectId): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      vendorId, // Add the vendorId when creating the product
    });
    return this.productRepository.save(product);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.productRepository.findOneBy({ id });
  }

  async findProductById(id: string): Promise<Product> {
    let _result = await this.productRepository.findOne({ where: { _id: new ObjectId(id) } });
    return _result;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }
}
