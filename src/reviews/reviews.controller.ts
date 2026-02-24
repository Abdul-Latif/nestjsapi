import { UserEntity } from 'src/users/entity/user.entity';
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
  public async findAllReviews() {
    return this.reviewsService.findAllReviews();
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

  // @Patch('update-review/:id')
  // @UseGuards(AuthGuard)
  // public async updateReview(
  //   @Body() updatereviewDto: UpdateReviewDto,
  //   @Param('id', ParseIntPipe) id: number,
  //   @CurrentUser() payLoad: JwtPayloadType,
  // ) {
  //   return await this.reviewsService.updateReview(updatereviewDto, id, payLoad);
  // }

  @Delete('id')
  @UseGuards(AuthGuard)
  public async removeReview(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewsService.removeReview(id);
  }
}
