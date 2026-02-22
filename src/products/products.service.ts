import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entity/product.entity';
import { Between, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly userService: UsersService,
  ) {}

  /**
   *
   * get all products
   * @returns collection of all products
   */
  async findProducts(title?: string, minPrice?: string, maxPrice?: string) {
    const filters = {
      ...(title ? { title: Like(`%${title}%`) } : {}),
      ...(minPrice && maxPrice
        ? { price: Between(parseInt(minPrice), parseInt(maxPrice)) }
        : {}),
    };
    return await this.productRepo.find({
      where: filters,
    });
  }

  /**
   * create new product
   * @param createProductDto
   * @param userId
   * @returns new created product
   */
  async createNewProduct(createProductDto: CreateProductDto, userId: number) {
    const user = await this.userService.currentUser(userId);
    const product = this.productRepo.create({
      ...createProductDto,
      title: createProductDto.title.toLowerCase(),
      user,
    });
    return await this.productRepo.save(product);
  }
  /**
   *
   * @param id id of the prodct
   * @returns product entity
   */
  async getProductById(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException();
    return product;
  }

  /**
   *
   * @param id id of the prodct
   * @param body dto of the updated prodct
   * @returns a success message
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
   * @param id of the product
   * @returns sucess message
   */
  async deleteProduct(id: number) {
    const Product = await this.getProductById(id);
    return await this.productRepo.softDelete(id);
  }
}
