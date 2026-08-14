import { IsEnum, IsUUID, IsUrl, IsOptional, IsInt, Min } from 'class-validator';
import { MediaEntityType, MediaType } from '@safqa/types';

export class AttachMediaDto {
  @IsEnum(MediaEntityType, { message: 'entity_type must be PRODUCT or USER' })
  entity_type!: MediaEntityType;

  @IsUUID('4', { message: 'entity_id must be a valid UUID' })
  entity_id!: string;

  @IsUrl({}, { message: 'url must be a valid URL string' })
  url!: string;

  @IsOptional()
  @IsEnum(MediaType, { message: 'type must be IMAGE or VIDEO' })
  type?: MediaType;

  @IsOptional()
  @IsInt({ message: 'order must be an integer' })
  @Min(0, { message: 'order cannot be negative' })
  order?: number;
}
