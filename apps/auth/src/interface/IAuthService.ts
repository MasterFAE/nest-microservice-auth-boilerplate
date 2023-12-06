import { RpcException } from '@nestjs/microservices';
import { CreateUserDto, SignInUserDto } from '../dto';

export default interface IAuthService {
  signUp(data: CreateUserDto): Promise<any>;

  signIn(data: SignInUserDto): Promise<any>;

  checkUser();

  signJWT(user: any): Promise<string | RpcException>;

  verifyJWT(token: string): Promise<{ user: any; exp: number } | RpcException>;

  decodeJWT(token: string): Promise<{ user: any; exp: number } | RpcException>;
}
