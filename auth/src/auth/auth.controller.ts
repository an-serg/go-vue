import { Controller, Post, Body, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthTokenService } from '../common/auth-token.service';
import { AuthCookieService } from '../common/auth-cookie.service';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from '../users/dto/login.dto';

@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authTokenService: AuthTokenService,
    private cookieService: AuthCookieService,
  ) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Headers('x-fingerprint') fingerprint: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.register(dto);
    
    //Left from existing session
    await this.authTokenService.revokeSessionByFingerprint(user.id, fingerprint);
    this.cookieService.clearAuthCookies(res);
    
    const { accessToken, refreshToken } = await this.authTokenService.createTokens(
      user.id,
      user.email,
      fingerprint,
      req.headers['user-agent'] || '',
    );
    
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    
    return res.send({ message: 'True register', user: { id: user.id } });
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Headers('x-fingerprint') fingerprint: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.login(dto);
    
    //Left from existing session
    await this.authTokenService.revokeSessionByFingerprint(user.id, fingerprint);
    this.cookieService.clearAuthCookies(res);
    
    const { accessToken, refreshToken } = await this.authTokenService.createTokens(
      user.id,
      user.email,
      fingerprint,
      req.headers['user-agent'] || '',
    );
    
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    
    return res.send({ message: 'Logged in' });
  }
}