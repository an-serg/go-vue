import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { cookie_config } from '../config/cookie.config';
import { token_config } from '../config/token.config';

@Injectable()
export class CookieService {
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