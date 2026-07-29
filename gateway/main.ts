import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('BookTook API')
    .setDescription('API Gateway - все эндпоинты')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
}
bootstrap();