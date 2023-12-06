import {
  BadRequestException,
  Controller,
  Get,
  Inject,
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
import { SignInUserDto } from './dto';

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
      const token = await this.authService.signIn(data);
      res.cookie('access_token', token, {
        // httpOnly: true,
        maxAge: 3.154e10,
      });
      return { token };
    } catch (error) {
      console.log({ error });
      return new BadRequestException('');
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
