import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

import { CHAT_TYPE } from '@shared/constants';
import { HasTimestamp } from '@shared/interfaces';

export type ChatDocument = HydratedDocument<Chat> & HasTimestamp;

@Schema({ collection: 'chats', timestamps: true })
export class Chat {
  @Prop({
    type: [String],
    index: true,
  })
  participants: string[];

  @Prop({
    type: String,
    index: true,
  })
  type: CHAT_TYPE;

  @Prop({
    type: SchemaTypes.Mixed,
  })
  metadata: any;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
