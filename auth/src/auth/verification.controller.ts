import { Controller, Post, Body, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { VerificationService } from './verification.service';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';
import { VerifyEmailDto, ResendDto } from './dto/verification.dto';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE } from 'src/config/limit.config';

@Controller('auth')
export class VerificationController {
  constructor(
    private verificationService: VerificationService,
    private tokenService: TokenService,
    private cookieService: CookieService,
  ) {}

  @Post('verify-email')
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
    @Headers('x-fingerprint') fingerprint: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.verificationService.confirm(dto.token);

    const { accessToken, refreshToken } = await this.tokenService.createTokens(
      user.id,
      user.email,
      fingerprint,
      req.headers['user-agent'] || '',
    );

    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    return res.send({ message: 'Почта подтверждена' });
  }

  @Post('resend-verification')
  @Throttle({ default: THROTTLE.auth })
  async resend(@Body() dto: ResendDto) {
    await this.verificationService.resend(dto.email);
    return { message: 'Если аккаунт существует и не подтверждён, письмо отправлено' };
  }

}
