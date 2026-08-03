import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { Session } from '../sessions/session.entity';
import { JwtController } from './jwt.controller';
import { JwtServiceAuth } from './jwt.service';
import { AuthTokenService } from '../common/auth-token.service';
import { AuthCookieService } from '../common/auth-cookie.service';
import { jwt_config } from 'src/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    JwtModule.register({
      publicKey: fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH),
      privateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH),
      signOptions: { algorithm: jwt_config.algorithm, issuer: jwt_config.issuer },
      verifyOptions: { algorithms: [jwt_config.algorithm], issuer: jwt_config.issuer },
    }),
  ],
  controllers: [JwtController],
  providers: [JwtServiceAuth, AuthTokenService, AuthCookieService],
})
export class AuthJwtModule {}