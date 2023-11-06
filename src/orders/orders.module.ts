import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    controllers: [OrdersController],
    providers: [
        OrdersService,
        UsersService,
        JwtService
    ]
})
export class OrdersModule {}