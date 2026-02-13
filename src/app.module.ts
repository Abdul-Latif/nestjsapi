import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProductsModule,
    ReviewsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      host: 'localhost',
      port: 5432,
      synchronize: true,
      autoLoadEntities: true,
      password: '12345',
      database: 'DB',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
    }),
  ],
})
export class AppModule {}
