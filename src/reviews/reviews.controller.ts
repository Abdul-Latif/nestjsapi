import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UsersService } from 'src/users/users.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('get-all-reviews')
  findAllReviews() {
    return this.reviewsService.findAllReviews();
  }
}
