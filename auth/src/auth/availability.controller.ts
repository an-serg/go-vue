import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AvailabilityService } from './availability.service';
import { THROTTLE } from 'src/config/limit.config';

@Controller('auth')
@Throttle({ default: THROTTLE.availability })
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Get('email')
  async checkEmail(@Query('email') email: string) {
    const exists = await this.availabilityService.emailExists(email);
    return { exists };
  }

  @Get('username')
  async checkUsername(@Query('username') username: string) {
    const exists = await this.availabilityService.usernameExists(username);
    return { exists };
  }
}
