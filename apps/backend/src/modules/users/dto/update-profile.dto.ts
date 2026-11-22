import { IsString, IsOptional, MinLength, MaxLength, Matches, IsEnum } from 'class-validator';
import { UserGender } from '@safqa/types';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Full name cannot exceed 100 characters' })
  full_name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(010|011|012|015)\d{8}$/, {
    message: 'Phone number must be a valid Egyptian mobile number',
  })
  phone_number?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(https?:\/\/|\/uploads\/)/, {
    message: 'Avatar URL must be a valid web URL or uploaded image path',
  })
  avatar_url?: string;

  @IsOptional()
  @IsEnum(UserGender, { message: 'Gender must be MALE or FEMALE' })
  gender?: UserGender;
}
