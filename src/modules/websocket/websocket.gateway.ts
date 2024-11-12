import { Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuditService, ErrorLog, stringUtils } from 'mvc-common-toolkit';
import { Server } from 'socket.io';

import { UserService } from '@modules/user/user.service';

import { APP_ACTION, INJECTION_TOKEN, WS_PORT } from '@shared/constants';
import { AppSocket } from '@shared/interfaces';
import { HEADER_KEY_LOG_ID } from '@shared/utils/interceptors/logging.interceptor';

import { WebsocketManagerService } from './websocket-manager.service';

@WebSocketGateway(WS_PORT, {
  transports: ['websocket'],
  path: '/ws',
  cors: { origin: '*' },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  protected logger = new Logger(WebSocketGateway.name);

  @WebSocketServer()
  protected server: Server;

  constructor(
    protected wsManagerService: WebsocketManagerService,
    protected userService: UserService,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected auditService: AuditService,
  ) {}

  public async handleDisconnect(client: AppSocket) {
    return this.wsManagerService.disconnect(client);
  }

  public async handleConnection(client: AppSocket) {
    try {
      const authHeader =
        client.handshake?.auth?.authorization ||
        client.handshake?.headers?.authorization;
      if (!authHeader) {
        client.send('unauthorized');
        client.disconnect();

        return;
      }

      const logId =
        (client.request.headers[HEADER_KEY_LOG_ID] as string) ||
        stringUtils.generateRandomId();

      /* eslint-disable */
      const [_, authToken] = authHeader.split(' ');

      const userProfileResult = await this.userService.authorizeUser(
        { logId },
        authToken,
      );

      if (!userProfileResult.success) {
        client.send('unauthorized');
        client.disconnect();

        return;
      }

      const userProfile = userProfileResult.data;

      client.data.user = userProfile;

      const joinResult = this.wsManagerService.join(userProfile.id, client);

      if (!joinResult.success) {
        client.send(joinResult.message);
        client.disconnect();

        return;
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);

      this.auditService.emitLog(
        new ErrorLog({
          logId: stringUtils.generateRandomId(),
          message: error.message,
          action: APP_ACTION.HANDLE_USER_CONNECTION,
        }),
      );

      client.disconnect();
    }
  }
}
