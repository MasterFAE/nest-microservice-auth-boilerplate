import { Injectable, UnauthorizedException } from '@nestjs/common';
import IAuthService from './interface/IAuthService';
import { CreateUserDto, SignInUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyJWT(
    jwt: string,
  ): Promise<{ user: any; exp: number } | RpcException> {
    if (!jwt) {
      throw new RpcException('JWT token is missing');
    }

    try {
      const { user, exp } = await this.jwtService.verifyAsync(jwt);
      return { user, exp };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  signUp(data: CreateUserDto): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async signIn({ username, password }: SignInUserDto) {
    const user = { username };
    const token = await this.signJWT(user);
    return token;
  }

  checkUser() {
    throw new Error('Method not implemented.');
  }

  async signJWT(user: any) {
    const token = await this.jwtService.sign({ user });
    return token;
  }

  async decodeJWT(
    token: string,
  ): Promise<{ user: any; exp: number } | RpcException> {
    if (!token) {
      throw new RpcException('JWT token is missing');
    }

    try {
      const { user, exp } = await this.jwtService.decode(token);
      return { user, exp };
    } catch (error) {
      console.log('JWT Decoding error: ' + error.message);
      throw new RpcException(error.message);
    }
  }
}
