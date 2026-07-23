import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { User } from '../users/user.entity';
import { Session } from '../sessions/session.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session]),
    JwtModule.register({
      privateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH),
      publicKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH.replace('private', 'public')),
      signOptions: { 
        algorithm: 'RS256',
        issuer: 'auth',
      },
      verifyOptions: {
        algorithms: ['RS256'],
        issuer: 'auth',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}