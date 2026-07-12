import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      // убирает лишние поля
    forbidNonWhitelisted: true,  // ошибка если лишние поля
    transform: true,     // автоматически преобразует типы
  }));

  await app.listen(3000);
}

bootstrap();