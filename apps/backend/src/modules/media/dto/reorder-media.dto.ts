import { IsArray, ValidateNested, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class MediaOrderItem {
  @IsUUID('4', { message: 'id must be a valid UUID' })
  id!: string;

  @IsInt({ message: 'order must be an integer' })
  @Min(0, { message: 'order cannot be negative' })
  order!: number;
}

export class ReorderMediaDto {
  @IsArray({ message: 'items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => MediaOrderItem)
  items!: MediaOrderItem[];
}
