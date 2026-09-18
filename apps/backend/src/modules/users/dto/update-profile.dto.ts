import { IsString, IsOptional, MinLength, Matches, IsEnum } from 'class-validator';
import { UserGender } from '@safqa/types';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  full_name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(010|011|012|015)\d{8}$/, {
    message: 'Phone number must be a valid Egyptian mobile number',
  })
  phone_number?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;

  @IsOptional()
  @IsEnum(UserGender, { message: 'Gender must be MALE or FEMALE' })
  gender?: UserGender;
}
