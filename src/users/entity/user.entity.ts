import { ProductEntity } from 'src/products/entity/product.entity';
import { ReviewEntity } from 'src/reviews/entity/review.entity';
import { UserType } from 'src/utilits/user-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  userName: string;

  @Column({ type: 'varchar', length: 250, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.USER })
  userType: UserType;

  @Column({ type: 'boolean', default: false })
  isValidated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ProductEntity, (p) => p.user)
  product: ProductEntity[];

  @OneToMany(() => ReviewEntity, (r) => r.user)
  review: ReviewEntity[];
}
