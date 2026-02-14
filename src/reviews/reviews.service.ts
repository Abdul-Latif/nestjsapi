import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor() {}
  findAllReviews() {
    return [
      {
        id: 1,
        rank: 5,
        review: 'excellent',
      },
    ];
  }
}
