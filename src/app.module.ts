import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClothingModule } from './clothing/clothing.module';
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve( __dirname, 'static'),
    }),
    AuthModule,
    ClothingModule,
    FilesModule,
    OrdersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class AppModule {}
