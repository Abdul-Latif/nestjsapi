import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LogInDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
