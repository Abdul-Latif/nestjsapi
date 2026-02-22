import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import { ReviewEntity } from 'src/reviews/entity/review.entity';
import { UsersModule } from 'src/users/user.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductService],
  imports: [
    TypeOrmModule.forFeature([ProductEntity, UserEntity, ReviewEntity]),
    JwtModule,
    UsersModule,
  ],
})
export class ProductsModule {}
