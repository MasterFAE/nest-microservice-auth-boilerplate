import {
  CreateUserDto,
  GRPC_AUTH_SERVICE_NAME,
  IAuthServiceClient,
  LoginDto,
} from '@app/shared';
import { Public } from '@app/shared/decorators/public.decorator';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  OnModuleInit,
  Post,
  Res,
  Response,
  UseInterceptors,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { GrpcErrorInterceptor } from '../grpc-exception.interceptor';
import { firstValueFrom } from 'rxjs';
import setCookieOptions from 'libs/constants/functions/setCookieOptions';
import { User } from '@app/shared/decorators/user.decorator';

@Controller('auth')
@UseInterceptors(GrpcErrorInterceptor)
export class AuthController implements OnModuleInit {
  private authService: IAuthServiceClient;

  constructor(@Inject(GRPC_AUTH_SERVICE_NAME) private client: ClientGrpc) {}
  onModuleInit() {
    this.authService = this.client.getService<IAuthServiceClient>(
      GRPC_AUTH_SERVICE_NAME,
    );
  }

  @Public()
  @Get('test2')
  pri() {
    return 'sa';
  }

  @Get('test')
  printTest(@User() user) {
    console.log({ user });
    return user;
  }

  @Public()
  @Post('login')
  async login(@Res() res, @Body() data: LoginDto) {
    try {
      const serviceResponse = await firstValueFrom(
        this.authService.login(data),
      );
      setCookieOptions(res, 'access_token', serviceResponse.token);
      res.json(serviceResponse);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Public()
  @Post('register')
  async register(@Res() res, @Body() data: CreateUserDto) {
    try {
      const serviceResponse = await firstValueFrom(
        this.authService.register(data),
      );
      setCookieOptions(res, 'access_token', serviceResponse.token);
      res.json(serviceResponse);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
