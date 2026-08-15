import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'willsmith_original', 
    description: 'Уникальная ссылка на профиль пользователя'
  })
  @IsString({ message: 'Username должен быть строкой' }) 
  @MinLength(3, { message: 'Username минимум 3 символа' })
  @MaxLength(20, { message: 'Username максимум 20 символов' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Только буквы, цифры и подчёркивания' })
  username: string;

  @ApiProperty({ 
    example: 'Will Smith', 
    description: 'Имя профиля'
  })
  @IsString({ message: 'Имя профиля должно быть строкой' })
  @MinLength(1, { message: 'Имя профиля не может быть пустым' })
  @MaxLength(30, { message: 'Имя профиля максимум 30 символов' })
  nick: string;

  @ApiProperty({ 
    example: 'willsmith@gmail.ru', 
    description: 'Почта пользователя'
  })
  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;

  @ApiProperty({ 
    example: '12345678', 
    description: 'Пароль (миниимум 8 символов)'
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(8, { message: 'Пароль минимум 8 символов' })
  password: string;

  @ApiProperty({ 
    example: '12345678', 
    description: 'Повтор пароля'
  })
  @IsString({ message: 'Подтверждение пароля должно быть строкой' })
  confirmPassword: string;
}