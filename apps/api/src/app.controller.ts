import { Controller, Get, Inject, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from '@app/shared/decorators/public.decorator';
import { User } from '@app/shared/decorators/user.decorator';
import { JwtUser } from 'apps/auth/model/jwt-user';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get('')
  async getHello2(@User() user: JwtUser) {
    return `Welcome ${user.email}`;
  }

  @Get('test')
  @Public()
  async getHello(@Req() req) {
    return 'Succeed';
  }
}
