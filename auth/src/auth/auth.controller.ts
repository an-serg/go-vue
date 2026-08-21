import { Controller, Post, Get, Body, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { MailService } from 'src/mail/mail.service';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE } from 'src/config/limit.config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private cookieService: CookieService,
    private mailService: MailService,
  ) {}

  @Get('mailtest')
  async mailtest() {
    await this.mailService.sendVerification(
      'sergeeva_a03@mail.ru', 
      'https://booktook.dpdns.org/test'
    );
    return { sent: true };
  }

  @Post('register')
  @Throttle({ default: THROTTLE.auth })
  async register(
    @Body() dto: RegisterDto,
    @Headers('x-fingerprint') fingerprint: string,
    @Headers('x-real-ip') ip: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.register(dto, ip);
    
    await this.tokenService.revokeSessionByFingerprint(user.id, fingerprint);
    this.cookieService.clearAuthCookies(res);
    
    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      user.id,
      user.email,
      fingerprint,
      req.headers['user-agent'] || '',
    );
    
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    
    return res.send({ message: 'True register', user: { id: user.id } });
  }

  @Post('login')
  @Throttle({ default: THROTTLE.auth })
  async login(
    @Body() dto: LoginDto,
    @Headers('x-fingerprint') fingerprint: string,
    @Headers('x-real-ip') ip: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.login(dto, ip);
    
    await this.tokenService.revokeSessionByFingerprint(user.id, fingerprint);
    this.cookieService.clearAuthCookies(res);
    
    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      user.id,
      user.email,
      fingerprint,
      req.headers['user-agent'] || '',
    );
    
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    
    return res.send({ message: 'Logged in' });
  }
}