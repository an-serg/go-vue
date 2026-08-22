import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { MailService } from '../mail/mail.service';
import { token_config } from '../config/token.config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async sendLink(userId: string, email: string): Promise<void> {
    const token = this.jwtService.sign(
      { sub: userId, type: 'verify' },
      { expiresIn: token_config.verifyTtl },
    );

    const link = `${process.env.APP_URL}/auth/verify?token=${token}`;

    try {
      await this.mailService.sendVerification(email, link);
    } catch (error) {
      this.logger.error(`Письмо на ${email} не ушло: ${error.message}`);
    }
  }

  async resend(email: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || user.email_verified) return;

    await this.sendLink(user.id, user.email);
  }

  async confirm(token: string): Promise<User> {
    let payload;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException({
        code: 'invalid_token',
        message: 'Ссылка недействительна или устарела',
      });
    }

    if (payload.type !== 'verify') {
      throw new BadRequestException({
        code: 'invalid_token',
        message: 'Ссылка недействительна',
      });
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new BadRequestException({
        code: 'invalid_token',
        message: 'Ссылка недействительна',
      });
    }

    if (user.email_verified) {
      throw new BadRequestException({
        code: 'already_verified',
        message: 'Почта уже подтверждена',
      });
    }

    await this.userRepo.update(user.id, { email_verified: true });

    return user;
  }
}
