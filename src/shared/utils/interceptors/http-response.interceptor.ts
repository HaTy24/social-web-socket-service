import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { AuditService, ErrorLog, HttpResponse } from 'mvc-common-toolkit';
import { Observable, catchError, map, of } from 'rxjs';

import { APP_ACTION } from '@shared/constants';

import { GetLogId } from './logging.interceptor';

export class HttpResponseInterceptor implements NestInterceptor {
  protected logger = new Logger(this.constructor.name);

  constructor(protected auditService: AuditService) {}

  public intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: Request = ctx.switchToHttp().getRequest();
    const logId = GetLogId(request);

    return next.handle().pipe(
      map((response: HttpResponse<unknown>) => {
        // it's completed response from controller
        if (response?.success === false || response?.success === true)
          return response;

        // not completed, response is data
        const payload = response?.data || response;
        return { success: true, data: payload };
      }),
      catchError(async (error) => {
        this.logger.error(`[${logId}]: ${error?.message}`, error.stack);
        this.auditService
          .emitLog(
            new ErrorLog({
              logId,
              message: error?.message,
              action: APP_ACTION.SEND_HTTP_RESPONSE,
              metadata: {
                url: request.url,
                method: request.method,
              },
            }),
          )
          .catch((e) =>
            this.logger.error(`[${logId}]: ${error?.message}`, e?.stack),
          );
        return of({
          success: false,
          code: 'internal_server_error',
        });
      }),
    );
  }
}
