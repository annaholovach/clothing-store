import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClothingModule } from './clothing/clothing.module';
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { DbService } from './db/db.service';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve( __dirname, 'static'),
    }),
    AuthModule,
    ClothingModule,
    FilesModule,
    OrdersModule,
    UsersModule,
    DbModule,
  ],
  controllers: [],
  providers: [DbService],
})
export class AppModule {}
