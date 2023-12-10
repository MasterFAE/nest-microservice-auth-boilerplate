import { Injectable, UnauthorizedException } from '@nestjs/common';
import IAuthService from './interface/IAuthService';
import { CreateUserDto, SignInUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '@app/prisma';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { JwtUser } from '../model/jwt-user';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

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

  async signUp({
    username,
    email,
    password,
  }: CreateUserDto): Promise<Omit<User, 'password'> & { token: string }> {
    const checkUser = await this.checkUser(email, username);
    if (checkUser && checkUser.id) throw new Error('User already exists');

    const hash = bcrypt.hashSync(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hash,
      },
    });

    const token = await this.signJWT({
      username,
      email,
      sub: newUser.id,
    });
    // Instead of delete user.password using this
    const { password: _, ...noPasswordUser } = newUser;

    return { ...noPasswordUser, token };
  }

  async signIn({
    email,
    password,
  }: SignInUserDto): Promise<Omit<User, 'password'> & { token: string }> {
    const checkUser = await this.checkUser(email);
    if (!checkUser) throw new Error('Invalid credentials');

    const compare = await bcrypt.compare(password, checkUser.password);
    if (!compare) throw new Error('Invalid credentials');

    // Instead of delete user.password using this
    const { password: _, ...noPasswordUser } = checkUser;

    const token = await this.signJWT({
      username: noPasswordUser.username,
      email,
      sub: noPasswordUser.id,
    });

    return { ...noPasswordUser, token };
  }

  async checkUser(email, username?): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, username != null ? { username } : {}],
      },
    });
    return user;
  }

  async signJWT(user: JwtUser) {
    const token = await this.jwtService.sign({ user });
    return token;
  }

  async decodeJWT(
    token: string,
  ): Promise<{ user: JwtUser; exp: number } | RpcException> {
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
