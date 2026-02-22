import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ReviewEntity } from 'src/reviews/entity/review.entity';
import { ProductEntity } from 'src/products/entity/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from './auth.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthProvider],
  imports: [
    TypeOrmModule.forFeature([UserEntity, ReviewEntity, ProductEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: config.get<number>('JWT_EXPIRES_IN') },
        };
      },
    }),
  ],
  exports: [UsersService],
})
export class UsersModule {}
