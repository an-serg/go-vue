import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: "willsmith@gmail.ru",
    description: "Электронная почта пользователя"
  })
  @IsEmail()
  email: string;
  
  @ApiProperty({
    example: "12345678",
    description: "Пароль пользователя"
  })
  @IsString()
  password: string;
}