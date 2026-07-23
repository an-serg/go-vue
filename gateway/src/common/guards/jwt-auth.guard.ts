import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  email?: string;
  type: string;
  iat: number;
  exp: number;
  iss: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('No access token in cookie');
    }

    try {
      const payload = this.jwtService.verify(token) as JwtPayload;
      
      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      if (payload.exp < Date.now() / 1000) {
        throw new UnauthorizedException('Token expired');
      }

      const request = context.switchToHttp().getRequest<any>();
      return true;
    }
    catch(error) {
      if (error instanceof UnauthorizedException) { throw error }
      throw new UnauthorizedException('Invalid token');
    }
  }
}