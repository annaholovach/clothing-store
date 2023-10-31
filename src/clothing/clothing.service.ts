import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Pool } from 'pg'
import { CreateClothingDto } from './dto/create.clothing.dto';
import { FilesService } from '../files/files.service';
import { log } from 'util';
dotenv.config();

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});

@Injectable()
export class ClothingService {

    constructor(private fileService: FilesService) {}

    async create(dto: CreateClothingDto, image: any) {
        if(!dto.title || !dto.size || !dto.price) {
            throw new HttpException('input cant be empty', HttpStatus.BAD_REQUEST)
        }
        const fileName = await this.fileService.createFile(image)
        const client = await pool.connect()
        try {
            const query = `
              INSERT INTO clothing (title, size, price, description, image)
              VALUES ($1, $2, $3, $4, $5)
              RETURNING *
            `;
            const values = [dto.title, dto.size, dto.price, dto.description, fileName];
            const result = await client.query(query, values);
            return result.rows[0];
          } finally {
            client.release();
          }
    }

    async getAll(count = 10, offset = 0) {
        const client = await pool.connect()
        try {
            const query = 'SELECT * FROM clothing';
            const result = await client.query(query)
            return result.rows.slice(Number(offset), Number(offset) + Number(count));
          } finally {
            client.release();
          }
    }

    async getById(id: number) {
        const client = await pool.connect()
        try {
            const query = 'SELECT * FROM clothing WHERE id = $1'
            const values = [id]
            const result = await client.query(query, values)
      
            if (result.rows.length > 0) {
              return result.rows[0]
            } else {
              throw new HttpException('not foud clothing with such id', HttpStatus.BAD_REQUEST)
            }
        } finally {
            client.release();
        }
    }

    async findBySize(size: string): Promise<any[]> {
        const client = await pool.connect()
        try {
            const query = `SELECT * FROM clothing WHERE size = $1`
            const values = [size]
            const result = await client.query(query, values);
            return result.rows
          } catch(e){
            console.log(e);
            
          } finally {
            client.release();
          }
    }
}
