import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
import {createConnectionAndTableUsers} from './auth/auth.model'
import {createConnectionAndTableClothing} from './clothing/clothing.model'
import { createConnectionAndTableOrders } from './orders/orders.model';
import { createConnectionAndTableClothOrder } from './orders/cloth-order.model';

async function start () {
  const PORT = process.env.PORT || 5000
  const host = process.env.POSTGRES_HOST
  const port = process.env.POSTGRES_PORT
  const database = process.env.POSTGRES_DB
  const user = process.env.POSTGRES_USER
  const password = process.env.POSTGRES_PASSWORD

  const app = await NestFactory.create(AppModule)
  createConnectionAndTableUsers(host, port, database, user, password).catch(error => console.error("Error:", error))
  createConnectionAndTableClothing(host, port, database, user, password).catch(error => console.error("Error:", error))
  createConnectionAndTableOrders(host, port, database, user, password).catch(error => console.error("Error:", error))
  createConnectionAndTableClothOrder(host, port, database, user, password).catch(error => console.error("Error:", error))
  await app.listen(PORT, () => console.log(`server started on ${PORT}`))
}

start()
