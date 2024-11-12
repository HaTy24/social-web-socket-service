import { ArrayMinSize, IsArray, IsObject } from 'class-validator';

export class SendNotificationDTO {
  @IsArray()
  @ArrayMinSize(1)
  userIds: string[];

  @IsObject()
  content: any;
}
