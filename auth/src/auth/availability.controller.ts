import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('')
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
