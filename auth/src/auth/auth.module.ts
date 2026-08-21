import { Module, Get } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppThrottlerGuard } from './app-throttler.guard';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as fs from 'fs';
import { User } from '../users/entities/user.entity';
import { Session } from './entities/session.entity';
import { AuthController } from './auth.controller';
import { SessionController } from './session.controller';
import { AvailabilityController } from './availability.controller';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';
import { AvailabilityService } from './availability.service';
import { jwt_config } from '../config/jwt.config';
import { THROTTLE } from '../config/limit.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session]),
    JwtModule.register({
      privateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH),
      publicKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH.replace('private', 'public')),
      signOptions: {
        algorithm: jwt_config.algorithm,
        issuer: jwt_config.issuer,
      },
      verifyOptions: {
        algorithms: [jwt_config.algorithm],
        issuer: jwt_config.issuer,
      },
    }),
    ThrottlerModule.forRoot([{
      ...THROTTLE.default,
      getTracker: (req: Record<string, any>) => (req.headers['x-real-ip'] as string) || req.ip,
    }]),
  ],
  controllers: [
    AuthController, 
    SessionController, 
    AvailabilityController
  ],
  providers: [
    AuthService,
    SessionService,
    TokenService,
    CookieService,
    MailService,
    AvailabilityService,
    { provide: APP_GUARD, useClass: AppThrottlerGuard },
  ],
})
export class AuthModule {}
