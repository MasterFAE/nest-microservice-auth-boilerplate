import {
  GRPC_AUTH_PACKAGE_NAME,
  GRPC_AUTH_SERVICE_NAME,
  SharedModule,
} from '@app/shared';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    SharedModule.registerRMQ('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerGRPC([
      {
        serviceName: GRPC_AUTH_SERVICE_NAME,
        packageName: GRPC_AUTH_PACKAGE_NAME,
        protoName: 'auth',
      },
    ]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
