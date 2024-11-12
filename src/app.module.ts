import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuditModule } from '@modules/audit/audit.module';
import { ChatModule } from '@modules/chat/chat.module';
import { HttpModule } from '@modules/http/http.module';
import { NotificationModule } from '@modules/notification/notification.module';

import { ENV_KEY } from '@shared/constants';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    AuthModule,
    AuditModule,
    HttpModule,
    WebsocketModule,
    AuthModule,
    ChatModule,
    NotificationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow(ENV_KEY.MONGO_URI),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
