import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Session } from '../sessions/session.entity';
import { AuthTokenService } from '../common/auth-token.service';
import { AuthCookieService } from '../common/auth-cookie.service';

@Injectable()
export class JwtServiceAuth {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
    private authTokenService: AuthTokenService,
  ) {}

  async refreshToken(oldRefreshToken: string, fingerprint: string, userAgent: string) {
    const payload = await this.authTokenService.verifyToken(
      oldRefreshToken,
      fingerprint,
      userAgent,
    );

    return this.authTokenService.createTokens(
      payload.sub,
      payload.email,
      fingerprint,
      userAgent,
    );
  }
}