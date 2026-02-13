import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UsersService } from 'src/users/usres.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private reviewsService: ReviewsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('get-all-reviews')
  findAllReviews() {
    return this.reviewsService.findAllReviews();
  }
}
