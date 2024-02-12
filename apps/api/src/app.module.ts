import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GRPC_AUTH, GRPC_EXAMPLE, SharedModule } from '@app/shared';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { GrpcErrorInterceptor } from './grpc-exception.interceptor';
import { ExampleModule } from './example/example.module';
import { AuthGuard } from './lib/guards/auth.guard';
import { RequestLoggerInterceptor } from './lib/request-logger.interceptor';

@Module({
  imports: [
    AuthModule,
    ExampleModule,
    SharedModule.registerRMQ('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerGRPC([GRPC_AUTH, GRPC_EXAMPLE]),
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: GrpcErrorInterceptor },
    { provide: APP_INTERCEPTOR, useClass: RequestLoggerInterceptor },
    Logger,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
