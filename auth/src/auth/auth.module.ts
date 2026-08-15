import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
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
  ],
  controllers: [AuthController, SessionController, AvailabilityController],
  providers: [AuthService, SessionService, TokenService, CookieService, AvailabilityService],
})
export class AuthModule {}
