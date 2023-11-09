import { Module } from '@nestjs/common';
import { ClothingController } from './clothing.controller';
import { ClothingService } from './clothing.service';
import { FilesModule } from 'src/files/files.module';
import { JwtService } from 'src/jwt/jwt.service';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [ClothingController],
  providers: [
    ClothingService,
    JwtService
  ],
  imports: [
    FilesModule,
    DbModule,
  ]
})
export class ClothingModule {}
