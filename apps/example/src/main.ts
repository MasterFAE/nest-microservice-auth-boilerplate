import { NestFactory } from '@nestjs/core';
import { ExampleModule } from './example.module';
import { GRPC_EXAMPLE, SharedService } from '@app/shared';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ExampleModule);
  const sharedService = app.get(SharedService);
  const logger = app.get(Logger);

  app.use(cookieParser());
  app.useLogger(logger);

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGrpcOptions(
      GRPC_EXAMPLE.packageName,
      GRPC_EXAMPLE.protoName,
    ),
  );

  logger.verbose('[Example Service]: Example Service is up!');
  logger.verbose('[Example Service]: Example Service is up!');
  logger.verbose('[Example Service]: Example Service is up!');

  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
