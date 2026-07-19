import { Response } from 'express';
import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from 'src/users/dto/login.dto';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res:Response) {
    return res.send({ message: 'True register' });
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res:Response) {
    const { accessToken } = await this.authService.login(dto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,      
      secure: false,       // true только для HTTPS (в проде)
      sameSite: 'strict',  // защита от CSRF
      maxAge: 15 * 60 * 1000, // 15 минут в мс
    });

    // Отправляем ответ (обязательно с @Res()!)
    return res.send({ message: 'Logged in' });
  }
}