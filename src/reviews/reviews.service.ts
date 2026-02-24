import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayloadType } from 'src/utilits/types';
import { CreateReviewDto } from './dto/review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entity/review.entity';
import { UsersService } from 'src/users/user.service';
import { ProductEntity } from 'src/products/entity/product.entity';
import { ProductService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    private readonly userService: UsersService,
    private readonly productService: ProductService,
  ) {}

  async findAllReviews() {
    return await this.reviewRepo.find();
  }

  public async createNewReview(
    productId: number,
    userId: number,
    createReviewDto: CreateReviewDto,
  ) {
    const user = await this.userService.currentUser(userId);
    const product = await this.productService.getProductById(productId);

    const review = this.reviewRepo.create({
      ...createReviewDto,
      user,
      product,
    });
    const result = await this.reviewRepo.save(review);
    return {
      id: result.id,
      description: result.description,
      rating: result.rating,
      user: result.user.id,
      product: result.product.id,
    };
  }

  public async getReviewById(id: number) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException();
    return review;
  }

  // public async updateReview(
  //   updatereviewDto: UpdateReviewDto,
  //   id: number,
  //   payLoad: JwtPayloadType,
  // ) {
  //   const { description, rating, productId } = updatereviewDto;
  //   const user = await this.userService.getUserById(payLoad.id);
  //   const review = await this.getReviewById(id);
  //   const userId = payLoad.id;
  //   const reviewUserId = review.user.id;
  //   const product = await this.productService.getProductById(productId);

  //   if (reviewUserId === userId) {
  //     review.description = description ?? review.description;
  //     review.rating = rating ?? review.rating;
  //     review.productId = productId ?? review.product;
  //   } else {
  //     return 'only the author of this review can modify it';
  //   }
  //   return review;
  // }

  public async removeReview(id: number) {
    return await this.reviewRepo.softDelete(id);
  }
}
