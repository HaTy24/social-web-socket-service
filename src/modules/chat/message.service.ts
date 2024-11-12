import { Inject, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditService, ErrorLog } from 'mvc-common-toolkit';

import { APP_ACTION, INJECTION_TOKEN } from '@shared/constants';
import { ReqContext } from '@shared/interfaces';
import { BaseCRUDService } from '@shared/services/base-crud-service';

import { Message } from './message.model';

export class MessageService extends BaseCRUDService {
  protected logger = new Logger(MessageService.name);

  constructor(
    @InjectModel(Message.name)
    model: Model<Message>,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,
  ) {
    super(model);
  }

  public async countUnreadMessages(
    context: ReqContext,
    userId: string,
    chatId: string,
  ): Promise<number> {
    try {
      const countUnreadMessages = await this.count({
        chatId,
        'metadata.readStatus.userId': {
          $nin: [userId],
        },
      });

      return countUnreadMessages;
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: context.logId,
          message: error.message,
          action: APP_ACTION.COUNT_UNREAD_MESSAGES,
          payload: {
            userId,
            chatId,
          },
        }),
      );

      return 0;
    }
  }
}
