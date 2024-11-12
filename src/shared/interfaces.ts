import { Request } from 'express';
import { Socket } from 'socket.io';

import { CHAT_TYPE } from './constants';

export interface FindOptions {
  sort: Record<string, number>;
  select: string;
  populate: any[];
}

export interface UserProfile {
  id: string;
  twitterScreenName: string;
  fullname: string;
  location: string;
  description: string;
  website: string;
  joinDate: string;
  walletAddress: string;
  profile_image_url: string;
  status: string;
  profile_banner_url: string;
}

export interface HasTimestamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageAckDTO {
  messageId?: string;
  tempId?: string;
  chatId: string;
}

export interface Typed<T = any> {
  type: T;
}

export interface NotificationInformation {
  content: Typed & Record<string, any>;
  id: string;
}

export interface AppSocket extends Socket {
  data: {
    user: Partial<UserProfile>;
  };
}

export interface IMessage {
  content: string;
  createdAt: Date;
}

export interface ChatInformation {
  id: string;
  unreadCount: number;
  type: CHAT_TYPE;
  lastMessage: IMessage;
  participants: Partial<UserProfile>[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReqContext {
  logId: string;
  socket?: Socket;
}

export interface UserAuthPayload {
  id: string;
}

export interface AppRequest extends Request {
  user?: UserAuthPayload;
}
