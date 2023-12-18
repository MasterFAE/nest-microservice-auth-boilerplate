import { IS_PUBLIC_KEY } from '@app/shared/decorators/public.decorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // http??
    if (isPublic) return true;
    return super.canActivate(context);
  }

  // handleRequest(...props: any[]) {
  //   try {
  //     return super.handleRequest(...props);
  //   } catch (error) {
  //     console.log({ reqErr: error });
  //     // Using this message to refresh token on Shared/AuthGuard
  //     throw new CustomRpcException(
  //       Status.UNAUTHENTICATED,
  //       INVALID_OR_EXPIRED_TOKEN_ERROR_MESSAGE,
  //     );
  //   }
  // }
}
