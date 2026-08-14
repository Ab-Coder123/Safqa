import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  current_password!: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  new_password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password confirmation is required' })
  confirm_new_password!: string;
}
