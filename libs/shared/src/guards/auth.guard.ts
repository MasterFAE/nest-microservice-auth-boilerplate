import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') {
      return false;
    }
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();

    const access_token = req.cookies.access_token ?? '';
    return this.authService
      .send({ cmd: 'verify-jwt' }, { token: access_token })
      .pipe(
        switchMap((res) => {
          console.log({ res });
          if (res instanceof RpcException) {
            throw new UnauthorizedException(res.message);
          }
          return of(true);
        }),
        catchError((err) => {
          console.log('Auth guard error: ', err.message);
          throw new UnauthorizedException();
        }),
      );
  }
}
