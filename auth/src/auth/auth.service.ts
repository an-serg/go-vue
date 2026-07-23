import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { Session } from '../sessions/session.entity';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from 'src/users/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
  ) {}

  async register(dto: RegisterDto, fingerprint: string, userAgent: string) {
    const existingUsername = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new BadRequestException({
        field: 'username',
        message: 'Username уже занят'
      });
    }

    const existingEmail = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new BadRequestException({
        field: 'email',
        message: 'Email уже зарегестрирован'
      });
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException({
        field: 'confirmPassword',
        message: 'Пароли не совпадают'
      });
    }

    const user = this.userRepo.create(dto);
    await this.userRepo.save(user);

    const accessTokenPayload = { sub: user.id, email: user.email, type: 'access'};
    const accessToken = this.jwtService.sign(accessTokenPayload, { expiresIn: '1m' });

    const refreshTokenPayload = { sub: user.id, type: 'refresh' };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, { expiresIn: '2m' });

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

    await this.sessionRepo.save({
      user_id: user.id,
      refresh_token_hash: refreshTokenHash,
      fingerprint_hash: fingerprintHash,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 2 * 60 * 1000),
    });

    return { 
      message: 'Регистрация успешна',
      accessToken,
      refreshToken,
      user: { id: user.id },
    };
  }

  async login(dto:LoginDto, fingerprint: string, userAgent: string) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email }
    })
    if (!user) {
      throw new BadRequestException({
        field: 'email',
        message: 'Email ещё не зарегестрирован'
      });
    }
    
    const isPasswordValid = await argon2.verify( user.password, dto.password)
    if (!isPasswordValid) {
      throw new BadRequestException({
        field: 'password',
        message: 'Неправильный пароль'
      });
    }
    
    await this.removeSessionByFingerprint(user.id, fingerprint);

    const payload = { sub: user.id, email: user.email, type: 'access' };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1m' });

    const refreshTokenPayload = { sub: user.id, type: 'refresh' };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, { expiresIn: '2m' });

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

    await this.sessionRepo.save({
      user_id: user.id,
      refresh_token_hash: refreshTokenHash,
      fingerprint_hash: fingerprintHash,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 2 * 60 * 1000),
    });

    return { 
      message: 'Вы успешно вошли!',
      accessToken,
      refreshToken,
      user: { id: user.id },
    };
  }

  async refresh(refreshToken: string, fingerprint: string) {
    const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH);

    let payload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch(error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Not a refresh token');
    }

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

    const session = await this.sessionRepo.findOne({
      where: { refresh_token_hash: refreshTokenHash },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.is_revoked) {
      throw new UnauthorizedException('Session revoked');
    }

    if (session.expires_at < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    if (session.fingerprint_hash !== fingerprintHash) {
      await this.sessionRepo.delete({ id: session.id });
      throw new UnauthorizedException('Fingerprint mismatch. Possible token theft.');
    }

    await this.sessionRepo.delete({ id: session.id });

    const newAccessTokenPayload = { sub: payload.sub, type: 'access'}
    const newAccessToken = this.jwtService.sign( newAccessTokenPayload, { expiresIn: '1m' });

    const newRefreshTokenPayload = { sub: payload.sub, type: 'refresh'}
    const newRefreshToken = this.jwtService.sign( newRefreshTokenPayload, { expiresIn: '2m' });
    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    await this.sessionRepo.save({
      user_id: payload.sub,
      refresh_token_hash: newRefreshTokenHash,
      fingerprint_hash: fingerprintHash,
      user_agent: session.user_agent,
      expires_at: new Date(Date.now() + 2 * 60 * 1000),
    });

    return { 
      message: '',
      newAccessToken,
      newRefreshToken,
      user: { id: payload.id },
    };    
  }

  async logout(refreshToken: string) {
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.sessionRepo.delete({ refresh_token_hash: refreshTokenHash });
  }

  async removeSessionByFingerprint(userId: string, fingerprint: string) {
    const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');
    await this.sessionRepo.delete({
      user_id: userId,
      fingerprint_hash: fingerprintHash,
    });
  }
}