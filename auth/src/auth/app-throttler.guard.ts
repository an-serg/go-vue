import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { THROTTLE } from 'src/config/limit.config';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    _context: ExecutionContext,
    detail?: { timeToExpire?: number },
  ): Promise<void> {
    const retryAfter = detail?.timeToExpire ? Math.ceil(detail.timeToExpire) : THROTTLE.default.ttl / 1000;
    throw new HttpException(
      { message: 'Слишком много запросов, попробуйте позже', retryAfter },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}