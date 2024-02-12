import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RpcException } from '@nestjs/microservices';

import { GrpcLoggingInterceptor } from '@app/shared/interceptors/grpc-logging.interceptor';
import { AuthServiceControllerMethods, IAuthServiceController, UserId, UserResponse, UserLogin, UserTokenPayload, UserCreate, JwtToken, UserJwtPayload, UserSignJwt } from '@app/shared';
import serviceExceptionGenerator from '@app/shared/exceptions/service-exception-generator';

@Controller()
@AuthServiceControllerMethods()
// @ts-ignore
@UseInterceptors(new GrpcLoggingInterceptor(new Logger()))
export class AuthController implements IAuthServiceController {
  constructor(private readonly authService: AuthService) {}

  async currentUser(data: UserId): Promise<UserResponse> {
    try {
      const userWithToken = await this.authService.getUserFromId(data);
      return userWithToken;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async login(data: UserLogin): Promise<UserTokenPayload> {
    try {
      const userWithToken = await this.authService.login(data);
      return userWithToken;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async register(data: UserCreate): Promise<UserTokenPayload> {
    try {
      const userWithToken = await this.authService.register(data);
      return userWithToken;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async verifyToken(data: JwtToken): Promise<UserJwtPayload> {
    try {
      const res = await this.authService.verifyToken(data);
      return res;
    } catch (er) {
      const { error } = serviceExceptionGenerator(er);
      throw new RpcException(error);
    }
  }

  async decodeToken(data: JwtToken): Promise<UserJwtPayload> {
    return this.authService.decodeToken(data);
  }

  async signToken(data: UserSignJwt): Promise<JwtToken> {
    return this.authService.signToken(data);
  }
}
