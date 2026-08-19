import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { auth_config } from '../config/auth-limit.config';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    _context: ExecutionContext,
    detail?: { timeToExpire?: number },
  ): Promise<void> {
    const retryAfter = detail?.timeToExpire ? Math.ceil(detail.timeToExpire) : auth_config.ttlS;
    throw new HttpException(
      { message: 'Слишком много попыток входа', retryAfter },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}