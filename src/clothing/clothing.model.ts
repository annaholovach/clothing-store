import { Pool } from 'pg'
import * as dotenv from 'dotenv';
dotenv.config();

export async function createConnectionAndTableClothing(host, port, database, user, password) {
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
          CREATE TABLE IF NOT EXISTS clothing (
              id SERIAL PRIMARY KEY,
              title VARCHAR(255) NOT NULL,
              size VARCHAR(255) NOT NULL,
              price INTEGER NOT NULL,
              description VARCHAR(255),
              image VARCHAR(255)
          )
      `);

      console.log("Connection and table clothing created successfully.");
  } catch (error) {
      console.error("Error creating connection and table clothing:", error);
  } finally {
      client.release();
  }
}