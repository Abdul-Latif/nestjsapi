import { UserType } from 'src/utilits/user-type.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayloadType } from 'src/utilits/types';
import { CreateReviewDto } from './dto/review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entity/review.entity';
import { UsersService } from 'src/users/user.service';
import { ProductEntity } from 'src/products/entity/product.entity';
import { ProductService } from 'src/products/products.service';
import { reverse } from 'dns';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    private readonly userService: UsersService,
    private readonly productService: ProductService,
  ) {}

  async findAllReviews(pageNumber: number, reviewPerPage: number) {
    return await this.reviewRepo.find({
      skip: reviewPerPage * (pageNumber - 1),
      take: reviewPerPage,
      order: { createdAt: 'DESC' },
    });
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

  public async updateReview(
    updatereviewDto: UpdateReviewDto,
    reviewId: number,
    userId: number,
  ) {
    const review = await this.getReviewById(reviewId);
    const user = await this.userService.currentUser(userId);
    if (userId != user.id) throw new ForbiddenException();
    review.description = updatereviewDto.description ?? review.description;
    review.rating = updatereviewDto.rating ?? review.rating;

    return await this.reviewRepo.save(review);
  }

  public async removeReview(id: number) {
    const reveiw = await this.getReviewById(id);
    return await this.reviewRepo.delete(reveiw.id);
  }
}
