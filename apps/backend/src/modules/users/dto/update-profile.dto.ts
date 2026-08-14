import { IsString, IsOptional, MinLength, Matches } from 'class-validator';

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
}
