import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(150)
  title?: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsOptional()
  price?: number;
}
