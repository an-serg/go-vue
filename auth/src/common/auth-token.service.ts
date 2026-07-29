import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Session } from '../sessions/session.entity';

@Injectable()
export class AuthTokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
  ) {}

  async createTokens(userId: string, email: string | undefined, fingerprint: string, userAgent: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email, type: 'access' },
      { expiresIn: '1m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, email, type: 'refresh' },
      { expiresIn: '3m' },
    );

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

    await this.sessionRepo.save({
      user_id: userId,
      refresh_token_hash: refreshTokenHash,
      fingerprint_hash: fingerprintHash,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 3 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }

  // Для refresh — просто вызывает createTokens
  async rotateTokens(userId: string, email: string, fingerprint: string, userAgent: string) {
    return this.createTokens(userId, email, fingerprint, userAgent);
  }

  // Удалить сессию с этого устройства (при login/register)
  async revokeByFingerprint(userId: string, fingerprint: string) {
    const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');
    await this.sessionRepo.delete({ user_id: userId, fingerprint_hash: fingerprintHash });
  }

  // Удалить сессию по токену (при logout)
  async revokeByToken(refreshToken: string) {
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.sessionRepo.delete({ refresh_token_hash: hash });
  }
}