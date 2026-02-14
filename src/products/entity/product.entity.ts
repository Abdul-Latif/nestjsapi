import { ReviewEntity } from 'src/reviews/entity/review.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: '150' })
  title: string;
  @Column({ type: 'float' })
  price: number;
  @Column()
  description: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ReviewEntity, (r) => r.product)
  reviews: ReviewEntity[];
  @ManyToOne(() => UserEntity, (u) => u.product)
  user: UserEntity;
}
