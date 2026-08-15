import { Controller, Get, Patch, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@Headers('x-user-id') userId: string) {
    if (!userId) throw new UnauthorizedException();
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  updateMe(@Headers('x-user-id') userId: string, @Body() dto: UpdateProfileDto) {
    if (!userId) throw new UnauthorizedException();
    return this.usersService.updateProfile(userId, dto);
  }
}