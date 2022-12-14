import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*"
  })

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
