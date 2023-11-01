import { Pool } from 'pg'
import * as dotenv from 'dotenv';
dotenv.config();

export async function createConnectionAndTableClothOrder(host, port, database, user, password) {
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
          CREATE TABLE IF NOT EXISTS cloth_order (
              id SERIAL PRIMARY KEY,
              cloth_id INTEGER REFERENCES clothing(id) ON UPDATE CASCADE ON DELETE CASCADE,
              order_id INTEGER REFERENCES orders(id) ON UPDATE CASCADE,
              amount INTEGER
          )
      `);

      console.log("Connection and table cloth_order created successfully.");
  } catch (error) {
      console.error("Error creating connection and table cloth_order:", error);
  } finally {
      client.release();
  }
}