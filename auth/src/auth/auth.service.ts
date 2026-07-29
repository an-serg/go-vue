import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../users/user.entity';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from '../users/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    const existingUsername = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new BadRequestException({
        field: 'username',
        message: 'Username уже занят',
      });
    }

    const existingEmail = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new BadRequestException({
        field: 'email',
        message: 'Email уже зарегистрирован',
      });
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException({
        field: 'confirmPassword',
        message: 'Пароли не совпадают',
      });
    }

    const user = this.userRepo.create(dto);
    await this.userRepo.save(user);

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException({
        field: 'email',
        message: 'Пользователь не найден',
      });
    }

    const valid = await argon2.verify(user.password, dto.password);
    if (!valid) {
      throw new UnauthorizedException({
        field: 'password',
        message: 'Неверный пароль',
      });
    }

    return user;
  }
}