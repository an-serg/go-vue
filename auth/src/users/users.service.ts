import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DEFAULT_SETTINGS } from './settings.defaults';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  private async findUser(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  
  async getProfile(userId: string) {
    const user = await this.findUser(userId);
    user.settings = { ...DEFAULT_SETTINGS, ...user.settings };
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.findUser(userId);                    // сырой, без дефолтов
    if (dto.bio !== undefined) user.bio = dto.bio;
    if (dto.settings) user.settings = { ...user.settings, ...dto.settings };  // в БД копятся только оверрайды
    await this.userRepo.save(user);
    user.settings = { ...DEFAULT_SETTINGS, ...user.settings };   // merge для ответа
    return user;
  }
}