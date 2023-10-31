import { Module } from '@nestjs/common';
import { ClothingController } from './clothing.controller';
import { ClothingService } from './clothing.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [ClothingController],
  providers: [ClothingService],
  imports: [FilesModule]
})
export class ClothingModule {}
