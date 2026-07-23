import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

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
    const targetUrl = `http://users:3002${req.url}`;

    const response = await lastValueFrom(
      this.httpService.request<any>({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        headers: {
          'content-type': req.headers['content-type'],
          'x-user-id': userId,
        },
      }),
    );

    res.status(response.status).send(response.data);
  }
}