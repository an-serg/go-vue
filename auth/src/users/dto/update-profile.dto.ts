import { IsOptional, IsString, MaxLength, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: "I was born in 1984. My name is George and im a writter",
    description: "Описание профиля"
  })
  @IsOptional()
  @IsString({ message: 'Допускаются только текстовые значения' })
  @MaxLength(500, { message: 'Не более 500 символов.' })
  bio?: string;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}