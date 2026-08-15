import { NestFactory } from '@nestjs/core';
import { ValidationPipe,  BadRequestException} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              
    forbidNonWhitelisted: true,  
    exceptionFactory: (errors) => {
      const result = errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints)[0]
      }))
      return new BadRequestException(result[0])
    }
  }))

  const config = new DocumentBuilder()
      .setTitle('BookTook Auth API')
      .setDescription('Регистрация и авторизация')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);
    
  app.use(cookieParser());
  await app.listen(3001);
}

bootstrap();