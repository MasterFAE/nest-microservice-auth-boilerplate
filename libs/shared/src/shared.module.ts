import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  ClientsModule,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';

interface GrpcModule {
  serviceName: string;
  packageName: string;
  protoName: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  static registerRMQ(
    service: string,
    queue: string,
    durable: boolean = true,
  ): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (configService: ConfigService) => {
          const RMQ_USER = configService.get('RABBITMQ_USER');
          const RMQ_PASSWORD = configService.get('RABBITMQ_PASS');
          const RMQ_HOST = configService.get('RABBITMQ_HOST');
          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${RMQ_USER}:${RMQ_PASSWORD}@${RMQ_HOST}`],
              noAck: true,
              queue: queue,
              queueOptions: {
                durable: durable,
              },
            },
          });
        },
        inject: [ConfigService],
      },
    ];

    return {
      module: SharedModule,
      providers,
      exports: providers,
    };
  }

  static registerGRPC(data: GrpcModule[]) {
    let mappedOptions: ClientsModuleOptions = data.map(
      ({ packageName, serviceName, protoName }) => ({
        name: serviceName,
        transport: Transport.GRPC,
        options: {
          package: packageName,
          protoPath: join(__dirname, `../${protoName}.proto`),
        },
      }),
    );

    return ClientsModule.register(mappedOptions);
  }
}
