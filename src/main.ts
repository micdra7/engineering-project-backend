import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Engineering project')
    .setDescription('Engineering project API description')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, swaggerDocument);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('/v1/api');
  await app.listen(process.env.PORT);
}

bootstrap();
