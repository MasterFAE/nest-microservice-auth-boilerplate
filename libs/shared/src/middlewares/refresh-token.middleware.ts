import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response, NextFunction } from 'express';
import { firstValueFrom } from 'rxjs';
import setCookieOptions from 'libs/constants/functions/setCookieOptions';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(@Inject('AUTH_SERVICE') private authService: ClientProxy) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const access_token = req.cookies.access_token ?? null;
    if (!access_token) return next();
    try {
      await firstValueFrom(
        this.authService.send({ cmd: 'verify-jwt' }, { token: access_token }),
      );
      return next();
    } catch (error) {
      const { exp, user } = await firstValueFrom(
        this.authService.send({ cmd: 'decode-jwt' }, { token: access_token }),
      );

      const $aDayEarlier = Date.now() - 1000 * 60 * 60 * 24;

      // Check if token expire date is between 1 days from now
      const dateCheck = exp * 1000 >= $aDayEarlier;
      if (dateCheck) {
        console.log('Refresh Token Middleware Triggered');
        const newToken = await firstValueFrom(
          this.authService.send({ cmd: 'sign-jwt' }, { user }),
        );
        req.cookies.access_token = newToken;
        setCookieOptions(res, 'access_token', newToken);
      }

      next();
    }
  }
}
