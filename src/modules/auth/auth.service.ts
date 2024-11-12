import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuditService, ErrorLog, OperationResult } from 'mvc-common-toolkit';

import { APP_ACTION, INJECTION_TOKEN } from '@shared/constants';
import { ReqContext, UserAuthPayload } from '@shared/interfaces';

@Injectable()
export class AuthService {
  protected logger = new Logger(AuthService.name);

  constructor(
    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,
  ) {}

  public async authorizeUser(
    context: ReqContext,
    authToken: string,
  ): Promise<OperationResult<UserAuthPayload>> {
    try {
      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: context.logId,
          message: error.message,
          action: APP_ACTION.AUTHORIZE_USER,
          payload: {
            authToken,
          },
        }),
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }
}
