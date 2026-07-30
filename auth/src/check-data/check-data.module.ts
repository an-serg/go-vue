import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckDataController } from './check-data.controller';
import { CheckDataService } from './check-data.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [CheckDataController],
  providers: [CheckDataService],
})
export class CheckDataModule {}