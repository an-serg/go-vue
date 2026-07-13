import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'willsmith_original', 
    description: 'Уникальная ссылка на профиль пользователя'
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Только буквы, цифры и подчёркивания' })
  username: string;

  @ApiProperty({ 
    example: 'Will Smith', 
    description: 'Имя пользователя'
  })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  nick: string;

  @ApiProperty({ 
    example: 'willsmith@gmail.ru', 
    description: 'Почта пользователя'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: '12345678', 
    description: 'Пароль (миниимум 8 символов)'
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ 
    example: '12345678', 
    description: 'Повтор пароля'
  })
  @IsString()
  confirmPassword: string;
}