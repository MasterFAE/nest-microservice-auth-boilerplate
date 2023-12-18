import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  GRPC_AUTH_PACKAGE_NAME,
  GRPC_AUTH_SERVICE_NAME,
  SharedModule,
} from '@app/shared';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { GrpcErrorInterceptor } from './grpc-exception.interceptor';

@Module({
  imports: [
    AuthModule,
    SharedModule.registerRMQ('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerGRPC([
      {
        serviceName: GRPC_AUTH_SERVICE_NAME,
        packageName: GRPC_AUTH_PACKAGE_NAME,
        protoName: 'auth',
      },
    ]),
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: GrpcErrorInterceptor },
    Logger,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
