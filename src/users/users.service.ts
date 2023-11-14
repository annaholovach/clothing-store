import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ChangeRoleDto } from './dto/change.role.dto';
import { DbService } from '../db/db.service';
dotenv.config();

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DbService) {}

  async getAll() {
    const query = 'SELECT id, email, role FROM users';
    const result = await this.databaseService.executeQuery(query);
    return result;
  }

  async getOne(id: number) {
    const query = 'SELECT id, email, role FROM users WHERE id = $1';
    const values = [id];
    const result = await this.databaseService.executeQuery(query, values);

    if (result.length > 0) {
      return result[0];
    } else {
      throw new HttpException(
        'user with such id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async changeRole(dto: ChangeRoleDto) {
    const user = await this.getOne(dto.userId);
    if (!user) {
      throw new HttpException(
        'user with such id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const query = 'UPDATE users SET role = $1 WHERE id = $2';
    const values = [dto.role, dto.userId];

    try {
      await this.databaseService.executeQuery(query, values);
      return 'User role changed successfully';
    } catch (error) {
      throw new HttpException(
        'Failed to change user role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
