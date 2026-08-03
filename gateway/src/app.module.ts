import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import * as fs from 'fs';
import { AuthProxyController } from './proxy/auth-proxy.controller';
import { UsersProxyController } from './proxy/users-proxy.controller';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      publicKey: fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH),
      verifyOptions: {
        algorithms: ['RS256'],
        issuer: 'auth',
      },
    }),
  ],
  controllers: [
    AuthProxyController,
    UsersProxyController,
  ],
  providers: [JwtAuthGuard],
})
export class AppModule {}