import {
  Controller,
  HttpStatus,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { JwtGuard } from './jwt.guard';
import { CreateUserDto, SignInUserDto } from './dto';
import setCookieOptions from 'libs/constants/functions/setCookieOptions';
import { Response as ExpressResponse } from 'express';
import ApiResponse from 'libs/constants/model/apiresponse.class';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly shared: SharedService,
  ) {}

  @Post('login')
  async login(
    @Payload() data: SignInUserDto,
    @Response({ passthrough: true }) res,
  ) {
    try {
      const user = await this.authService.signIn(data);
      setCookieOptions(res, 'access_token', user.token);
      return new ApiResponse({ user });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST);
      return new ApiResponse(null, false, error.toString());
    }
  }

  @Post('signup')
  async register(
    @Payload() data: CreateUserDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    try {
      const user = await this.authService.signUp(data);
      setCookieOptions(res, 'access_token', user.token);
      return new ApiResponse({ user });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST);
      return new ApiResponse(null, false, error.toString());
    }
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtGuard)
  async verifyJwt(@Ctx() ctx: RmqContext, @Payload() data: { token: string }) {
    this.shared.acknowledgeMessage(ctx);
    return this.authService.verifyJWT(data.token);
  }

  @MessagePattern({ cmd: 'decode-jwt' })
  async decodeJwt(@Ctx() ctx: RmqContext, @Payload() data: { token: string }) {
    this.shared.acknowledgeMessage(ctx);
    return this.authService.decodeJWT(data.token);
  }

  @MessagePattern({ cmd: 'sign-jwt' })
  async signJwt(@Ctx() ctx: RmqContext, @Payload() data: { user: any }) {
    this.shared.acknowledgeMessage(ctx);
    return this.authService.signJWT(data.user);
  }
}
