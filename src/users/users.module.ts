import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from 'src/jwt/jwt.service';
import { DbModule } from '../db/db.module';

@Module({
  providers: [
    UsersService,
    JwtService
  ],
  controllers: [UsersController],
  imports: [DbModule]
})
export class UsersModule {}
