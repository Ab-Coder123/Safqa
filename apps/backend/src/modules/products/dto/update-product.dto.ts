import {
  IsString,
  IsNumber,
  IsEnum,
  IsUUID,
  IsPositive,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ProductCondition } from '@safqa/types';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters long' })
  @MaxLength(3000)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: 'Price must be greater than zero' })
  price?: number;

  @IsOptional()
  @IsEnum(ProductCondition, { message: 'Condition must be NEW, USED, or REFURBISHED' })
  condition?: ProductCondition;

  @IsOptional()
  @IsUUID('4', { message: 'category_id must be a valid UUID' })
  category_id?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(010|011|012|015)\d{8}$/, {
    message: 'WhatsApp number must be a valid Egyptian mobile number',
  })
  whatsapp_number?: string;
}
