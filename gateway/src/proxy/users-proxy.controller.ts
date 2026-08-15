import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersProxyController {
  constructor(private readonly httpService: HttpService) {}

  @All('*')
  async proxy(
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser('sub') userId: string,
  ) {
    const targetUrl = `http://auth:3001${req.url}`;

    try {
      const response = await lastValueFrom(
        this.httpService.request<any>({
          method: req.method as any,
          url: targetUrl,
          data: req.body,
          headers: {
            'content-type': req.headers['content-type'] || 'application/json',
            'x-user-id': userId || '',
          },
        }),
      );

      res.status(response.status).send(response.data);
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send({ message: 'Gateway error' });
      }
    }
  }
}