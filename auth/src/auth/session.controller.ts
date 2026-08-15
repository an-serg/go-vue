import { Controller, Post, Req, Res, Headers, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionService } from './session.service';
import { CookieService } from './cookie.service';
import { TokenService } from './token.service';

@Controller('auth')
export class SessionController {
  constructor(
    private sessionService: SessionService,
    private tokenService: TokenService,
    private cookieService: CookieService,
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
      await this.sessionService.refreshToken(
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
      await this.tokenService.revokeSessionByToken(refreshToken);
    }

    this.cookieService.clearAuthCookies(res);
    return res.send({ message: 'Logged out' });
  }
}
