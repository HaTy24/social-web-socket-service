import { Module } from '@nestjs/common';

import { UserModule } from '@modules/user/user.module';

import { WebsocketManagerService } from './websocket-manager.service';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [UserModule],
  exports: [WebsocketManagerService],
  providers: [WebsocketGateway, WebsocketService, WebsocketManagerService],
})
export class WebsocketModule {}
