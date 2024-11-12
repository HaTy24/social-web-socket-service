import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '@modules/user/user.module';
import { WebsocketModule } from '@modules/websocket/websocket.module';

import { ChatController } from './chat.controller';
import { Chat, ChatSchema } from './chat.model';
import { Message, MessageSchema } from './message.model';
import { MessageService } from './message.service';

@Module({
  controllers: [ChatController],
  providers: [MessageService],
  imports: [
    WebsocketModule,
    UserModule,
    MongooseModule.forFeature([
      {
        schema: ChatSchema,
        name: Chat.name,
      },
      {
        schema: MessageSchema,
        name: Message.name,
      },
    ]),
  ],
})
export class ChatModule {}
