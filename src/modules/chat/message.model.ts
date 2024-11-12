import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

import { HasTimestamp } from '@shared/interfaces';

export type MessageDocument = HydratedDocument<Message> &
  HasTimestamp & {
    addUserToReadList(userId: string): MessageDocument;
  };

export class MessageReadInformation {
  @Prop({
    index: true,
  })
  userId: string;

  @Prop()
  readAt: Date;
}

const MessageReadInformationSchema = SchemaFactory.createForClass(
  MessageReadInformation,
);

@Schema({ timestamps: false, id: false })
export class MessageMetadata {
  @Prop({
    type: [MessageReadInformationSchema],
  })
  readStatus: MessageReadInformation[];
}

const MessageMetadataSchema = SchemaFactory.createForClass(MessageMetadata);

@Schema({ collection: 'messages', timestamps: true })
export class Message {
  @Prop({
    index: true,
  })
  userId: string;

  @Prop({
    index: true,
    type: SchemaTypes.ObjectId,
  })
  chatId: string;

  @Prop()
  content: string;

  @Prop({
    type: MessageMetadataSchema,
  })
  metadata: MessageMetadata;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.methods.addUserToReadList = function (
  userId: string,
): MessageDocument {
  const readData = {
    userId,
    readAt: new Date(),
  };

  const readList: MessageReadInformation[] = this.metadata?.readStatus || [];

  if (readList.find((i) => i.userId === userId)) return this;

  readList.push(readData);

  return this;
};
