import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Pool } from 'pg'
import { ChangeRoleDto } from './dto/change.role.dto';
dotenv.config();

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});

@Injectable()
export class UsersService {

    async getAll() {
        const client = await pool.connect()
        try {
            const query = 'SELECT id, email, role FROM users';
            const result = await client.query(query)
            return result.rows;
          } finally {
            client.release();
          }
    }

    async getOne(id: number) {
        const client = await pool.connect()
        try {
            const query = 'SELECT id, email, role FROM users WHERE id = $1'
            const values = [id]
            const result = await client.query(query, values)
      
            if (result.rows.length > 0) {
              return result.rows[0]
            } else {
              throw new HttpException('user with such id does not exist', HttpStatus.BAD_REQUEST)
            }
        } finally {
            client.release();
        }
    }

    async changeRole(dto: ChangeRoleDto) {
        const client = await pool.connect()
        const user = await this.getOne(dto.userId)
        if (!user) {
          throw new HttpException('user with such id does not exist', HttpStatus.BAD_REQUEST)
        }
        try {
          const query = 'UPDATE users SET role = $1 WHERE id = $2'
          const values = [dto.role, dto.userId];

          await client.query(query, values);
          return 'User role changed successfully'
        } catch (error) {
          throw new HttpException('Failed to change user role', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
          client.release()
        }
    }
}
