import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(4)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
