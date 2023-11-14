import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from 'src/jwt/jwt.service';
import { DbModule } from 'src/db/db.module';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, UsersService, JwtService, DbService],
  imports: [DbModule],
})
export class OrdersModule {}
