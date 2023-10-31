import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClothingModule } from './clothing/clothing.module';
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve( __dirname, 'static'),
    }),
    AuthModule,
    ClothingModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
