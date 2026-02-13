import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ReviewsService } from 'src/reviews/reviews.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => ReviewsService))
    private readonly reviewsService: ReviewsService,
  ) {}
  findAllUsers() {
    return [
      { id: 1, user: 'ahmed', age: 20 },
      { id: 5, user: 'ali', age: 25 },
      { id: 10, user: 'osama', age: 25 },
    ];
  }
}
