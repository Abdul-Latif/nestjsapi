import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;
}
