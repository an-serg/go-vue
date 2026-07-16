import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      // убирает лишние поля
    forbidNonWhitelisted: true,  // ошибка если лишние поля
    transform: true,     // автоматически преобразует типы
  }));

  const config = new DocumentBuilder()
      .setTitle('BookTook Auth API')
      .setDescription('Регистрация и авторизация')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/auth/docs', app, document);

    await app.listen(3000);
  }

bootstrap();