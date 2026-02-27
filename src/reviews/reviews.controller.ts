import { AuthGuard } from './../users/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { JwtPayloadType } from 'src/utilits/types';
import { AuthRoleGuard } from 'src/users/guards/auth-role.guard';
import { Roles } from 'src/users/decorators/role.decorator';
import { UserType } from 'src/utilits/user-type.enum';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('get-all-reviews')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  public async findAllReviews(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('reviewPerPage', ParseIntPipe) reviewPerPage: number,
  ) {
    return await this.reviewsService.findAllReviews(pageNumber, reviewPerPage);
  }

  @Post('create-new-review/:id')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN, UserType.USER)
  public async createNewReview(
    @Param('id', ParseIntPipe) productId: number,
    @CurrentUser() payload: JwtPayloadType,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return await this.reviewsService.createNewReview(
      productId,
      payload.id,
      createReviewDto,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  public async getReviewById(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewsService.getReviewById(id);
  }

  @Patch('update-review/:id')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.USER, UserType.ADMIN)
  public async updateReview(
    @Body() updatereviewDto: UpdateReviewDto,
    @Param('id', ParseIntPipe) reviewId: number,
    @CurrentUser() payLoad: JwtPayloadType,
  ) {
    return await this.reviewsService.updateReview(
      updatereviewDto,
      reviewId,
      payLoad.id,
    );
  }

  @Delete(':id')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN, UserType.USER)
  public async removeReview(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewsService.removeReview(id);
  }
}
