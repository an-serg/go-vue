import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async emailExists(email: string): Promise<boolean> {
    if (!email) return false;
    const user = await this.userRepo.findOne({ where: { email } });
    return !!user;
  }

  async usernameExists(username: string): Promise<boolean> {
    if (!username) return false;
    const user = await this.userRepo.findOne({ where: { username } });
    return !!user;
  }
}