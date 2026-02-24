import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
