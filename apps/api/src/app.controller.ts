import { Controller, Get, Inject, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from '@app/shared/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get('')
  async getHello2(@Req() req) {
    console.log({ user: req.user });
    return 'Succeed';
  }

  @Get('test')
  @Public()
  async getHello(@Req() req) {
    return 'Succeed';
  }
}
