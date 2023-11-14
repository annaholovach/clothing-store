import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from 'src/jwt/jwt.service';
import { DbModule } from '../db/db.module';
import { DbService } from 'src/db/db.service';

@Module({
  providers: [UsersService, JwtService, DbService],
  controllers: [UsersController],
  imports: [DbModule],
})
export class UsersModule {}
