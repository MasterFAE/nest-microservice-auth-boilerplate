import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getRmqOptions(AUTH_QUEUE),
  );
  console.log('AUTH SERVICE');
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
