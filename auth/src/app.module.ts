import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { dataSourceOptions } from './data-source'
import { CheckDataModule } from './check-data/check-data.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    CheckDataModule,
    JwtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}