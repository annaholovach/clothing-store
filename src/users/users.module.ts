import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  providers: [
    UsersService,
    JwtService
  ],
  controllers: [UsersController],
})
export class UsersModule {}
