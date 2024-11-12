import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  createParamDecorator,
} from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

import { AppRequest } from '@shared/interfaces';

export const HEADER_KEY_LOG_ID = 'X-Trace-Id';

export const logStringify = (data) =>
  typeof data === 'string' ? data : JSON.stringify(data);

export const GetLogId = (request: Request) => {
  if (!request.headers[HEADER_KEY_LOG_ID]) {
    request.headers[HEADER_KEY_LOG_ID] = createId().toUpperCase();
  }
  return request.headers[HEADER_KEY_LOG_ID] as string;
};

export const LogId = createParamDecorator(
  (_: any, ctx: ExecutionContext): string => {
    const request: Request = ctx.switchToHttp().getRequest();
    return GetLogId(request);
  },
);

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private logger = new Logger(this.constructor.name);

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: AppRequest = context.switchToHttp().getRequest();
    const logId = GetLogId(request);
    const user = request.user;

    const userString = user ? `${user.id}` : 'anonymous';

    this.logger.verbose(`[${logId}]: User: ${userString}`);

    this.logger.verbose(
      `[${logId}]: Request: ${request.method} ${request.url} ${
        request.body ? JSON.stringify(request.body) : ''
      }`,
    );

    return next.handle().pipe(
      tap((responseBody: any) => {
        this.logger.verbose(
          `[${logId}]: Response: ${JSON.stringify(responseBody)}`,
        );
      }),
    );
  }
}
