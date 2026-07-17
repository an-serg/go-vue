import { NestFactory } from '@nestjs/core';
import { ValidationPipe,  BadRequestException} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
  exceptionFactory: (errors) => {
    const result = errors.map(error => ({
      field: error.property,  // ← имя поля
      message: Object.values(error.constraints)[0]  // ← текст ошибки
    }))
    return new BadRequestException(result[0])  // ← только первая ошибка
  }
}))

  const config = new DocumentBuilder()
      .setTitle('BookTook Auth API')
      .setDescription('Регистрация и авторизация')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('auth/docs', app, document);

    await app.listen(3000);
  }

bootstrap();