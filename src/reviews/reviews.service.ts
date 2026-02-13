import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/usres.service';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
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
