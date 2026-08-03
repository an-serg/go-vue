import { Controller, Post, Req, Res, Headers, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtServiceAuth } from './jwt.service';
import { AuthCookieService } from '../common/auth-cookie.service';
import { AuthTokenService } from 'src/common/auth-token.service';

@Controller('')
export class JwtController {
  constructor(
    private jwtServiceAuth: JwtServiceAuth,
    private AuthTokenService: AuthTokenService,
    private cookieService: AuthCookieService,
  ) {}

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Headers('x-fingerprint') fingerprint: string,
    @Res() res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.jwtServiceAuth.refreshToken(
        refreshToken,
        fingerprint,
        req.headers['user-agent'] || '',
    );

    this.cookieService.setAuthCookies(res, accessToken, newRefreshToken);
    return res.send({ message: 'True refresh' });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response, @Headers('x-fingerprint') fingerprint: string) {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      await this.AuthTokenService.revokeSessionByToken(refreshToken);
    }

    this.cookieService.clearAuthCookies(res);
    return res.send({ message: 'Logged out' });
  }
}