import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { token_config } from 'src/config/token.config';
import * as crypto from 'crypto';
import { Session } from '../sessions/session.entity';

@Injectable()
export class AuthTokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
  ) {}

  async createTokens(userId: string, email: string, fingerprint: string, userAgent: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email, type: 'access' },
      { expiresIn: token_config.accessTtlMs },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, email, type: 'refresh' },
      { expiresIn: token_config.refreshTtlMs },
    );

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

    await this.sessionRepo.save({
      user_id: userId,
      refresh_token_hash: refreshTokenHash,
      fingerprint_hash: fingerprintHash,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + token_config.refreshTtlMs),
    });

    return { accessToken, refreshToken };
  }

  async verifyToken(refreshToken: string, fingerprint: string, userAgent: string) {
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
      
      return payload;
  }

  // Удалить сессию с этого устройства (при login/register)
  async revokeSessionByFingerprint(userId: string, fingerprint: string) {
    const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');
    await this.sessionRepo.delete({ user_id: userId, fingerprint_hash: fingerprintHash });
  }

  // Удалить сессию по токену (при logout)
  async revokeSessionByToken(refreshToken: string) {
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.sessionRepo.delete({ refresh_token_hash: hash });
  }
}