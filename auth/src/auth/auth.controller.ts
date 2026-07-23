import { Response } from 'express';
import { Controller, Post, Body, Headers, Res, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from 'src/users/dto/login.dto';

interface RequestWithCookies extends Request {
  cookies?: { [key: string]: string };
}

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto, 
    @Headers('x-fingerprint') fingerprint: string,
    @Req() req: RequestWithCookies,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(
      dto,
      fingerprint,
      req.headers['user-agent'] || '',
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,      
      secure: false,       // true только для HTTPS (в проде)
      sameSite: 'strict',  // защита от CSRF
      maxAge: 1 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 2 * 60 * 1000,
    });

    return res.send({ message: 'True register' });
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Headers('x-fingerprint') fingerprint: string,
    @Req() req: RequestWithCookies,
    @Res() res: Response,
  ) {
    console.log('DEBUG fingerprint:', fingerprint);
    console.log('DEBUG headers:', req.headers);
    const { accessToken, refreshToken } = await this.authService.login(
      dto, 
      fingerprint, 
      req.headers['user-agent'] || '',
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,      
      secure: false,
      sameSite: 'strict',
      maxAge: 1 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 2 * 60 * 1000,
    });


    return res.send({ message: 'Logged in' });
  }

  @Post('refresh')
  async refresh(
    @Req() req: RequestWithCookies,
    @Headers('x-fingerprint') fingerprint: string,
    @Res() res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const { newAccessToken, newRefreshToken } = await this.authService.refresh(refreshToken, fingerprint);

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,      
      secure: false,       // true только для HTTPS (в проде)
      sameSite: 'strict',  // защита от CSRF
      maxAge: 1 * 60 * 1000,
    });

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 2 * 60 * 1000,
    });

    return res.send({ message: 'True refresh' });
  }

  @Post('logout')
  async logout(
    @Req() req: RequestWithCookies,
    @Res() res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.send({ message: 'Logged out' });
  }
}