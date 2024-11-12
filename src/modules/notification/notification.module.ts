import { Module } from '@nestjs/common';

import { WebsocketModule } from '@modules/websocket/websocket.module';

import { NotificationController } from './notification.controller';

@Module({
  imports: [WebsocketModule],
  controllers: [NotificationController],
})
export class NotificationModule {}
