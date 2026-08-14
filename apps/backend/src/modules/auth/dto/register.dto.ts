import {
  IsEmail,
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';
import { UserGender } from '@safqa/types';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  full_name!: string;

  @IsEmail({}, { message: 'Invalid email address format' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsString()
  @Matches(/^(010|011|012|015)\d{8}$/, {
    message: 'Phone number must be a valid Egyptian mobile number (e.g. 01012345678)',
  })
  phone_number!: string;

  @IsEnum(UserGender, { message: 'Gender must be MALE or FEMALE' })
  gender!: UserGender;

  @IsDateString({}, { message: 'Birth date must be a valid ISO date string' })
  birth_date!: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;
}
