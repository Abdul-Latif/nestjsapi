import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewDto {
  @MinLength(4)
  @MaxLength(140)
  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
