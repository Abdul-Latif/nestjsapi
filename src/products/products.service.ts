import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  /**
   *
   * get all products
   */
  async findProducts() {
    return await this.productRepo.find();
  }

  /**
   *
   *create new product
   */
  async createNewProduct(createProductDto: CreateProductDto) {
    const product = this.productRepo.create({
      ...createProductDto,
    });
    return await this.productRepo.save(product);
  }

  /**
   *
   * get product by Id
   */
  async getProductById(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException();
    return product;
  }

  /**
   *
   * update products by id
   */
  async updateProduct(id: number, body: UpdateProductDto) {
    const product = await this.getProductById(id);

    product.title = body.title ?? product.title;
    product.price = body.price ?? product.price;
    product.description = body.description ?? product.description;
    return await this.productRepo.save(product);
  }

  /**
   *
   * delete product by id
   */
  async deleteProduct(id: number) {
    const Product = await this.getProductById(id);
    return await this.productRepo.softDelete(id);
  }
}
