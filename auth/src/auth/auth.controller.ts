import { Controller, Post, Body, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private cookieService: CookieService,
  ) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Headers('x-fingerprint') fingerprint: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.register(dto);
    
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
  async login(
    @Body() dto: LoginDto,
    @Headers('x-fingerprint') fingerprint: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.login(dto);
    
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