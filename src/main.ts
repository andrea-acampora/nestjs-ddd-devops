import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionFilter } from './libs/exceptions/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableShutdownHooks();
  app.enableCors();
  app.useStaticAssets({
    root: join(__dirname, '../public'),
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors
            .map((error) => Object.values(error.constraints as object))
            .flat(),
        );
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
