import { IsString, MinLength, IsOptional, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Category name must be at least 2 characters long' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Category slug must be at least 2 characters long' })
  slug?: string;

  @IsOptional()
  @IsString()
  icon_url?: string;

  @IsOptional()
  @IsUUID('4', { message: 'parent_id must be a valid UUID' })
  parent_id?: string;
}
