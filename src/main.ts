import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/httpException.filter';
import { AllExceptionsFilter } from './common/filters/allExceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  const httpAdapterHost = app.get(HttpAdapterHost)

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
