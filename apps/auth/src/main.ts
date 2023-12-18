import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GRPC_AUTH_PACKAGE_NAME, SharedService } from '@app/shared';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);
  const logger = app.get(Logger);
  const AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  app.use(cookieParser());
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getRmqOptions(AUTH_QUEUE),
  );

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGrpcOptions(GRPC_AUTH_PACKAGE_NAME, 'auth'),
  );

  logger.verbose('[Auth Service]: Auth Service is up!');
  logger.verbose('[Auth Service]: Auth Service is up!');
  logger.verbose('[Auth Service]: Auth Service is up!');

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
