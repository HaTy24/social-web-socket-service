import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  AuditService,
  ErrorLog,
  OperationResult,
  stringUtils,
} from 'mvc-common-toolkit';
import { Socket } from 'socket.io';

import { APP_ACTION, INJECTION_TOKEN, WS_TOPIC } from '@shared/constants';
import { AppSocket, ReqContext } from '@shared/interfaces';

@Injectable()
export class WebsocketManagerService {
  protected userWsMap = new Map<string, Socket[]>();
  protected logger = new Logger(WebsocketManagerService.name);

  constructor(
    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,
  ) {}

  /**
   * Sends a general message to a user's connected socket
   * @param context The request context
   * @param destinationUserId userId to send message to
   * @param message The message
   * @param topic The topic to send the message to
   * @returns Operation Result
   */
  public replyTo(
    context: ReqContext,
    destinationUserId: string,
    message: any,
    topic = WS_TOPIC.SEND_MESSAGE,
  ): OperationResult {
    try {
      const foundWs = this.userWsMap.get(destinationUserId);

      // This user is not online on our server. Consider this a success
      if (!foundWs) {
        return {
          success: true,
        };
      }

      foundWs.map((ws) => ws.emit(topic, message));

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: context.logId,
          message: error.message,
          action: APP_ACTION.REPLY_TO_USER_MESSAGE,
          payload: {
            destinationUserId,
            message,
          },
        }),
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  public async disconnect(socket: AppSocket): Promise<void> {
    const userId = socket.data?.user?.id;
    if (!userId) {
      return;
    }

    const foundUserWs = this.userWsMap.get(userId);
    if (!foundUserWs) {
      return;
    }

    if (foundUserWs.length === 1) {
      this.userWsMap.delete(userId);
      return;
    }

    this.userWsMap.set(
      userId,
      foundUserWs.filter((socketUser) => socketUser !== socket),
    );
  }

  /**
   * Saves user's socket into a registry to be retrieved later
   * @param userId The user's id
   * @param socket The user's socket
   * @returns OperationResult
   */
  public join(userId: string, socket: Socket): OperationResult {
    try {
      const foundUserWs = this.userWsMap.get(userId) || [];
      if (foundUserWs.length >= 5) {
        return {
          success: false,
          message: 'limit 5 devices per user',
        };
      }

      foundUserWs.push(socket);
      this.userWsMap.set(userId, foundUserWs);

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: stringUtils.generateRandomId(),
          message: error.message,
          action: APP_ACTION.JOIN_USER_SOCKET,
        }),
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }
}
