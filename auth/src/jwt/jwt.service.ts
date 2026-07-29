import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Session } from '../sessions/session.entity';
import { AuthTokenService } from '../common/auth-token.service';

@Injectable()
export class JwtServiceAuth {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
    private authTokenService: AuthTokenService,
  ) {}

  async verifyAndRotate(refreshToken: string, fingerprint: string, userAgent: string) {
    // 1. Проверяем подпись JWT
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Not a refresh token');
    }

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

    // 2. Ищем сессию в БД
    const session = await this.sessionRepo.findOne({
      where: { refresh_token_hash: refreshTokenHash },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.is_revoked) {
      await this.sessionRepo.delete({ id: session.id });
      throw new UnauthorizedException('Session revoked');
    }

    if (session.expires_at < new Date()) {
      await this.sessionRepo.delete({ id: session.id });
      throw new UnauthorizedException('Session expired');
    }

    if (session.fingerprint_hash !== fingerprintHash) {
      await this.sessionRepo.delete({ user_id: session.user_id });
      throw new UnauthorizedException('Fingerprint mismatch. Possible token theft.');
    }

    await this.sessionRepo.delete({ id: session.id });

    // 5. Создаём новые токены (email берём из старого refresh token!)
    return this.authTokenService.rotateTokens(
      payload.sub,
      payload.email,
      fingerprint,
      userAgent,
    );
  }

  async revokeSession(refreshToken: string) {
    await this.authTokenService.revokeByToken(refreshToken);
  }
}