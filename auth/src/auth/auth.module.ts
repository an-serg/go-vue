import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { User } from '../users/user.entity';
import { Session } from '../sessions/session.entity';
import { AuthController } from './auth.controller';
import { JwtController } from '../jwt/jwt.controller';
import { AuthService } from './auth.service';
import { JwtServiceAuth } from '../jwt/jwt.service';
import { AuthTokenService } from '../common/auth-token.service';
import { AuthCookieService } from '../common/auth-cookie.service';
import { jwt_config } from 'src/config/jwt.config';

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
  controllers: [AuthController, JwtController],
  providers: [AuthService, JwtServiceAuth, AuthTokenService, AuthCookieService],
})
export class AuthModule {}