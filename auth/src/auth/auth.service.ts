import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from 'src/users/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Пароли не совпадают');
    }

    const existingEmail = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email уже зарегестрирован');
    }

    const existingUsername = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new BadRequestException('Username уже занят');
    }

    const user = this.userRepo.create(dto);
    await this.userRepo.save(user);

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { 
      message: 'Регистрация успешна',
      accessToken,
      user: { 
        id: user.id,
        email: user.email
      },
    };
  }

  async login(dto:LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email }
    })
    if (!user) {
      throw new BadRequestException('Email ещё не зарегистрирован');
    }
    
    const isPasswordValid = await argon2.verify( user.password, dto.password)
    if (!isPasswordValid) {
      throw new BadRequestException('Неправильный пароль');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { 
      message: 'Вы успешно вошли!',
      accessToken,
      user: { 
        id: user.id,
        email: user.email
      },
    };
  }
}