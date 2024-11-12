import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuditService,
  ErrorLog,
  HttpService,
  OperationResult,
} from 'mvc-common-toolkit';

import { APP_ACTION, ENV_KEY, INJECTION_TOKEN } from '@shared/constants';
import { ReqContext, UserProfile } from '@shared/interfaces';

@Injectable()
export class UserService {
  protected logger = new Logger(UserService.name);

  constructor(
    protected configService: ConfigService,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,

    @Inject(INJECTION_TOKEN.HTTP_SERIVCE)
    protected httpService: HttpService,
  ) {}

  protected get apiUrl(): string {
    return this.configService.getOrThrow(ENV_KEY.API_BACKEND_URL);
  }

  protected get authHeader(): Record<string, string> {
    return {
      Authorization: this.configService.getOrThrow(
        ENV_KEY.API_BACKEND_AUTH_SECRET,
      ),
    };
  }

  public async authorizeUser(
    context: ReqContext,
    authToken: string,
  ): Promise<OperationResult<UserProfile>> {
    try {
      const url = `${this.apiUrl}/profile`;

      const userProfileResponse = await this.httpService.send('get', url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const { data: body } = userProfileResponse;
      if (!body?.success) {
        return {
          success: false,
          message: body?.message,
          code: body?.code,
        };
      }

      return {
        success: true,
        data: body.data,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: context.logId,
          message: error.message,
          action: APP_ACTION.AUTHORIZE_USER,
        }),
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }
}
