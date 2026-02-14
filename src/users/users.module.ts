import { ReviewsModule } from './../reviews/reviews.module';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './usres.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ReviewEntity } from 'src/reviews/entity/review.entity';
import { ProductEntity } from 'src/products/entity/product.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    forwardRef(() => ReviewsModule),
    TypeOrmModule.forFeature([UserEntity, ReviewEntity, ProductEntity]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
