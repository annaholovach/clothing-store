import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DbService {
    private readonly pool: Pool;

    constructor() {
      this.pool = new Pool({
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      });
    }
  
    async executeQuery(query: string, params: any[] = []): Promise<any> {
      const client = await this.pool.connect();
  
      try {
        const result = await client.query(query, params);
        return result.rows;
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      } finally {
        client.release();
      }
    }
}
