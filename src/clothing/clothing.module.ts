import { Module } from '@nestjs/common';
import { ClothingController } from './clothing.controller';
import { ClothingService } from './clothing.service';
import { FilesModule } from 'src/files/files.module';
import { JwtService } from 'src/jwt/jwt.service';
import { DbModule } from 'src/db/db.module';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [ClothingController],
  providers: [ClothingService, JwtService, DbService],
  imports: [FilesModule, DbModule],
})
export class ClothingModule {}
