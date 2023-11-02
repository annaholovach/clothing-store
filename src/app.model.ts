import { Pool } from 'pg'
import * as fs from 'fs'

export async function createTables() {
    const pool = new Pool({
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      });

    const client = await pool.connect();
    try {
        const sqlScript = fs.readFileSync('src/create-tables.sql', 'utf-8');
        await client.query(sqlScript);
        console.log('Tables created successfully');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        client.release();
    }
}

