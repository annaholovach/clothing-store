import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Pool } from 'pg'
import { CreateClothingDto } from './dto/create.clothing.dto';
import { FilesService } from '../files/files.service';
import { DbService } from '../db/db.service';
dotenv.config();

@Injectable()
export class ClothingService {

    constructor(private readonly databaseService: DbService,
                private fileService: FilesService) {}

    async create(dto: CreateClothingDto, image: any) {
        if(!dto.title || !dto.size || !dto.price) {
            throw new HttpException('input cant be empty', HttpStatus.BAD_REQUEST)
        }
        const fileName = await this.fileService.createFile(image)
        const query = `
          INSERT INTO clothing (title, size, price, description, image)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `
        const params = [dto.title, dto.size, dto.price, dto.description, fileName]
        return await this.databaseService.executeQuery(query, params)
    }

    async getAll(count = 10, offset = 0) {
      const query = 'SELECT id, title, size, price, description, image FROM clothing';
      const result = await this.databaseService.executeQuery(query)
      return result.slice(Number(offset), Number(offset) + Number(count));
    }

    async getById(id: number) {
      const query = 'SELECT id, title, size, price, description, image FROM clothing WHERE id = $1'
      const params = [id]
      const result = await this.databaseService.executeQuery(query, params)
      if (result.length === 0) {
        throw new HttpException('not found clothing with such id', HttpStatus.NOT_FOUND)
      }
      return result[0];
    }

    async findBySize(size: string): Promise<any[]> {
      const query = `SELECT id, title, size, price, description, image FROM clothing WHERE size = $1`
      const params = [size]
      const result = await this.databaseService.executeQuery(query, params)
      if (result.length === 0) {
        throw new HttpException('not found clothing such size', HttpStatus.NOT_FOUND)
      }
      return result
    }

    async deleteById(id: number) {
        const product = await this.getById(id)
        if (!product) {
          throw new HttpException('not found clothing with such id', HttpStatus.NOT_FOUND)
        }
        const query = `
          DELETE FROM clothing
          WHERE id = $1
        `;
        const params = [id];
        await this.databaseService.executeQuery(query, params)
        return `Clothing with id: ${id} deleted successful`
    }
}
