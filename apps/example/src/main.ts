import { NestFactory } from '@nestjs/core';
import { ExampleModule } from './example.module';
import { GRPC_EXAMPLE, SharedService } from '@app/shared';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ExampleModule);
  const sharedService = app.get(SharedService);
  const logger = app.get(Logger);
  const grpcPackageOptions = GRPC_EXAMPLE;
  app.useLogger(logger);

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getGrpcOptions(grpcPackageOptions),
  );

  await app.startAllMicroservices();
  await app.listen(grpcPackageOptions.httpPort);
  app.useLogger(logger);

  logger.verbose('------------------------------------');
  logger.verbose('[Example Service]: Example Service is up!');
  logger.verbose(`[Example Service]: HOST: ${grpcPackageOptions.host}`);
  logger.verbose(`[Example Service]: GRPC: ${grpcPackageOptions.port}`);
  logger.verbose(`[Example Service]: HTTP: ${grpcPackageOptions.httpPort}`);
  logger.verbose('------------------------------------');
}
bootstrap();
