import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { AuditService, ErrorLog } from 'mvc-common-toolkit';

import { WebsocketManagerService } from '@modules/websocket/websocket-manager.service';

import { APP_ACTION, INJECTION_TOKEN, WS_TOPIC } from '@shared/constants';
import { LogId } from '@shared/utils/interceptors/logging.interceptor';

import { SendNotificationDTO } from './notification.dto';

@Controller('notifications')
export class NotificationController {
  protected logger = new Logger(NotificationController.name);

  constructor(
    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,

    protected wsManagerService: WebsocketManagerService,
  ) {}

  @Post()
  public async sendNotificationToUsers(
    @LogId() logId: string,
    @Body() dto: SendNotificationDTO,
  ) {
    try {
      const context = { logId };

      dto.userIds.forEach((userId) =>
        this.wsManagerService.replyTo(
          context,
          userId,
          dto.content,
          WS_TOPIC.NOTIFICATION,
        ),
      );

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId,
          message: error.message,
          payload: dto,
          action: APP_ACTION.SEND_NOTIFICATION_TO_USERS,
        }),
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }
}
