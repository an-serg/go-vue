import { All, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface RequestWithUser extends
Request {
  user: { sub: string, email: string};
}

@Controller('auth')
export class AuthProxyController {
  constructor(private readonly httpService: HttpService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: RequestWithUser) {
    return { userId: req.user.sub, email: req.user.email };
  }
  
  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const targetUrl = `http://auth:3001${req.url.replace('/auth', '')}`;

    try {
      const response = await lastValueFrom(
        this.httpService.request<any>({
          method: req.method as any,
          url: targetUrl,
          data: req.body,
          headers: {
            'content-type': req.headers['content-type'] || 'application/json',
            'x-fingerprint': req.headers['x-fingerprint'] as string || '',
            'cookie': req.headers['cookie'] || '',
          },
        }),
      );

      res.status(response.status);

      const contentType = response.headers['content-type'];
      if (typeof contentType === 'string') {
        res.setHeader('content-type', contentType);
      }

      const setCookie = response.headers['set-cookie'];
      if (setCookie) {
        res.setHeader('Set-Cookie', setCookie);
      }

      res.send(response.data);
    } catch (error: any) { 
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send({ message: 'Gateway error' });
      }
    }
  }
}