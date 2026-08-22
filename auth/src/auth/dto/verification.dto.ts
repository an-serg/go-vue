import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ description: 'Токен из письма' })
  @IsString({ message: 'Токен должен быть строкой' })
  @IsNotEmpty({ message: 'Токен обязателен' })
  token: string;
}

export class ResendDto {
  @ApiProperty({ example: 'willsmith@gmail.ru', description: 'Почта аккаунта' })
  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;
}
