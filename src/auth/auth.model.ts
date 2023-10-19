import { Pool } from 'pg'
import * as dotenv from 'dotenv';
dotenv.config();

export async function createConnectionAndTableUsers(host, port, database, user, password) {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
  
  const client = await pool.connect();

  try {
      await client.query(`
          CREATE TABLE IF NOT EXISTS users (
              id SERIAL PRIMARY KEY,
              email VARCHAR(255) NOT NULL,
              password VARCHAR(255) NOT NULL
          )
      `);

      console.log("Connection and table users created successfully.");
  } catch (error) {
      console.error("Error creating connection and table:", error);
  } finally {
      client.release();
  }
}