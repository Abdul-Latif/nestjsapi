import { ProductEntity } from 'src/products/entity/product.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reviews' })
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @Column({ type: 'int' })
  rating: number;

  @ManyToOne(() => ProductEntity, (p) => p.reviews, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (u) => u.review, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
