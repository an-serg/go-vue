import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterDto } from '../users/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    // Проверяем, есть ли email в БД
    const existingEmail = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email уже используется');
    }

    // Проверяем, есть ли username в БД
    const existingUsername = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username уже занят');
    }

    // Создаём пользователя (пароль хешируется автоматически @BeforeInsert)
    const user = this.userRepo.create(dto);
    await this.userRepo.save(user);

    return { message: 'Регистрация успешна', userId: user.id };
  }
}