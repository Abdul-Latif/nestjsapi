import { ReviewsService } from './../reviews/reviews.service';
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './usres.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get('get-all-users')
  findAllUsers() {
    return this.usersService.findAllUsers();
  }
}
