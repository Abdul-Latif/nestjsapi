import { forwardRef, Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entity/user.entity';
import { ReviewEntity } from './entity/review.entity';
import { ProductEntity } from 'src/products/entity/product.entity';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([UserEntity, ReviewEntity, ProductEntity]),
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
