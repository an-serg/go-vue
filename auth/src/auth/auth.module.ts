import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { User } from '../users/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      privateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH),
      signOptions: { 
        algorithm: 'RS256',
        expiresIn: '15m',
        issuer: 'auth',
      }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}