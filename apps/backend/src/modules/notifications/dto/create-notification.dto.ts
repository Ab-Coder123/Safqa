import { IsString, IsEnum, IsUUID, IsNotEmpty } from 'class-validator';
import { NotificationType } from '@safqa/types';

export class CreateNotificationDto {
  @IsUUID('4')
  user_id!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;
}
