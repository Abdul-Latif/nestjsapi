import { ReviewsModule } from './../reviews/reviews.module';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './usres.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [forwardRef(() => ReviewsModule)],
  exports: [UsersService],
})
export class UsersModule {}
