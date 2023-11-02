import { Module } from '@nestjs/common';
import { ClothingController } from './clothing.controller';
import { ClothingService } from './clothing.service';
import { FilesModule } from 'src/files/files.module';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [ClothingController],
  providers: [
    ClothingService,
    JwtService
  ],
  imports: [FilesModule]
})
export class ClothingModule {}
