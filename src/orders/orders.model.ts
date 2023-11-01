import { Pool } from 'pg'
import * as dotenv from 'dotenv';
dotenv.config();

export async function createConnectionAndTableOrders(host, port, database, user, password) {
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
          CREATE TABLE IF NOT EXISTS orders (
              id SERIAL PRIMARY KEY,
              userId INTEGER REFERENCES users(id),
              items JSONB NOT NULL,
              totalPrice DECIMAL,
              createdAt TIMESTAMP DEFAULT current_timestamp
          )
      `);

      console.log("Connection and table orders created successfully.");
  } catch (error) {
      console.error("Error creating connection and table orders:", error);
  } finally {
      client.release();
  }
}