import { Controller, Get, Query } from '@nestjs/common';
import { CheckDataService } from "./check-data.service"

@Controller('')
export class CheckDataController {
  constructor(private checkDataService: CheckDataService) {}

  @Get('email')
  async checkEmail(@Query('email') email: string) {
    const exists = await this.checkDataService.emailExists(email);
    return { exists };
  }

  @Get('username')
  async checkUsername(@Query('username') username: string) {
    const exists = await this.checkDataService.usernameExists(username);
    return { exists };
  }
}