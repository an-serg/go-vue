import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Session } from './entities/session.entity';
import { TokenService } from './token.service';

@Injectable()
export class SessionService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
    private tokenService: TokenService,
  ) {}

  async refreshToken(oldRefreshToken: string, fingerprint: string, userAgent: string) {
    const payload = await this.tokenService.verifyToken(
      oldRefreshToken,
      fingerprint,
      userAgent,
    );

    return this.tokenService.createTokens(
      payload.sub,
      payload.email,
      fingerprint,
      userAgent,
    );
  }
}
