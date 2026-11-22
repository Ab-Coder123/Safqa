import {
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCondition } from '@safqa/types';

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Search query cannot exceed 100 characters' })
  q?: string; // Full-text search query

  @IsOptional()
  @IsUUID('4', { message: 'category_id must be a valid UUID' })
  category_id?: string;

  @IsOptional()
  @IsEnum(ProductCondition)
  condition?: ProductCondition;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  min_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  max_price?: number;

  // Pagination — max 20 per page per Product_Discovery_Workflow.md
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 20;
}
