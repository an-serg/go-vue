import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: "willsmith@gmail.ru",
    description: "Электронная почта пользователя"
  })
  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;
  
  @ApiProperty({
    example: "12345678",
    description: "Пароль пользователя"
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  password: string;
}