import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ClothingService } from './clothing.service';
import { CreateClothingDto } from './dto/create.clothing.dto';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('clothing')
export class ClothingController {
  constructor(private clothingService: ClothingService) {}

  @Get()
  getAll(@Query('count') count: number, @Query('offset') offset: number) {
    return this.clothingService.getAll(count, offset);
  }

  @Get('/search')
  findBySize(@Query('size') size: string) {
    return this.clothingService.findBySize(size);
  }

  @Get('/:id')
  getById(@Param('id') id: number) {
    return this.clothingService.getById(id);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() dto: CreateClothingDto, @UploadedFile() image) {
    return this.clothingService.create(dto, image);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(RolesGuard)
  @Delete('/:id')
  deleteById(@Param('id') id: number) {
    return this.clothingService.deleteById(id);
  }
}
