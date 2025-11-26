import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import * as cors from 'cors';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: configService.get('FRONTEND_URL', 'http://localhost:3000'),
      credentials: true,
    }),
  );

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger
  const isProd = configService.get('NODE_ENV') === 'production';

  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('Costant API')
      .setDescription(
        'API para Plataforma de Transparência de Infraestrutura de Moçambique',
      )
      .setVersion('1.0')
      .addTag('projects')
      .addTag('reports')
      .addTag('ussd')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    console.log('📘 Swagger is enabled: /api/docs');
  } else {
    console.log('📕 Swagger disabled in production mode');
  }

  // Start server
  const port = configService.get('PORT') || 3005;
  const host = configService.get('HOST', '0.0.0.0');

  await app.listen(port, host);

  console.log(`🚀 Costant API running at http://${host}:${port}`);
  console.log(`📡 Environment: ${configService.get('NODE_ENV')}`);
}

bootstrap();
