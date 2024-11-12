import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { CHAT_MESSAGE_TYPE, CHAT_TYPE } from '@shared/constants';
import { PaginationDTO } from '@shared/services/dto/pagination.dto';

export class PaginateChatMessagesDTO extends PaginationDTO {
  protected parseFilters(): void {}
}

export class PaginateUserChatsDTO extends PaginationDTO {
  protected parseFilters(): void {
    return;
  }
}

export class AckMessageDTO {
  @MinLength(1)
  @MaxLength(255)
  senderId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  userIds: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  messageIds: string[];

  @IsEnum(Object.values(CHAT_MESSAGE_TYPE))
  type: CHAT_MESSAGE_TYPE;
}

export class SendMessageDTO {
  public static from(data: any): SendMessageDTO {
    const instance = new SendMessageDTO();

    Object.assign(instance, data);

    return instance;
  }

  @MinLength(1)
  @MaxLength(100)
  senderId: string;

  @MinLength(1)
  content: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  userIds: string[];

  @IsEnum(Object.values(CHAT_MESSAGE_TYPE))
  type: CHAT_MESSAGE_TYPE;
}

export class DeleteMessageDTO {
  @IsString()
  messageId: string;

  @MinLength(1)
  @MaxLength(255)
  senderId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  userIds: string[];
}

export class CreateChatDTO {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  participants: string[];

  @IsEnum(Object.values(CHAT_TYPE))
  type: CHAT_TYPE;

  @IsOptional()
  @IsObject()
  metadata: any;
}
