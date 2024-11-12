import {
  Body,
  Controller,
  Delete,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuditService, ErrorLog, HttpResponse } from 'mvc-common-toolkit';

import { WebsocketManagerService } from '@modules/websocket/websocket-manager.service';

import {
  APP_ACTION,
  CHAT_MESSAGE_TYPE,
  INJECTION_TOKEN,
  WS_TOPIC,
} from '@shared/constants';
import { MessageAckDTO } from '@shared/interfaces';
import { LogId } from '@shared/utils/interceptors/logging.interceptor';

import { AckMessageDTO, DeleteMessageDTO, SendMessageDTO } from './chat.dto';
import { MessageService } from './message.service';

@Controller('chats')
// TODO: Internal secret guard
@UseGuards()
export class ChatController {
  protected logger = new Logger(ChatController.name);

  constructor(
    protected configService: ConfigService,
    protected messageService: MessageService,
    protected wsManagerService: WebsocketManagerService,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,
  ) {}

  @Post(':chatId/messages')
  public async sendChatMessage(
    @LogId() logId: string,
    @Body() dto: SendMessageDTO,
    @Param('chatId') chatId: string,
  ) {
    try {
      const context = { logId };

      switch (dto.type) {
        case CHAT_MESSAGE_TYPE.SEND_MESSAGE:
          dto.userIds.forEach((userId) =>
            this.wsManagerService.replyTo(
              context,
              userId,
              {
                fromUserId: dto.senderId,
                chatId,
                message: JSON.parse(dto.content),
              },
              WS_TOPIC.SEND_MESSAGE,
            ),
          );
          break;

        case CHAT_MESSAGE_TYPE.REPLY_MESSAGE:
          dto.userIds.forEach((userId) =>
            this.wsManagerService.replyTo(
              context,
              userId,
              {
                fromUserId: dto.senderId,
                chatId,
                message: JSON.parse(dto.content),
              },
              WS_TOPIC.REPLY_MESSAGE,
            ),
          );
          break;

        default:
          dto.userIds.forEach((userId) =>
            this.wsManagerService.replyTo(
              context,
              userId,
              {
                fromUserId: dto.senderId,
                chatId,
                message: JSON.parse(dto.content),
              },
              WS_TOPIC.SEND_MESSAGE,
            ),
          );
          break;
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId,
          message: error.message,
          payload: dto,
          action: APP_ACTION.SEND_CHAT_MESSAGE_TO_USERS,
        }),
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':chatId/messages/read')
  public async markMessagesAsRead(
    @LogId() logId: string,
    @Body() dto: AckMessageDTO,
    @Param('chatId') chatId: string,
  ): Promise<HttpResponse> {
    try {
      const context = { logId };

      dto.userIds.forEach(
        (userId) =>
          this.wsManagerService.replyTo(context, userId, {
            chatId: chatId,
            messageId: dto.messageIds,
          } as unknown as MessageAckDTO),
        WS_TOPIC.READ_MESSAGE,
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
          action: APP_ACTION.MARK_MESSAGE_AS_READ,
        }),
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':chatId/messages/delete')
  public async deleteMessages(
    @LogId() logId: string,
    @Body() dto: DeleteMessageDTO,
    @Param('chatId') chatId: string,
  ) {
    try {
      const context = { logId };

      dto.userIds.forEach((userId) =>
        this.wsManagerService.replyTo(
          context,
          userId,
          {
            fromUserId: dto.senderId,
            chatId,
            messageId: dto.messageId,
          },
          WS_TOPIC.DELETE_MESSAGE,
        ),
      );
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId,
          message: error.message,
          payload: dto,
          action: APP_ACTION.DELETE_MESSAGE,
        }),
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }
}
