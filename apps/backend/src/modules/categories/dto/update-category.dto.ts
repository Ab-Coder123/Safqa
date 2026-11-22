import { IsString, MinLength, MaxLength, Matches, IsOptional, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Category name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Category name cannot exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Category slug must be at least 2 characters long' })
  @MaxLength(100, { message: 'Category slug cannot exceed 100 characters' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Category slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(https?:\/\/|\/uploads\/)/, {
    message: 'Icon URL must be a valid URL or uploaded image path',
  })
  icon_url?: string;

  @IsOptional()
  @IsUUID('4', { message: 'parent_id must be a valid UUID' })
  parent_id?: string;
}
