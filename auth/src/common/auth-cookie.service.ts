import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { cookie_config } from 'src/config/cookie.config';
import { token_config } from 'src/config/token.config';

@Injectable()
export class AuthCookieService {
  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, {
      httpOnly: cookie_config.httpOnly,
      secure: cookie_config.secure,
      sameSite: cookie_config.sameSite,
      maxAge: cookie_config.accessMaxAge,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: cookie_config.httpOnly,
      secure: cookie_config.secure,
      sameSite: cookie_config.sameSite,
      maxAge: cookie_config.refreshMaxAge,
    });
  }

  clearAuthCookies(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}