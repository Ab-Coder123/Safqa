import { IsEnum, IsUUID, Matches, IsOptional, IsInt, Min } from 'class-validator';
import { MediaEntityType, MediaType } from '@safqa/types';

export class AttachMediaDto {
  @IsEnum(MediaEntityType, { message: 'entity_type must be PRODUCT or USER' })
  entity_type!: MediaEntityType;

  @IsUUID('4', { message: 'entity_id must be a valid UUID' })
  entity_id!: string;

  @Matches(/^(https?:\/\/[^\s"'<>]+|\/uploads\/(?!.*\.\.)[a-zA-Z0-9._-]+)$/, {
    message: 'url must be a valid URL or safe uploaded image path',
  })
  url!: string;

  @IsOptional()
  @IsEnum(MediaType, { message: 'type must be IMAGE or VIDEO' })
  type?: MediaType;

  @IsOptional()
  @IsInt({ message: 'order must be an integer' })
  @Min(0, { message: 'order cannot be negative' })
  order?: number;
}
