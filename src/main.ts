import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { createTables } from './app.model';

async function start() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  await createTables();
  await app.listen(PORT, () => console.log(`server started on ${PORT}`));
}

start();
