import {
  IsString,
  IsNumber,
  IsEnum,
  IsUUID,
  IsPositive,
  MinLength,
  MaxLength,
  Matches,
  IsArray,
  IsUrl,
} from 'class-validator';
import { ProductCondition } from '@safqa/types';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(150, { message: 'Title cannot exceed 150 characters' })
  title!: string;

  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters long' })
  @MaxLength(3000, { message: 'Description cannot exceed 3000 characters' })
  description!: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be greater than zero' })
  price!: number;

  @IsEnum(ProductCondition, { message: 'Condition must be NEW, USED, or REFURBISHED' })
  condition!: ProductCondition;

  @IsUUID('4', { message: 'category_id must be a valid UUID' })
  category_id!: string;

  @IsString()
  @Matches(/^(010|011|012|015)\d{8}$/, {
    message: 'WhatsApp number must be a valid Egyptian mobile number',
  })
  whatsapp_number!: string;

  @IsArray()
  @IsString({ each: true })
  @IsUrl(undefined, { each: true, message: 'Each image must be a valid URL' })
  media_urls!: string[];

}
