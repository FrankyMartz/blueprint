import { configDotenv } from 'dotenv';
configDotenv({
  path: process.env.NODE_ENV === 'production' ? '../.env' : '../../../.env',
});
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './modules/app';
import { createAppOptions } from './utils';

async function bootstrap() {
  const appOptions = await createAppOptions();
  const app = await NestFactory.create(AppModule, appOptions);
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      // Remove any DTO properties without class-validator rules
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
