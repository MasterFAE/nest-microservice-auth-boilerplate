import { RpcException } from '@nestjs/microservices';
import { CreateUserDto, SignInUserDto } from '../dto';
import { User } from '@prisma/client';

export default interface IAuthService {
  signUp(
    data: CreateUserDto,
  ): Promise<Omit<User, 'password'> & { token: string }>;

  signIn(
    data: SignInUserDto,
  ): Promise<Omit<User, 'password'> & { token: string }>;

  checkUser(email, username?): Promise<User>;

  signJWT(user: any): Promise<string | RpcException>;

  verifyJWT(token: string): Promise<{ user: any; exp: number } | RpcException>;

  decodeJWT(token: string): Promise<{ user: any; exp: number } | RpcException>;
}
