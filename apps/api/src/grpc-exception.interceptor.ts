import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GrpcErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof RpcException) {
          const error: any = err.getError();
          const status = error.code as Status;
          switch (status) {
            case Status.CANCELLED:
              throw new NotFoundException('Request was cancelled');
            case Status.UNKNOWN:
              console.error('[GRPC] Unknown error occured');
              console.error(err);
              throw new BadRequestException('Unknown error occurred');
            case Status.INVALID_ARGUMENT:
              throw new BadRequestException('Invalid credentials');
            case Status.ALREADY_EXISTS:
              throw new BadRequestException('Already exists');
            case Status.NOT_FOUND:
              throw new BadRequestException('Not found');
            case Status.PERMISSION_DENIED:
              throw new ForbiddenException('Permission denied');
            case Status.UNAUTHENTICATED:
              throw new UnauthorizedException('Unauthorized');
            default:
              console.error('[GRPC] Unknown error occured');
              console.error(err);
              throw new InternalServerErrorException('Internal Server Error');
          }
        } else {
          return throwError(err);
        }
      }),
    );
  }
}
